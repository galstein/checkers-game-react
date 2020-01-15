import React from "react";

function Welcome(props){

    return (
        <div className="welcome">
            <div className="container">
                <h1 id="logo">Welcome To Checkers Game!</h1>
                <ul className="menu"><li onClick={props.playGame}><span>play</span></li></ul>
            </div>
        </div>
    );
}

export default Welcome;