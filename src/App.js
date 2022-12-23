import './App.css';
import React, {useState, useEffect, useContext, createContext} from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, redirect} from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import MatchHistory from './Pages/MatchHistory';
import Leaderboard from './Pages/Leaderboard';
import {auth, db} from './firebase-config.js';
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where} from 'firebase/firestore'; 
import NavBar from './Components/NavBar';
import AuthPage from './Pages/AuthPage';
import { AuthContext, AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';

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
    const leagueRef = doc(db, "leagues", leagueID);
    const leagueSnap = await getDoc(leagueRef)
    const leagueName = leagueSnap.data()['leagueName']
    // console.log(leagueName)
    setCurrLeagueName(leagueName);
  }
    

   // gets the list of players from the db
   const getPlayers = async () => {
    console.log("getPlayersCalled " + currLeagueID)
    const q = query(playersRef, where("leagueID", "==", currLeagueID));
    const data = await getDocs(q)     // below creates a new doc, but replaces id with doc.id
    setPlayers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  }

  // gets matches for curr league
  const getMatchesForLeague = async (leagueID) => {
    const q = query(matchListRef, where("leagueID", "==", leagueID));
    const matchesDoc = await getDocs(q)
    const matches = matchesDoc.docs.map((doc) => ({...doc.data(), id: doc.id}))
    console.log(matches)
    return matches
  }
  
  useEffect(() => {
  getPlayers();
  // redirect("/login")
  // getLeagueName(currLeagueID);}, [currLeagueID, currUser])
  }, [currLeagueID])

  useEffect(() => {
    getLeagueName(currLeagueID);
  }, [currLeagueID])

  return(
    <AuthProvider>
      <Router>
        <leagueContext.Provider value={{ players, setPlayers, currLeagueID, setCurrLeagueID, matchListRef, playersRef, getPlayers,  getMatchesForLeague}}>
          <div className="App">
            <NavBar leagueName={currLeagueName}/>
            <div className="body">
              <Routes>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/" element={ <PrivateRoute> <Dashboard /> </PrivateRoute>}/>
                <Route path="/matches" element={<PrivateRoute> <MatchHistory /> </PrivateRoute>}/>
                <Route path="/leaderboard" element={<PrivateRoute> <Leaderboard/> </PrivateRoute>}></Route>
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
