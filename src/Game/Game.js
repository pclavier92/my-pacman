import React from 'react';

import Square from '../Square';
import './Game.css';

const ROWNS = 10;
const COLUMNS = 25;

const GHOST_SPEED = 250;

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

const MOVE_LEFT = 1;
const MOVE_UP = 2;
const MOVE_RIGHT = 3;
const MOVE_DOWN = 4;

const ARROW_LEFT = 'ArrowLeft';
const ARROW_UP = 'ArrowUp';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';

class Game extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      board: INITIAL_BOARD,
      isGameOver: false,
      isGameWon: false,
      pacman: {
        row: 0,
        column: 0
      },
      ghost: {
        row: ROWNS-1,
        column: COLUMNS-1,
        previousState: 'bigdot'
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
        ghost.previousState === 'dot' || 
        ghost.previousState === 'bigdot' 
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
    debugger;
    return posibleMoves;
  }

  moveGhost(posibleMoves) {
    let { board, ghost, pacman, isGameOver } = this.state;
    const ammountMoves = posibleMoves.length;
    const nextMove = posibleMoves[Math.floor(Math.random() * ammountMoves)];
    const { previousState } = ghost;
    debugger;
    switch(nextMove) {
      case MOVE_LEFT:
        if ( ghost.column === 0 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousState;
        ghost.column--;
        ghost.previousState = board[ghost.row][ghost.column];
        board[ghost.row][ghost.column] = 'ghost-left';
        break;
      case MOVE_UP:
        if ( ghost.row === 0 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousState;
        ghost.row--;
        ghost.previousState = board[ghost.row][ghost.column];
        board[ghost.row][ghost.column] = 'ghost-right';
        break;
      case MOVE_RIGHT:
        if ( ghost.column === COLUMNS-1 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousState;
        ghost.column++;
        ghost.previousState = board[ghost.row][ghost.column];
        board[ghost.row][ghost.column] = 'ghost-right';
        break;      
      case MOVE_DOWN:
        if ( ghost.row === ROWNS-1 ) {
          posibleMoves.splice(nextMove,1);
          this.moveGhost(posibleMoves);
          return;
        }
        board[ghost.row][ghost.column] = previousState;
        ghost.row++;
        ghost.previousState = board[ghost.row][ghost.column];
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
    let { board, pacman, ghost, isGameOver } = this.state;
    if (isGameOver) return;
    switch(event.key) {
      case ARROW_LEFT:
        if ( pacman.column === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column--;
        board[pacman.row][pacman.column] = 'pacman-left';
        break;
      case ARROW_UP:
        if ( pacman.row === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row--;
        board[pacman.row][pacman.column] = 'pacman-up';
        break;
      case ARROW_RIGHT:
        if ( pacman.column === COLUMNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column++;
        board[pacman.row][pacman.column] = 'pacman-right';
        break;
      case ARROW_DOWN:
        if ( pacman.row === ROWNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row++;
        board[pacman.row][pacman.column] = 'pacman-down';
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
        <FinishModal isGameOver={this.state.isGameOver} isGameWon={this.state.isGameWon} />
      </div>
    );
  } 
}

const FinishModal = ({isGameOver, isGameWon}) => (
  <div style={isGameOver || isGameWon ? { display: 'block' } : {}} className="modal">
    <div className="modal-content">
      { isGameOver ? <h1 className="game-over">GAME OVER</h1> : null }
      { isGameWon ? <h1 className="game-won">YOU HAVE WON!</h1> : null }
    </div>
  </div>
)

export default Game;
