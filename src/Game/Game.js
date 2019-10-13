import React from 'react';

import Square from '../Square';
import './Game.css';

// Settings
const ROWNS = 10;
const COLUMNS = 25;
const GHOST_SPEED = 250;

const EMPTY = {
  isWalkable: true,
  render: ''
}

const DOT = {
  isWalkable: true,
  render: 'dot'
}

const BIG_DOT = {
  isWalkable: true,
  render: 'bigdot'
}

const INITIAL_BOARD = [
  ['pacman-right', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'bigdot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['bigdot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'ghost-left']
 ];

// Config
const MOVE_LEFT = 1;
const MOVE_UP = 2;
const MOVE_RIGHT = 3;
const MOVE_DOWN = 4;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_DOWN_KEY = 'ArrowDown';
const SPACE_KEY = ' '

class Game extends React.Component {
  constructor(props) {
    super(props);
    const initialBoard = INITIAL_BOARD.map(row => row.slice());
    this.state = {
      board: initialBoard,
      isGameOver: false,
      isGameWon: false,
      isGamePaused: false,
      isPlaying: false,
      pacman: {
        row: 0,
        column: 0
      },
      ghost: {
        row: ROWNS-1,
        column: COLUMNS-1,
        previousSquare: 'bigdot'
      }
    }
    this.nextTurn = this.nextTurn.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleStart() {
    const initialBoard = INITIAL_BOARD.map(row => row.slice());
    this.setState({
      board: initialBoard,
      isGameOver: false,
      isGameWon: false,
      isGamePaused: false,
      isPlaying: true,
      pacman: {
        row: 0,
        column: 0
      },
      ghost: {
        row: ROWNS-1,
        column: COLUMNS-1,
        previousSquare: 'bigdot'
      }
    })
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
    const posibleMoves = this.setGhostDirection();
    this.moveGhost(posibleMoves);
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
        board[ghost.row][ghost.column] = 'ghost-left';
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
        board[ghost.row][ghost.column] = 'ghost-right';
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
        board[ghost.row][ghost.column] = 'ghost-right';
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
        board[ghost.row][ghost.column] = 'ghost-left';
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
    let { board, pacman, ghost, isGameOver, isGameWon, isGamePaused, isPlaying } = this.state;
    if (isGameOver || (!isGameWon && !isPlaying) ) return;
    const { key } = event;
    if (isGamePaused && key !== SPACE_KEY) return;
    switch(key) {
      case ARROW_LEFT_KEY:
        if ( pacman.column === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column--;
        board[pacman.row][pacman.column] = 'pacman-left';
        break;
      case ARROW_UP_KEY:
        if ( pacman.row === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row--;
        board[pacman.row][pacman.column] = 'pacman-up';
        break;
      case ARROW_RIGHT_KEY:
        if ( pacman.column === COLUMNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column++;
        board[pacman.row][pacman.column] = 'pacman-right';
        break;
      case ARROW_DOWN_KEY:
        if ( pacman.row === ROWNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row++;
        board[pacman.row][pacman.column] = 'pacman-down';
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
    this.setState({ board, pacman, isGameOver, isPlaying});
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
      <div className="game">
        <div className="board" tabIndex="0" onKeyDown={this.movePacman.bind(this)}>
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
