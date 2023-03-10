import './App.css';
import React, {useState, useEffect, createContext} from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import MatchHistory from './Pages/MatchHistory';
import Leaderboard from './Pages/Leaderboard';
import {auth, db} from './firebase-config.js';
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where} from 'firebase/firestore'; 
import NavBar from './Components/NavBar';
import { AuthContext, AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';

// This is the main class, leave the necessary globals.
// Pass any required state into the other routes
export const leagueContext = createContext({});

export async function getPlayerData (id) {
  const playerRef = doc(db, "players", id);
  const playerSnap = await getDoc(playerRef);
  return playerSnap.data();
};


function App() {
  // const {currUser} = useContext(AuthContext)
  const [userLeagues, setUserLeagues] = useState(null)

  var selectLeagueComp = null

  //For setting the current LeagueID.
  const [currLeagueID, setCurrLeagueID] = useState("");
  const [currLeagueName, setCurrLeagueName] = useState("")
  //for adding player to the list/db
  const [players, setPlayers] = useState([]);
  //reference for players "table"
  const playersRef = collection(db, "players");
  //reference for the MatchList table.  Each match has a league-id associated with it.
  const matchListRef = collection(db, 'match history');
  //reference to leagues table

  const getLeagueName = async (leagueID) => {
    if(leagueID == ""){
      setCurrLeagueName("")
      return;
    }
    const leagueRef = doc(db, "leagues", leagueID);
    const leagueSnap = await getDoc(leagueRef)
    const leagueName = leagueSnap.data()['leagueName']
    setCurrLeagueName(leagueName);
  }
    

   // gets the list of players from the db
   const getPlayers = async () => {
    //console.log("getPlayersCalled.  LeagueID: " + currLeagueID)
    const q = query(playersRef, where("leagueID", "==", currLeagueID));
    const data = await getDocs(q)     // below creates a new doc, but replaces id with doc.id
    setPlayers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  }

  // gets matches for curr league
  const getMatchesForLeague = async (leagueID) => {
    const q = query(matchListRef, where("leagueID", "==", leagueID));
    const matchesDoc = await getDocs(q)
    const matches = matchesDoc.docs.map((doc) => ({...doc.data(), id: doc.id}))
    return matches
  } 
  
  useEffect(() => {
    getPlayers();
  }, [currLeagueID])

  useEffect(() => {
    getLeagueName(currLeagueID);
  }, [currLeagueID])

  if(userLeagues != null ) {
    selectLeagueComp = <div id="LeagueSelectContainer" className="DashboardItem">
      {userLeagues.empty ? <h3 id="createLeagueHint">Create a League to Get Started</h3> : null}
      <select className="DashboardSelect"
        id="SelectCurrLeage"
        placeholder='Select a League'
        onChange={(event) => {
          setCurrLeagueID(event.target.value)}}
        defaultValue={currLeagueID}
        >
        {currLeagueID == null || "" ? <option selected disabled hidden>Select League</option> : null }
        {userLeagues.map( (league) => {
          return( <option value={league.id}> {league.leagueName} </option>)
        })}
      </select>
    </div> //LeagueSelectContainer
  } else {
    selectLeagueComp = <div id="LeagueSelectContainer" className="DashboardItem"><p>loading...</p> </div>
  }

  return(
    <AuthProvider>
      <Router>
        <leagueContext.Provider value={{ players, setPlayers, currLeagueName, currLeagueID, setCurrLeagueID,
         matchListRef, playersRef, getPlayers, userLeagues, setUserLeagues, getMatchesForLeague, selectLeagueComp}}>
          <div className="App">
            { auth.currentUser == null ? null : <NavBar leagueName={currLeagueName}/>}
            <div className="body">
              <Routes>
                <Route path="/Game-Leagues/login" element={<LoginPage/>} />
                <Route path="/Game-Leagues/register" element={<RegisterPage/>} />
                <Route path="/Game-Leagues/" element={ <PrivateRoute> <Dashboard /> </PrivateRoute>}/>
                <Route path="/Game-Leagues/matches" element={<PrivateRoute> <MatchHistory /> </PrivateRoute>}/>
                <Route path="/Game-Leagues/leaderboard" element={<PrivateRoute> <Leaderboard/> </PrivateRoute>}></Route>
                <Route path="*" element = {<div> <h1>Error Page</h1></div>} ></Route>
              </Routes>
            </div>
          </div>
        </leagueContext.Provider>
      </Router>
    </AuthProvider>
  );
}

export default App;
