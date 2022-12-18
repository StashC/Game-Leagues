import './App.css';
import React, {useState, useEffect, useContext, createContext} from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import MatchHistory from './Pages/MatchHistory';
import Leaderboard from './Pages/Leaderboard';
import {db} from './firebase-config.js';
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where} from 'firebase/firestore'; 
import NavBar from './Components/NavBar';


// This is the main class, leave the necessary globals.
// Pass any required state into the other routes
export const leagueContext = createContext({});

export async function getPlayerData (id) {
  const playerRef = doc(db, "players", id);
  const playerSnap = await getDoc(playerRef)
  return playerSnap.data();
};

function App() {
  //For setting the current LeagueID.
  const [currLeagueID, setCurrLeagueID] = useState("48nZ6PosAQoERw4b09QS");
  const [currLeagueName, setCurrLeagueName] = useState("")
  //for adding player to the list/db
  const [players, setPlayers] = useState([]);
  //reference for players "table"
  const playersRef = collection(db, "players");
  //reference for the MatchList table.  Each match has a league-id associated with it.
  const matchListRef = collection(db, 'match history');
  //reference to leagues table

  const getLeagueName = async (leagueID) => {
    const leaguesRef = doc(db, "leagues", leagueID);
    const playerSnap = await getDoc(leaguesRef)
    const leagueName = playerSnap.data()['leagueName']
    console.log(leagueName)
    setCurrLeagueName(leagueName);
  }
    
   // gets the list of players from the db
   const getPlayers = async () => {
    const q = query(playersRef, where("leagueID", "==", "48nZ6PosAQoERw4b09QS"));
    const data = await getDocs(q)     // below creates a new doc, but replaces id with doc.id
    setPlayers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  }  
  
  useEffect(() => {
  getPlayers();
  getLeagueName(currLeagueID);}, [])

    return(
      <Router>
        <div className="App">
          <NavBar leagueName={currLeagueName}/>
          <div className="body">
          <leagueContext.Provider value={{ players, setPlayers, currLeagueID, setCurrLeagueID, matchListRef }}>
            <Routes>
                <Route path="/" element={<Dashboard />}/>
                <Route path="/matches" element={<MatchHistory />}/>
                <Route path="/leaderboard" element={<Leaderboard />}></Route>
                <Route path="*" element = {<div> <h1>Error Page</h1></div>} ></Route>
              
            </Routes>
            </leagueContext.Provider>
          </div>

        </div>
      </Router>

  );
}

export default App;
