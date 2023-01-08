import React, {useState, useEffect, useContext, createContext} from 'react'
import { leagueContext } from '../App.js'
import AddMatchComponent from '../Components/AddMatchComp.js'
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where} from 'firebase/firestore'; 
import './MatchHistory.css'
import MatchCard from '../Components/MatchCard.js';
import { getPlayerData } from '../App.js';


//TODO Sort match history by match time descending.

export const matchContext = createContext({});

function MatchHistory() {
  var matchListComp = null
  const { matchListRef, players, currLeagueID, getMatchesForLeague } = useContext(leagueContext)

  // const getMatchesForLeague = async (leagueID) => {
  //   const q = query(matchListRef, where("leagueID", "==", "48nZ6PosAQoERw4b09QS"));
  //   const data = await getDocs(q)
  //   console.log(data)
  //   return data
  // }
  const [leagueMatches, setMatches] = useState([])

  // async function updateMatches() {
  //   console.log("Called update matches")
  //   const matchesDoc = await getMatchesForLeague(currLeagueID)
  //   const matches = matchesDoc.docs.map((doc) => ({...doc.data(), id: doc.id}))
  //   setMatches(matches)
  // }

  async function updateMatches() {
    const matches = await getMatchesForLeague(currLeagueID)
    setMatches(matches)
  }

  function getPlayerDataFromList(id){
    return players.filter( player => player.id == id)[0]
  }
 
  if(Array.isArray(leagueMatches)) {
    matchListComp = <div id='match-list-container'>
      {leagueMatches.map( (match) => {
        if(match.victorID == 1) {
          const winner = getPlayerDataFromList(match.playerOneID)
          const oldEloWinner = match.oldEloPlayer1
          const loser = getPlayerDataFromList(match.playerTwoID)
          const oldEloLoser = match.oldEloPlayer2
          return( 
            <MatchCard 
              winner={winner}
              loser={loser}
              elo={match.eloValue}
              oldEloLoser={oldEloLoser}
              oldEloWinner={oldEloWinner}
            /> )
        } else {
          const winner = getPlayerDataFromList(match.playerTwoID)
          const oldEloWinner = match.oldEloPlayer2
          const loser = getPlayerDataFromList(match.playerOneID)
          const oldEloLoser = match.oldEloPlayer1
          return(
             <MatchCard 
              winner={winner}
              loser={loser}
              elo={match.eloValue}
              oldEloLoser={oldEloLoser}
              oldEloWinner={oldEloWinner}
            /> )
        }        
      })}
    </div>
  } else {
    matchListComp = <div id='match-list-container'/>
  }

  useEffect(() => {
    updateMatches()}, [])
  
  return (
    <div className = "MatchHistory">
      <matchContext.Provider value={{ updateMatches }}>
        <AddMatchComponent />
      </matchContext.Provider>
        <div id='matchlist'>
            <h1> Match History</h1>
            {matchListComp}
        </div>
    </div>
  )
}

export default MatchHistory  