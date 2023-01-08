import React, { Component} from 'react'
import { Link } from 'react-router-dom'
import {} from '../App'
import './NavBar.css'
import { AiFillHome } from "react-icons/ai";
import { logout } from '../Auth';
class NavBar extends Component {
  render() {
    return (        
        <div className="NavBar">
        <Link to="/Game-Leagues/"> <AiFillHome id="homeIcon" /> </Link>
            {this.props.leagueName === "" ? (
                <h2></h2>
            ) : (<h2>{this.props.leagueName}</h2>) }
        <Link className='textLink' to="/Game-Leagues/leaderboard"> <h3>Leaderboard</h3></Link>
        <Link className='textLink' to="/Game-Leagues/matches"> <h3> Matches </h3> </Link>
        <button id="logoutNavButton" onClick={logout}> Sign Out</button>
      </div>
    )
  }
}
export default NavBar;

