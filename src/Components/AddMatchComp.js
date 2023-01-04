import {useState, useEffect, useContext} from "react";
import React from 'react';
import {db} from '../firebase-config';
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where, Timestamp} from 'firebase/firestore'; 
import PlayerComponent from "./PlayerComponent.js";
import { getPlayerData, leagueContext } from "../App.js";
import PlayerCard from "./PlayerComponent.js";
import './AddMatchComp.css';
import { matchContext, updateMatches } from '../Pages/MatchHistory.js'

function AddMatchComponent() {
    //importing context

    const { updateMatches } = useContext(matchContext)

    const { players, setPlayers, matchListRef, playersRef, currLeagueID } = useContext(leagueContext);
    //for creating a new match  Player IDS in firestore are strings.
    // Variables are in form {value: "...id...", label: "___playername___"}
    const [newMatchPlayer1, setNewMatchPlayer1] = useState();
    const [newMatchPlayer2, setNewMatchPlayer2] = useState();
    const [newMatchVictor, setNewMatchVictor] = useState();
    const [playerOneCard, setPlayerOneCard] = useState(<div className="EmptyPlayerCard"></div>);
    const [playerTwoCard, setPlayerTwoCard] = useState(<div className="EmptyPlayerCard"></div>);

    
    const updatePlayer = async (val, playerNum) => {
        if(playerNum === 1){
            //updatePlayerOneCard
            const playerOneData = await getPlayerData(val)
            setPlayerOneCard(<PlayerCard
                name={playerOneData.name}
                elo={playerOneData.elo}
                wins={playerOneData.wins}
                losses={playerOneData.losses} />)
            //setNewMatchPlayer1
            setNewMatchPlayer1(val)
        }
        if(playerNum === 2) {
            //updatePlayerTwoCard
            const playerTwoData = await getPlayerData(val)
            setPlayerTwoCard(<PlayerCard
                name={playerTwoData.name}
                elo={playerTwoData.elo}
                wins={playerTwoData.wins}
                losses={playerTwoData.losses} />)
            //setNewMatchPlayer2
            setNewMatchPlayer2(val)
        }
    }

    const addMatch = async () => {    
        console.log("vbictor asdasdas: " + newMatchVictor)
        //ToDo add score functionality, and inputs for score
        const player1Data = await getPlayerData(newMatchPlayer1)
        const player2Data = await getPlayerData(newMatchPlayer2)
        
        //Update Player Elo
        var eloAdj = calculateMatchElo(player1Data["elo"], player2Data["elo"], newMatchVictor)
        //var curTime = moment().local().format('YYYY-MM-DD-HH:mm:ss');
        const curTime = Timestamp.now()

        await addDoc(matchListRef,
            {playerOneID: newMatchPlayer1,
            playerTwoID: newMatchPlayer2,
            victorID: newMatchVictor,
            leagueID: currLeagueID,
            eloValue: eloAdj,
            scoreOne: 0,
            scoreTwo: 0,
            oldEloPlayer1: player1Data["elo"],
            oldEloPlayer2: player2Data["elo"],
            time: curTime
         });
        
        if(newMatchVictor == 1){
          //player 1 wins, update players accordingly.
          await updatePlayerRecord(newMatchPlayer1, 1, 0, eloAdj);
          await updatePlayerRecord(newMatchPlayer2, 0, 1, -eloAdj);
        } else {
          //player 2 wins, update players accordingly.
          await updatePlayerRecord(newMatchPlayer1, 0, 1, -eloAdj);
          await updatePlayerRecord(newMatchPlayer2, 1, 0, eloAdj);
        }
        //Update the player cards
        updatePlayer(newMatchPlayer1, 1)
        updatePlayer(newMatchPlayer2, 2)
        updateMatches()
      }
      
      const calculateMatchElo = (player1Elo, player2Elo, victor) => {
        const K = 32
        // Transformed rating
        const R1 = 10**(player1Elo/400)
        const R2 = 10**(player2Elo/400)
    
        // expected elos 
        const E1 = R1 / (R1 + R2)
        const E2 = R2 / (R1 + R2)
        
        // 1 if win, 0.5 if draw, 0 if loss.  Going to calulate the elo adj for S1, and take abs
        let S1 = (victor == "Player 1" || victor == 1) ? 1 : 0
        
        // NEW ELO = r'(1) = r(1) + K * (S(1) - E(1))
        // therefore elo adj = |K*(S1 - E1)|
        return Math.round(Math.abs(K*(S1 - E1)))  
      }

      const updatePlayerRecord = async (id, winAdjust, lossAdjust, eloAdjust) => {
        const playerRef = doc(db, "players", id);
        const playerData = await getPlayerData(id)
        console.log(playerData);
        const newFields = {
           wins: playerData["wins"] + winAdjust,
           losses: playerData["losses"] + lossAdjust,
           elo: playerData["elo"] +  eloAdjust};
        await updateDoc(playerRef, newFields);
      };

  return (
    <div id="CreateMatchContainer">
      <div id="Top">
        <div className="ChoosePlayer">
            <select className="PlayerSelect" name="PlayerOneSelect" onChange={(e) => {updatePlayer(e.target.value, 1)}}>
              <option selected disabled hidden>Choose Player 1</option>
                {players.map( (player) => {
                  if(player.id !== newMatchPlayer2) return( <option value={player.id} > {player.name} </option>
                )})}
             </select>
            {playerOneCard}
        </div>
        
        <h4 className="VsText">VS</h4>

        <div className="ChoosePlayer">
        <select className="PlayerSelect" name="PlayerTwoSelect" onChange={(e) => {updatePlayer(e.target.value, 2)}}>
          <option selected disabled hidden>Choose Player 2</option>
                {players.map( (player) => {
                  if(player.id !== newMatchPlayer1) return( <option value={player.id} > {player.name} </option>
                )})}
             </select>
            {playerTwoCard}
        </div>

        </div>
        <div id="bottom">
            <select className="PlayerSelect" name="VictorSelect" onChange={(e) => (setNewMatchVictor(e.target.value))}>
                <option selected disabled hidden>Select Winner</option>  
                <option value={1}>Player 1</option>
                <option value={2}>Player 2</option>
            </select>
          <button onClick={addMatch}> Record Match </button>
         </div>
        </div>
  )
}

export default AddMatchComponent