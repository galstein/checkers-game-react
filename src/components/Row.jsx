import React from "react";
import Square from "./Square";

function Row(props){

   
    return (
        <div className="row">
            {props.fullRow.map((square,i) => {
                let isChecker = square !== null ? true : false;
                return <Square 
                key={i} 
                row={props.row} 
                col={i} 
                isChecker={isChecker} 
                checker={props.checkers[square]}
                selectSquare={props.selectSquare}
                isSelected={props.selectedSquare && props.selectedSquare.col === i ? true : false}/>
            })}
      </div>
    );

}

export default Row;