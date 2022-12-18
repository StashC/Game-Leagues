import React from 'react';
import { getPlayerData } from '../App';
import './MatchCard.css'

import './PlayerComponent.css';
class MatchCard extends React.Component { 
    render(){
        return(
            <div className="MatchCard">
                <div id="WinnerInfo" className="PlayerInfo">
                    <h3>{this.props.winner.name}</h3>
                    <div className="eloInfo">
                        <h3 id="playerEloInfoText">{this.props.oldEloWinner + this.props.elo} </h3>
                        <h4 id="winnerEloAdj" className="EloAdjText"> &#160;&#160;{this.props.elo}^</h4>
                    </div>
                </div>
                <h4> VS </h4>
                <div id="LoserInfo" className="PlayerInfo">
                    <h3>{this.props.loser.name}</h3>
                    <div id='LoserEloInfo' className="eloInfo">
                        <h3 id="playerEloInfoText">{this.props.oldEloLoser - this.props.elo} </h3>
                        <h4 id="loserEloAdj" className="EloAdjText">&#160;&#160;{this.props.elo} v</h4>
                    </div>
                </div>
            </div>
        )
    }
}
export default React.memo(MatchCard);