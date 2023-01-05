import {useState, useEffect, useContext} from "react";
import {db} from '../firebase-config'
import {collection, getDocs, addDoc, doc, updateDoc, getDoc, query, where, deleteDoc} from 'firebase/firestore'; 
import PlayerComponent from "../Components/PlayerComponent.js";
import { leagueContext } from '../App.js'
import { AuthContext } from "../Auth";
import './Dashboard.css'

function Dashboard() {
  const { players, currLeagueID, setCurrLeagueID, playersRef, getPlayers, getMatchesForLeague, userLeagues, setUserLeagues, selectLeagueComp } = useContext(leagueContext);
  const { currUser } = useContext(AuthContext)
  
  
  //for setting the name of the player to be added
  const [newName, setNewName] = useState("")
  const addPlayer = async () => {
    if(currLeagueID == null || currLeagueID == ""){ 
      console.log("Failed to create player, LeagueID is null or empty.  LeagueID: " + currLeagueID)
      return
    };
    await addDoc(playersRef, {name: newName, elo: 1000, wins: 0, losses: 0, leagueID: currLeagueID})
    //update player list
    getPlayers()
  }
  
  const leaguesRef = collection(db, "leagues");
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
   
    //delete matches.  Before players is most likely a better Idea,
    // as matches can reference players, but not vice versa. 
    const matchesToDelete = await getMatchesForLeague(id)
    console.log(matchesToDelete)
    
    await matchesToDelete.map( async (match) => {
      const matchRef = doc(db, "match history", match.id)
      await deleteDoc(matchRef)
    })

     // delete all records of players.
     const playerIDsToDelete = players.map( (player) => {
      return player.id
    })
    await playerIDsToDelete.map( async (id) =>  {
      const playerRef = doc(db, "players", id)
      await deleteDoc(playerRef)
    })

    //delete selected league
    const leagueRef = doc(db, "leagues", id)
    await deleteDoc(leagueRef) 

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
  
  const resetLeague = async ()  => {
    players.map( (player) => {
      setPlayerRecord(player.id, 0, 0, 1000)
    })

    const matchesToDelete = await getMatchesForLeague(currLeagueID)
    console.log(matchesToDelete)
    
    await matchesToDelete.map( async (match) => {
      const matchRef = doc(db, "match history", match.id)
      await deleteDoc(matchRef)
    })

    getPlayers()
  }

  const getLeagues = async () => {
    if(currUser == null) { return}
    //console.log(currUser.uid)
    const q = query(leaguesRef, where("userID", "==", currUser.uid ))
    const data = await getDocs(q)
    const leagues = data.docs.map( (doc) => ({...doc.data(), id: doc.id}))
    if(leagues.length == 0){
      setUserLeagues([]) 
      setCurrLeagueID("")
    } else {
      setCurrLeagueID(leagues[0].id)
      setUserLeagues(leagues)
    }   
  }


  useEffect(() => {
    if(currLeagueID == "" || currLeagueID == null){
      getLeagues()
    }
    }, [])
  
    return (
      <div className="Dashboard">
        <div id="leftPanel" className="panel">
          <div id="leagueContainer">
            <div id="select-league-container">
              <h3> Select League</h3> 
              {selectLeagueComp}
            </div>
            <div id="createLeagueContainer">
            <h3>Create League</h3>
            <input className="DefaultInput" placeholder="EnterLeagueName"
              onChange={(event) => {setNewLeagueName(event.target.value)}}/>

            <button className="DashboardButton" id="createLeagueButton"
              onClick={createLeague}>
              Create League
            </button>
            </div>
          </div>

          {/* Players List goes here */}
          <div className='playerlist'>
            {players.map((player) => {
              return(
                <PlayerComponent className="Players" key={player.name} name={player.name}
                elo={player.elo}
                wins={player.wins}
                losses={player.losses} />
              );
            })}
         </div>
      </div>
        <div id="rightPanel" className="panel">
          

          <div id="addPlayer">
            <h3> Add Player </h3>
            <input
              className="DefaultInput"
              placeholder="Name...." 
              onChange={(event) => {
                setNewName(event.target.value)}} />
              <button className="DashboardButton" onClick={addPlayer}> Add Player </button>
          </div>
          <button className="DashboardButton" onClick={resetLeague}> Reset Scores</button>
          <button className="DashboardButton"
           onClick={ () => {
            console.log("called")
            deleteLeague(currLeagueID)
            }}
            > Delete League</button>

        </div>        
      </div>
    );
  }

  export default Dashboard;