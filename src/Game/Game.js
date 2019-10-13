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
    
    this.state = {
      board: INITIAL_BOARD,
      isGameOver: false,
      isGameWon: false,
      isGamePaused: false,
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
  }

  componentDidMount() {
    this.interval = setInterval(this.nextTurn, GHOST_SPEED);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
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
    }
    this.setState({ isGameWon, ghost});
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
    let { board, ghost, pacman, isGameOver } = this.state;
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
      clearInterval(this.interval);
    }
    this.setState({ board, ghost, isGameOver});
  }

  movePacman(event) {
    let { board, pacman, ghost, isGameOver, isGamePaused } = this.state;
    if (isGameOver) return;
    const { key } = event;
    if (isGamePaused && key != SPACE_KEY) return;
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
      clearInterval(this.interval);
    }
    this.setState({ board, pacman, isGameOver});
  }

  render (){
    const { isGameOver, isGameWon, isGamePaused } = this.state;
    const Board = this.state.board.map( row => (
        <div>
          { row.map(t => <Square type={t} /> ) }
        </div> 
      ) 
    );
    return (
      <div tabIndex="0" onKeyDown={this.movePacman.bind(this)}>
        <div className="board">
          { Board }
        </div>
        <Modal 
          isGameOver={isGameOver} 
          isGameWon={isGameWon} 
          isGamePaused={isGamePaused}
          />
      </div>
    );
  } 
}

const Modal = ({isGameOver, isGameWon, isGamePaused}) => (
  <div style={isGameOver || isGameWon || isGamePaused ? { display: 'block' } : {}} className="modal">
    <div className="modal-content">
      { isGameOver ? <h1 className="game-over">GAME OVER</h1> : null }
      { isGameWon ? <h1 className="game-won">YOU HAVE WON!</h1> : null }
      { isGamePaused ? <h1 className="game-won">PAUSE</h1> : null }
    </div>
  </div>
)

export default Game;
