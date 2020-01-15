import React from "react";

function Checker(props){

    let player = props.checker.player;
    let isKing = props.checker.isKing;
    let color = player === 1 ? "checker-player1" : "checker-player2";
    let king = isKing ? " king" : "";
    let classes = "checker " + color + king;
    if(props.checker && props.checker.animate){
        let horizontal = props.checker.animate.horizontal;
        let vertical = props.checker.animate.vertical;
        classes += " " +horizontal + "-" + vertical;
    }  

    return(
        <div className={classes}>
        </div>
    );

}

export default Checker;