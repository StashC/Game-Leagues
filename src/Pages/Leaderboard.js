import React, { useContext, useEffect, useState } from 'react'
import { leagueContext } from '../App';
import PlayerComponent from '../Components/PlayerComponent';
import './Leaderboard.css'

function Leaderboard() {

  const { players, currLeagueID, setCurrLeagueID, selectLeagueComp, getPlayers, currLeagueName } = useContext(leagueContext);

  const [leaderBoardComponent, setLeaderBoard] = useState(<div></div>)
  const sortPlayers = () => {
    console.log(players)
    var list = players
    list.sort(function(a, b){
      return (b.elo - a.elo);
    })
    console.log(list)
    return list
  }

  const updateLeaderBoard = () => {
    const sortedPlayers = sortPlayers()
    console.log(sortedPlayers)
    setLeaderBoard(<div id="leaderBoardComponent">
      <div id="podiumFirstRow">
        { sortedPlayers[0] != null ?
          <div id="FirstPlaceCard">
          <PlayerComponent
              name={sortedPlayers[0].name}
              elo={sortedPlayers[0].elo}
              wins={sortedPlayers[0].wins}
              losses={sortedPlayers[0].losses}
            /> 
          </div> : null }
      </div>
            
      <div id="PodiumSecondRow">
        { sortedPlayers[1] != null ?
          <div id="SecondPlaceCard">
            <PlayerComponent
                name={sortedPlayers[1].name}
                elo={sortedPlayers[1].elo}
                wins={sortedPlayers[1].wins}
                losses={sortedPlayers[1].losses}
                />
            </div> : null }

        { sortedPlayers[2] != null ?
          <div id="ThirdPlaceCard">
          <PlayerComponent
              name={sortedPlayers[2].name}
              elo={sortedPlayers[2].elo}
              wins={sortedPlayers[2].wins}
              losses={sortedPlayers[2].losses}
            /> 
          </div>: null }
      </div>

      <div id="scrollableLeaderboard">
      {sortedPlayers.slice(3).map((player) => {
        return(
          <PlayerComponent key={player.name} name={player.name}
            elo={player.elo}
            wins={player.wins}
            losses={player.losses} />
        );
      })}
      </div>
    </div>)
  }

  useEffect(() => {
    updateLeaderBoard()
    }, [players])

  return (
    <div>
      <h1>Leaderboard</h1>
      <h2 id="leagueNameDisplay"> {currLeagueName}</h2>
        {selectLeagueComp}
        <div className='leaderboard'>
          {leaderBoardComponent}
        </div>
    </div>
  )
}

export default Leaderboard;