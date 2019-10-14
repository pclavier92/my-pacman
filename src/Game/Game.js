import React from 'react';
import Square from '../Square';
import './Game.css';

import { getInitialBoard } from './initial-board';

// Settings
const ROWNS = 10;
const COLUMNS = 25;
const GHOST_SPEED = 250; // move every X ms
const SCARED_SECONDS = 3; // ghost is scared for 3 seconds

// Config
const MOVE_LEFT = 1;
const MOVE_UP = 2;
const MOVE_RIGHT = 3;
const MOVE_DOWN = 4;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_DOWN_KEY = 'ArrowDown';
const SPACE_KEY = ' ';

const INITIAL_STATE = {
  board: getInitialBoard(),
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
  isPlaying: false,
  lastKeyMove: null,
  pacman: {
    row: 0,
    column: 0
  },
  ghost: {
    row: ROWNS-1,
    column: COLUMNS-1,
    previousSquare: 'bigdot',
    isScared: false,
    scaredCounter: 0
  }
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
      pacman: {
        ...INITIAL_STATE.pacman
      },
      ghost: {
        ...INITIAL_STATE.ghost
      }
    };
    this.nextTurn = this.nextTurn.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleStart() {
    this.setState({
      ...INITIAL_STATE,
      board: getInitialBoard(),
      isPlaying: true,
      pacman: {
        ...INITIAL_STATE.pacman
      },
      ghost: {
        ...INITIAL_STATE.ghost
      }
    });
    clearInterval(this.interval);
    this.interval = setInterval(this.nextTurn, GHOST_SPEED);
  }

  pauseGame() {
    let { isGamePaused } = this.state;
    isGamePaused = !isGamePaused;
    if (isGamePaused) {
      clearInterval(this.interval);
    } else {
      this.interval = setInterval(this.nextTurn, GHOST_SPEED);
    }
    this.setState({ isGamePaused });
  }

  nextTurn() {
    if (this.checkForWin()) return;
    const { ghost, lastKeyMove } = this.state;
    let posibleGhostMoves;
    if (ghost.isScared) {
      posibleGhostMoves = this.setScaredGhostDirection();
    } else {
      posibleGhostMoves = this.setGhostDirection();
    }
    this.moveGhost(posibleGhostMoves);
    this.movePacman({ key: lastKeyMove });
  }
  
  checkForWin() {
    const { board, ghost } = this.state;
    let isGameWon = true;
    let isPlaying = true;
    board.forEach( row => {
      if (row.includes('dot') || 
        row.includes('bigdot') || 
        ghost.previousSquare === 'dot' || 
        ghost.previousSquare === 'bigdot' 
      ) {
        isGameWon = false;
      }
    })
    if (isGameWon){
      clearInterval(this.interval);
      ghost.row = -1;
      isPlaying = false;
    }
    this.setState({ isGameWon, isPlaying, ghost});
    return isGameWon;
  }

  setGhostDirection() {
    let posibleMoves = [];
    const { pacman, ghost } = this.state;
    if ( pacman.row < ghost.row ) {
      posibleMoves.push(MOVE_UP);
    }
    if ( pacman.row > ghost.row ) {
      posibleMoves.push(MOVE_DOWN);
    }
    if ( pacman.column < ghost.column ) {
      posibleMoves.push(MOVE_LEFT);
    }
    if ( pacman.column > ghost.column ) {
      posibleMoves.push(MOVE_RIGHT);
    }
    return posibleMoves;
  }

  setScaredGhostDirection() {
    let posibleMoves = [];
    const { pacman, ghost } = this.state;
    if ( pacman.row >= ghost.row ) {
      posibleMoves.push(MOVE_UP);
    }
    if ( pacman.row <= ghost.row ) {
      posibleMoves.push(MOVE_DOWN);
    }
    if ( pacman.column >= ghost.column ) {
      posibleMoves.push(MOVE_LEFT);
    }
    if ( pacman.column <= ghost.column ) {
      posibleMoves.push(MOVE_RIGHT);
    }
    return posibleMoves;
  }

  moveGhost(posibleMoves) {
    let { board, ghost, pacman, isGameOver, isPlaying } = this.state;
    const ammountMoves = posibleMoves.length;
    const nextMove = posibleMoves[Math.floor(Math.random() * ammountMoves)];
    const { previousSquare } = ghost;
    switch(nextMove) {
      case MOVE_LEFT:
        if ( ghost.column === 0 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousSquare;
        ghost.column--;
        ghost.previousSquare = board[ghost.row][ghost.column];
        if (ghost.isScared) {
          board[ghost.row][ghost.column] = 'scared-ghost';
          ghost.scaredCounter--;
          if( ghost.scaredCounter === 0 ){
            ghost.isScared = false;
          }
        } else {
          board[ghost.row][ghost.column] = 'ghost-left';
        }
        break;
      case MOVE_UP:
        if ( ghost.row === 0 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousSquare;
        ghost.row--;
        ghost.previousSquare = board[ghost.row][ghost.column];
        if (ghost.isScared) {
          board[ghost.row][ghost.column] = 'scared-ghost';
          ghost.scaredCounter--;
          if( ghost.scaredCounter === 0 ){
            ghost.isScared = false;
          }
        } else {
          board[ghost.row][ghost.column] = 'ghost-right';
        }
        break;
      case MOVE_RIGHT:
        if ( ghost.column === COLUMNS-1 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousSquare;
        ghost.column++;
        ghost.previousSquare = board[ghost.row][ghost.column];
        if (ghost.isScared) {
          board[ghost.row][ghost.column] = 'scared-ghost';
          ghost.scaredCounter--;
          if( ghost.scaredCounter === 0 ){
            ghost.isScared = false;
          }
        } else {
          board[ghost.row][ghost.column] = 'ghost-right';
        }
        break;      
      case MOVE_DOWN:
        if ( ghost.row === ROWNS-1 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousSquare;
        ghost.row++;
        ghost.previousSquare = board[ghost.row][ghost.column];
        if (ghost.isScared) {
          board[ghost.row][ghost.column] = 'scared-ghost';
          ghost.scaredCounter--;
          if( ghost.scaredCounter === 0 ){
            ghost.isScared = false;
          }
        } else {
          board[ghost.row][ghost.column] = 'ghost-left';
        }
        break;
        default:
        break;
    }
    if (pacman.row === ghost.row && pacman.column === ghost.column) {
      isGameOver = true;
      isPlaying = false;
      clearInterval(this.interval);
    }
    this.setState({ board, ghost, isGameOver, isPlaying});
  }

  movePacman(event) {
    let { board, pacman, ghost, lastKeyMove, isGameOver, isGameWon, isGamePaused, isPlaying } = this.state;
    if (isGameOver || (!isGameWon && !isPlaying) ) return;
    const { key } = event;
    if (isGamePaused && key !== SPACE_KEY) return;
    switch(key) {
      case ARROW_LEFT_KEY:
        if ( pacman.column === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column--;
        if ( board[pacman.row][pacman.column] === 'bigdot' ){
          ghost.isScared = true;
          ghost.scaredCounter = SCARED_SECONDS * 1000 / GHOST_SPEED;
          board[ghost.row][ghost.column] = 'scared-ghost';
        } 
        board[pacman.row][pacman.column] = 'pacman-left';
        lastKeyMove = ARROW_LEFT_KEY;
        break;
      case ARROW_UP_KEY:
        if ( pacman.row === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row--;
        if ( board[pacman.row][pacman.column] === 'bigdot' ){
          ghost.isScared = true;
          ghost.scaredCounter = SCARED_SECONDS * 1000 / GHOST_SPEED;
          board[ghost.row][ghost.column] = 'scared-ghost';
        }
        board[pacman.row][pacman.column] = 'pacman-up';
        lastKeyMove = ARROW_UP_KEY;
        break;
      case ARROW_RIGHT_KEY:
        if ( pacman.column === COLUMNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column++;
        if ( board[pacman.row][pacman.column] === 'bigdot' ){
          ghost.isScared = true;
          ghost.scaredCounter = SCARED_SECONDS * 1000 / GHOST_SPEED;
          board[ghost.row][ghost.column] = 'scared-ghost';
        }
        board[pacman.row][pacman.column] = 'pacman-right';
        lastKeyMove = ARROW_RIGHT_KEY;
        break;
      case ARROW_DOWN_KEY:
        if ( pacman.row === ROWNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row++;
        if ( board[pacman.row][pacman.column] === 'bigdot' ){
          ghost.isScared = true;
          ghost.scaredCounter = SCARED_SECONDS * 1000 / GHOST_SPEED;
          board[ghost.row][ghost.column] = 'scared-ghost';
        }
        board[pacman.row][pacman.column] = 'pacman-down';
        lastKeyMove = ARROW_DOWN_KEY;
        break;
      case SPACE_KEY:
        this.pauseGame();
        break;
      default:
        break;
    }
    if (pacman.row === ghost.row && pacman.column === ghost.column) {
      isGameOver = true;
      isPlaying = false;
      clearInterval(this.interval);
    }
    this.setState({ board, pacman, lastKeyMove, isGameOver, isPlaying});
  }

  render (){
    const { isGameOver, isGameWon, isGamePaused, isPlaying } = this.state;
    const Board = this.state.board.map( row => (
        <div>
          { row.map(t => <Square type={t} /> ) }
        </div> 
      ) 
    );
    return (
      <div className="game" tabIndex="0" onKeyDown={this.movePacman.bind(this)}>
        <div className="board">
          { Board }
          <Modal 
            isGameOver={isGameOver} 
            isGameWon={isGameWon}
            isGamePaused={isGamePaused}
          />
        </div>
        <Start isPlaying={isPlaying} onClick={this.handleStart} />
      </div>
    );
  } 
}

const Start = ({ isPlaying, onClick }) => (
  <div className="start-button" onClick={onClick}>
    <h1 className="yellow-text">{ isPlaying ? 'RESTART' : 'START'}</h1>
  </div>
)

const Modal = ({ isGameOver, isGameWon, isGamePaused }) => (
  <div style={isGameOver || isGameWon || isGamePaused ? { display: 'block' } : {}} className="modal">
    <div className="modal-content">
      { isGameOver ? <h1 className="red-text">GAME OVER</h1> : null }
      { isGameWon ? <h1 className="yellow-text">YOU HAVE WON!</h1> : null }
      { isGamePaused ? <h1 className="yellow-text">PAUSE</h1> : null }
    </div>
  </div>
)

export default Game;
