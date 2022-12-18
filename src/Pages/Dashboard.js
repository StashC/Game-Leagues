import {useState, useEffect, useContext} from "react";
import {db} from '../firebase-config'
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where} from 'firebase/firestore'; 
import Select, { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';
import PlayerComponent from "../Components/PlayerComponent.js";
import AddMatchComponent from "../Components/AddMatchComp";
import { leagueContext } from '../App.js'

function Dashboard() {
  const { players, setPlayers, matchListRef, playersRef } = useContext(leagueContext);


      //for setting the name of the player to be added
      const [newName, setNewName] = useState("")
      const addPlayer = async () => {
        await addDoc(playersRef, {name: newName, elo: 1000, wins: 0, losses: 0, leagueID: "asda"})
      }
    
    // const updatePlayerRecord = async (id, winAdjust, lossAdjust, eloAdjust) => {
    //   const playerRef = doc(db, "players", id);
    //   const playerData = await getPlayerData(id)
    //   console.log(playerData);
    //   const newFields = {
    //      wins: playerData["wins"] + winAdjust,
    //      losses: playerData["losses"] + lossAdjust,
    //      elo: playerData["elo"] +  eloAdjust};
    //   await updateDoc(playerRef, newFields);
    // };
  
  
    const setPlayerRecord = async (id, wins, losses, elo) => {
      const playerRef = doc(db, "players", id);
      const newFields = {
        wins: wins,
        losses: losses,
        elo: elo};
     await updateDoc(playerRef, newFields);
    }
  
    
    const resetLeague = ()  => {
      players.map( (player) => {
        setPlayerRecord(player.id, 0, 0, 1000)
      })
    }
  
  
    return (
      <div className="Dashboard">
      <input
        placeholder="Name...." 
        onChange={(event) => {setNewName(event.target.value)}} 
        />
        <button onClick={addPlayer}> Add Player </button>
  
        {/* Div for creating a new match between players */}
        <div className='leaderboard'>
        {players.map((player) => {
          return(
            <PlayerComponent key={player.name} name={player.name}
             elo={player.elo}
             wins={player.wins}
             losses={player.losses} />
          );
        })}
        </div>
        <button onClick={resetLeague}> Reset Scores</button>
      </div>
    );
  }
  
  export default Dashboard;