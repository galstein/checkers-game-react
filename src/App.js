/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import Game from "./components/Game";
import Welcome from "./components/Welcome";
import GameOver from "./components/GameOver";


class App extends Component {
    constructor() {
        super();
        this.state = { board: this.getBoard(),
                       checkers: this.getCheckers(), 
                       turn: 1, 
                       selectedSquare: null, 
                       winner: null,
                       welcome: true};
    
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.turn !== this.state.turn) {
            if (!this.hasMoves(this.state.turn)) {
                setTimeout(()=>{ this.setState({winner: this.nextPlayer()}); }, 700); 
            }
        }
    }

    getBoard(){
        let board = [
                    [null, 12, null, 13, null, 14, null, 15],
                    [16, null, 17, null, 18, null, 19, null],
                    [null, 20, null, 21, null, 22, null, 23],
                    [null, null, null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null],
                    [8, null, 9, null, 10, null, 11, null],
                    [null, 4, null, 5, null, 6, null, 7],
                    [0, null, 1, null, 2, null, 3, null]
        ]
        return board;
    }

    getCheckers(){
        let checkers = [{player: 1,isKing: false,row: 7,col: 0,removed: false}, 
                        {player: 1,isKing: false,row: 7,col: 2,removed: false},
                        {player: 1,isKing: false,row: 7,col: 4,removed: false},
                        {player: 1,isKing: false,row: 7,col: 6,removed: false},
                        {player: 1,isKing: false,row: 6,col: 1,removed: false},
                        {player: 1,isKing: false,row: 6,col: 3,removed: false},
                        {player: 1,isKing: false,row: 6,col: 5,removed: false},
                        {player: 1,isKing: false,row: 6,col: 7,removed: false},
                        {player: 1,isKing: false,row: 5,col: 0,removed: false},
                        {player: 1,isKing: false,row: 5,col: 2,removed: false},
                        {player: 1,isKing: false,row: 5,col: 4,removed: false},
                        {player: 1,isKing: false,row: 5,col: 6,removed: false},
                        {player: 2,isKing: false,row: 0,col: 1,removed: false},
                        {player: 2,isKing: false,row: 0,col: 3,removed: false},
                        {player: 2,isKing: false,row: 0,col: 5,removed: false},
                        {player: 2,isKing: false,row: 0,col: 7,removed: false},
                        {player: 2,isKing: false,row: 1,col: 0,removed: false},
                        {player: 2,isKing: false,row: 1,col: 2,removed: false},
                        {player: 2,isKing: false,row: 1,col: 4,removed: false},
                        {player: 2,isKing: false,row: 1,col: 6,removed: false},
                        {player: 2,isKing: false,row: 2,col: 1,removed: false},
                        {player: 2,isKing: false,row: 2,col: 3,removed: false},
                        {player: 2,isKing: false,row: 2,col: 5,removed: false},
                        {player: 2,isKing: false,row: 2,col: 7,removed: false}         
            ]
            return checkers;
    }

    changeWelcome(){
        this.setState({welcome: false});
    }

    setSquare(row,col){
        this.setState({selectedSquare: {row: row, col: col}});
    }

    selectSquare(row,col){
        let selected = this.state.selectedSquare;
        if (this.canSelectSquare(row, col)) {
            //console.log("🚪This is resource square of current player");
            this.setSquare(row, col);
          } else if (selected != null) {
            //console.log("🚩This is destination square of current player");
            this.handleMove(row, col);
          }
          else{
            console.log("🚫This square is OR null OR not of current player");
          }
    }

    handleMove(destRow,destCol){
        let board = this.state.board;
        let selected = this.state.selectedSquare;
        let checker = board[selected.row][selected.col];
        if (!this.canMoveChecker(checker, destRow, destCol)) {
          console.log("❌illegal move❌");
          return;
        }
        this.makeAnimate(checker,destRow,destCol);
        let isJump = this.isJumpMove(checker, destRow, destCol);
        let isKingJump = this.isKingJump(checker, destRow, destCol);
        let becameKing = false;
        this.moveChecker(checker, destRow, destCol);
        if (!this.isKing(checker) && ((this.getPlayer(checker) === 1 && destRow === 0) || 
        (this.getPlayer(checker) === 2 && destRow === ((board.length)-1)))) {
          console.log("making King....");
          becameKing = true;
          this.makeKing(checker);
        }
        if(!becameKing && isKingJump && this.canKeepJumping(checker)){
          this.setState({board: board, selectedSquare: {row: destRow, col: destCol}});
        }
        else if (!becameKing && isJump && this.canKeepJumping(checker)) {
          this.setState({board: board, selectedSquare: {row: destRow, col: destCol}});
        } else {
          this.setState({board: board, turn: this.nextPlayer(), selectedSquare: null, animation: true});
        }
    }

    canSelectSquare(row, col) {
        let square = this.state.board[row][col];
        if (!square && square !== 0) {
          return false;
        }
        let player = this.state.checkers[square].player;
        return player === this.state.turn;
    }
    
    nextPlayer() {
        return (this.state.turn === 1 ? 2 : 1)
    }
    
    restart() {
        this.setState({ board: this.getBoard(),
                        checkers: this.getCheckers(), 
                        turn: 1, 
                        selectedSquare: null, 
                        winner: null,
                        welcome: true});
    }

    hasMoves(player) {
        let moves = this.getAllMoves(player);
        return moves.jumps.length + moves.singles.length > 0;
    }

    canMoveChecker(checker, row, col) {
        let player = this.state.checkers[checker].player;
        let playerMoves = this.getAllMoves(player);
        let checkerMoves = this.getMoves(checker);
        let playerJumps = playerMoves.jumps;
        let checkerJumps = checkerMoves.jumps;
        if (playerJumps.length && !checkerJumps.length) {
            checkerMoves = {
                singles: [],
                jumps: []
            };
        }
        let moves = checkerMoves;
        let movesToCheck = moves.jumps.length ? moves.jumps : moves.singles;
        for (let move of movesToCheck) {
            if (move.row === row && move.col === col) {
                return true;
            }
        }
        return false;
    }
    

    getAllMoves(player) {
        let moves = {
            jumps: [],
            singles: []
        };
        let checkers = this.state.checkers;
        checkers.forEach((checker, i) => {
            if (checker.player === player && !checker.removed) {
                let cMoves = this.getMoves(i);
                moves.jumps = (moves.jumps).concat(cMoves.jumps);
                moves.singles = (moves.singles).concat(cMoves.singles);
            }
        });
        return moves;
    }

    canKeepJumping(checker) {
        let moves = this.getMoves(checker).jumps;
        if (moves.length) {
            return true;
        }
        return false;
    }

    getMoves(checker) {
        let singles = [];
        let jumps = [];
        let c = this.state.checkers[checker];
        let topRow = c.row - 1;
        let bottomRow = c.row + 1;
        let leftCol = c.col - 1;
        let rightCol = c.col + 1;
        if (c.player === 1 || c.isKing) {
            jumps = this.checkJumps(topRow, topRow - 1, leftCol, rightCol, leftCol - 1, rightCol + 1, c);
            if (!jumps.length) {
                singles = this.checkAdjacent(topRow, leftCol, rightCol, c);
            }
        }
        if (c.player === 2 || c.isKing) {
            jumps = jumps.concat(this.checkJumps(bottomRow, bottomRow + 1, leftCol, rightCol, leftCol - 1, rightCol + 1, c));
            if (!jumps.length) {
                singles = singles.concat(this.checkAdjacent(bottomRow, leftCol, rightCol, c));
            }
        }
        return {
            singles: singles,
            jumps: jumps
        };
    }

    checkAdjacent(row, left, right, checker) {
        let moves = [];
        if (row >= this.state.board.length || row < 0) {
            return moves;
        }
        if(checker.isKing  && checker.row-row > 0){
            let i=0;
            while(row-i >= 0 && left-i >= 0 && this.state.board[row-i][left-i] === null){
                moves.push({
                    row: row-i,
                    col: left-i
                });
                i++;
            }
        }
        else if(checker.isKing  && checker.row-row < 0){
            let i=0;
            while(row+i < this.state.board.length && left-i >= 0 && this.state.board[row+i][left-i] === null){
                moves.push({
                    row: row+i,
                    col: left-i
                });
                i++;
            }
        }
        else if (this.state.board[row][left] === null) {
            moves.push({
                row: row,
                col: left
            });
        }
        if(checker.isKing  && checker.row-row > 0){
            let i=0;
            while(row-i >= 0 && right+i < this.state.board.length && this.state.board[row-i][right+i] === null){
                moves.push({
                    row: row-i,
                    col: right+i
                });
                i++;
            }
        }
        else if(checker.isKing  && checker.row-row < 0){
            let i=0;
            while(row+i < this.state.board.length && right+i < this.state.board.length && this.state.board[row+i][right+i] === null){
                moves.push({
                    row: row+i,
                    col: right+i
                });
                i++;
            }
        }
        else if (this.state.board[row][right] === null) {
            moves.push({
                row: row,
                col: right
            });
        }
        return moves;
    }

    checkJumps(row, nextRow, left, right, nextLeft, nextRight, checker) {
        let moves = [];
        if (row >= this.state.board.length || row < 0 || nextRow >= this.state.board.length || nextRow < 0) {
            return moves;
        }
        let adjacent = this.state.board[row][left];
        if (adjacent != null && this.state.checkers[adjacent].player !== checker.player) {
            if(checker.isKing  && nextRow-row === -1){
                let i=0;
                while(nextRow-i >= 0 && nextLeft-i >= 0 && this.state.board[nextRow-i][nextLeft-i] === null){
                    moves.push({
                        row: nextRow-i,
                        col: nextLeft-i
                    });
                    i++;
                }
            }
            else if(checker.isKing  && nextRow-row === 1){
                let i=0;
                while(nextRow+i < this.state.board.length && nextLeft-i >= 0 && this.state.board[nextRow+i][nextLeft-i] === null){
                    moves.push({
                        row: nextRow+i,
                        col: nextLeft-i
                    });
                    i++;
                }
            }
            else if (this.state.board[nextRow][nextLeft] === null) {
                moves.push({
                    row: nextRow,
                    col: nextLeft
                });
            }
        }
        adjacent = this.state.board[row][right];
        if (adjacent != null && this.state.checkers[adjacent].player !== checker.player) {
            if(checker.isKing  && nextRow-row === -1){
                let i=0;
                while(nextRow-i >= 0 && nextRight+i < this.state.board.length && this.state.board[nextRow-i][nextRight+i] === null){
                    moves.push({
                        row: nextRow-i,
                        col: nextRight+i
                    });
                    i++;
                }
            }
            else if(checker.isKing  && nextRow-row === 1){
                let i=0;
                while(nextRow+i < this.state.board.length && nextRight+i < this.state.board.length && this.state.board[nextRow+i][nextRight+i] === null){
                    moves.push({
                        row: nextRow+i,
                        col: nextRight+i
                    });
                    i++;
                }
            }
            else if (this.state.board[nextRow][nextRight] === null) {
                moves.push({
                    row: nextRow,
                    col: nextRight
                });
            }
        }
        return moves;
    }

    moveChecker(checker, row, col) {
        let c = this.state.checkers[checker];
        let cRow = c.row;
        let cCol = c.col;
        if (this.isJumpMove(checker, row)) {
            let midRow = (cRow + row) / 2;
            let midCol = (cCol + col) / 2;
            let removedPlayer = this.state.board[midRow][midCol];
            this.state.board[midRow][midCol] = null;
            this.state.checkers[removedPlayer].removed = true;
        }
        else if(this.isKingJump(checker, row, col)){
            if(this.state.checkers[checker].row - row >= 2){
                if(this.state.checkers[checker].col - col >= 2){
                    let removedPlayer = this.state.board[this.state.checkers[checker].row-1][this.state.checkers[checker].col-1];
                    this.state.board[this.state.checkers[checker].row-1][this.state.checkers[checker].col-1] = null;
                    this.state.checkers[removedPlayer].removed = true;
                }
                else{
                    let removedPlayer = this.state.board[this.state.checkers[checker].row-1][this.state.checkers[checker].col+1];
                    this.state.board[this.state.checkers[checker].row-1][this.state.checkers[checker].col+1] = null;
                    this.state.checkers[removedPlayer].removed = true;
                }
            }
            else{
                if(this.state.checkers[checker].col - col >= 2){
                    let removedPlayer = this.state.board[this.state.checkers[checker].row+1][this.state.checkers[checker].col-1];
                    this.state.board[this.state.checkers[checker].row+1][this.state.checkers[checker].col-1] = null;
                    this.state.checkers[removedPlayer].removed = true;
                  
                }
                else{
                    let removedPlayer = this.state.board[this.state.checkers[checker].row+1][this.state.checkers[checker].col+1];
                    this.state.board[this.state.checkers[checker].row+1][this.state.checkers[checker].col+1] = null;
                    this.state.checkers[removedPlayer].removed = true;
                }
            }
        }
        c.row = row;
        c.col = col;
        this.state.board[cRow][cCol] = null;
        this.state.board[row][col] = checker;
    }

    isJumpMove(checker, row) {
        return(Math.abs(this.state.checkers[checker].row - row) === 2 && !this.state.checkers[checker].isKing);   
    }

    isKingJump(checker, row, col) {
        if(Math.abs(this.state.checkers[checker].row - row) >= 2 && this.state.checkers[checker].isKing){
            let currentRow = this.state.checkers[checker].row;
            let currentCol = this.state.checkers[checker].col;
            let topRow = currentRow-1;
            let bottomRow = currentRow+1;
            let leftCol = currentCol-1;
            let rightCol = currentCol+1;
            if(currentRow-row >= 2 && currentCol-col >= 2 && this.state.board[topRow][leftCol] !== null){
                return true;}
            if(currentRow-row >= 2 && currentCol-col <= -2 && this.state.board[topRow][rightCol] !== null){
                return true;}
            if(currentRow-row <= -2 && currentCol-col >= 2 && this.state.board[bottomRow][leftCol] !== null){
                return true;}
            if(currentRow-row <= -2 && currentCol-col <= -2 && this.state.board[bottomRow][rightCol] !== null){
                return true;}
        }
        return false;
    }

    makeKing(checker) {
        let c = this.state.checkers[checker];
        c.isKing = true;
    }
    
    isKing(checker) {
        let c = this.state.checkers[checker];
        return c.isKing;
    }
    
    getPlayer(checker) {
        let c = this.state.checkers[checker];
        return c.player;
    }

    makeAnimate(checker,destRow,destCol) {
        let c = this.state.checkers[checker];
        let currentRow = c.row;
        let currentCol = c.col;
        let horizontal = destCol > currentCol ? "right" : "left";
        let vertical = destRow > currentRow ? "down" : "up";
        c.animate = {horizontal:horizontal,vertical: vertical };
    }

   
    render(){
        let game = (<Game
                    turn={this.state.turn} 
                    board={this.state.board} 
                    checkers={this.state.checkers} 
                    selectSquare={this.selectSquare.bind(this)}
                    selectedSquare={this.state.selectedSquare}/>);

        let welcome = (<Welcome playGame={this.changeWelcome.bind(this)}/>);

        let gameOver = (<GameOver 
                        winner={this.state.winner}
                        restart={this.restart.bind(this)}/>);

    
        return(
           
            <div>
            {this.state.winner ? gameOver :<div>{this.state.welcome ? welcome : game}</div>}
            </div>
            
        );
    }
}

export default App;
