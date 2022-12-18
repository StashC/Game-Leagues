import React from 'react';
import { getPlayerData } from '../App';

import './PlayerComponent.css';
class PlayerCard extends React.Component {
    render(){
    return <div className="PlayerDisplay">
                <img source={'/img/avatar.png'}
                alt="LOL"
                height={30}
                width={30}/>
                <h3>{this.props.name}</h3>
                <div className="PlayerStats">
                    <h4>Rating: {this.props.elo} </h4>
                    <h5>{this.props.wins} - {this.props.losses}</h5>
                </div>
        </div>
    }
}
export default React.memo(PlayerCard);