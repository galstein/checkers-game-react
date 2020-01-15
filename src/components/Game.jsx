import React from "react";
import Board from "./Board";

function Game(props){

    let playerColor = props.turn===1 ? "turn-player1" : "turn-player2";
 
    return (
        <div id="game">
            <h1 id="turn">Turn: <span className={playerColor}>{props.turn===1 ? "Player 1" : "Player 2"}</span></h1>
            <Board 
            board={props.board} 
            checkers={props.checkers} 
            selectSquare={props.selectSquare}
            selectedSquare={props.selectedSquare}/>
        </div>  
    );
}

export default Game;