import React from "react";
import Row from "./Row";

function Board(props){
 
    return (
        <div className="board">
            {props.board.map((row,i) => {
              return <Row 
              key={i} 
              fullRow={row} 
              row={i} 
              checkers={props.checkers} 
              selectedSquare={props.selectedSquare && props.selectedSquare.row === i ? props.selectedSquare : null}
              selectSquare={props.selectSquare}/>
            })}
      </div>
    );

}

export default Board;