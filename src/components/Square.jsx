import React from "react";
import Checker from "./Checker";

function Square(props){

        let color = (props.row + props.col) % 2 === 0 ? "square-color1" : "square-color2";
        let selected = props.isSelected ? " selected" : "";
        let classes = "square " + color + selected;
        
        
//props.selectSquare.bind(this,props.row,props.col)
//()=>props.selectSquare(props.row,props.col) ------- worked
        return (
            <div className={classes} onClick={()=>props.selectSquare(props.row,props.col)}>
                {props.isChecker && <Checker checker={props.checker}/>}
            </div>
        );
}

export default Square;