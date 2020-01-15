import React from "react";

function GameOver(props) {

    let player = props.winner === 1? "Player 1" : "Player 2";

    return (
      <div id="winner">
        <div>
          <p>{player}<br/> has won the game!</p>
          <ul id="game-over-btn" className="menu"><li onClick={props.restart}><span>back to menu</span></li></ul>
        </div>
      </div>
    );
  }

  export default GameOver;