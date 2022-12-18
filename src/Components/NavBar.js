import React, { Component} from 'react'
import { Link } from 'react-router-dom'
import {} from '../App'
import './NavBar.css'
import { AiFillHome } from "react-icons/ai";

class NavBar extends Component {
  render() {
    return (        
        <div className="NavBar">
        <Link to="/"> <AiFillHome id="homeIcon" /> </Link>
            {this.props.leagueName === "" ? (
                <h2>loading</h2>
            ) : (<h2>{this.props.leagueName}</h2>) }
        <Link className='textLink' to="/leaderboard"> <h3>Leaderboard</h3></Link>
        <Link className='textLink' to="/matches"> <h3> Matches </h3> </Link>
      </div>
    )
  }
}
export default NavBar;

