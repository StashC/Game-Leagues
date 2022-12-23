import {useState, useEffect, useContext} from "react";
import {db} from '../firebase-config'
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where, deleteDoc} from 'firebase/firestore'; 
import PlayerComponent from "../Components/PlayerComponent.js";
import { leagueContext } from '../App.js'
import { AuthContext } from "../Auth";
import './Dashboard.css'

function Dashboard() {
  const { players, currLeagueID, setCurrLeagueID, playersRef, getPlayers } = useContext(leagueContext);
  const { currUser } = useContext(AuthContext)
  
  
  //for setting the name of the player to be added
  const [newName, setNewName] = useState("")
  const addPlayer = async () => {
    console.log(playersRef)
    console.log(currLeagueID)
    console.log(newName)
    await addDoc(playersRef, {name: newName, elo: 1000, wins: 0, losses: 0, leagueID: currLeagueID})
    //update player list
    getPlayers()
  }
  
  
  const [userLeagues, setUserLeagues] = useState(null)
  const leaguesRef = collection(db, "leagues");
  var selectLeagueComp = null
  const [newLeagueName, setNewLeagueName] = useState("")

  const createLeague = async() => {
    const leagueNames = userLeagues.map( (league) => { return league.leagueName})
    if(!leagueNames.includes(newLeagueName) && newLeagueName != ""){
      //create a league
      await addDoc(leaguesRef, {leagueName: newLeagueName, userID: currUser.uid})
      //update list of leagues
      getLeagues()
    } else {
      console.log("Name must be non-empty and unique")
    }
  }

  //TODO add Popup
  const deleteLeague = async (id) => {
    console.log("deletedLeague called")
    // delete all records of players.
    const playerIDsToDelete = players.map( (player) => {
      return player.id
    })
    await playerIDsToDelete.map( async (player) =>  {
      const playerRef = doc(db, "players", player.id)
      await deleteDoc(playerRef)
    })

    //update league list, will also set currLeagueID to 
    await getLeagues()
  }
    

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

  const getLeagues = async () => {
    if(currUser == null) { return}
    //console.log(currUser.uid)
    const q = query(leaguesRef, where("userID", "==", currUser.uid ))
    const data = await getDocs(q)
    const leagues = data.docs.map( (doc) => ({...doc.data(), id: doc.id}))
    // console.log(leagues)
    if(leagues.empty){
      setUserLeagues([]) 
      setCurrLeagueID("")
    } else {
      setCurrLeagueID(leagues[0].id)
      setUserLeagues(leagues)
    }   
  }

  if(userLeagues != null ) {
    selectLeagueComp = <div id="LeagueSelectContainer" className="DashboardItem">
      {userLeagues.empty ? <h3 id="createLeagueHint">Create a League to Get Started</h3> : null}
      <select className="DashboardSelect" id="SelectCurrLeage"
        onChange={(event) => {
          setCurrLeagueID(event.target.value)}}
        >
        {userLeagues.map( (league) => {
          return( <option value={league.id}> {league.leagueName} </option>)
        })}
      </select>
    </div> //LeagueSelectContainer
  } else {
    selectLeagueComp = <div id="LeagueSelectContainer" className="DashboardItem"><p>loading...</p> </div>
  }

  useEffect(() => {
    getLeagues()
    }, [])
  
    return (
      <div className="Dashboard">
        <div id="leftPanel" className="panel">
          <div id="leagueContainer">
            <h3> Select League</h3>
            {selectLeagueComp}
          </div>

          <div className='leaderboard'>
            {players.map((player) => {
              return(
                <PlayerComponent className="Players" key={player.name} name={player.name}
                elo={player.elo}
                wins={player.wins}
                losses={player.losses} />
              );
            })}
         </div>
          
          {/* Players List goes here */}
        </div>

        <div id="rightPanel" className="panel">
          <div id="createLeagueContainer">
            <h3>Create League</h3>
            <input className="DashboardInput" placeholder="EnterLeagueName"
              onChange={(event) => {setNewLeagueName(event.target.value)}}/>

            <button className="DashboardButton" id="createLeagueButton"
              onClick={createLeague}>
              Create League
            </button>
          </div>

          <div id="addPlayer">
            <h3> Add Player </h3>
            <input
              placeholder="Name...." 
              onChange={(event) => {
                setNewName(event.target.value)}} />
              <button className="DashButton" onClick={addPlayer}> Add Player </button>
          </div>
          <button className="DashButton" onClick={resetLeague}> Reset Scores</button>
          <button className="DashButton" onClick={deleteLeague}> Delete League</button>

        </div>        
      </div>
    );
  }

  export default Dashboard;