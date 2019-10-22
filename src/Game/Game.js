import React from 'react';
import { Swipeable } from 'react-swipeable';
import { Scroll, Wrapper } from '../utils';
import penha from '../media/ww-penha.mp3';
import win from '../media/mario-win.mp3';
import gameover from '../media/mario-gameover.mp3';
import Board from '../Board';
import Square from '../Square';
import { getInitialBoard } from './initial-board';
import './Game.css';

// Settings
const ROWNS = 10;
const COLUMNS = 25;
const GHOST_SPEED = 250; // move every X ms
const SCARED_SECONDS = 3; // ghost is scared for 3 seconds
const DOT_POINTS = 50;
const BIGDOT_POINTS = 200;

// Config
const MOVE_LEFT = 1;
const MOVE_UP = 2;
const MOVE_RIGHT = 3;
const MOVE_DOWN = 4;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_DOWN_KEY = 'ArrowDown';
const SWIPE_LEFT = 'Left';
const SWIPE_UP = 'Up';
const SWIPE_RIGHT = 'Right';
const SWIPE_DOWN = 'Down';
const SPACE_KEY = ' ';
const SWIPEABLE_CONFIG = {
  preventDefaultTouchmoveEvent: true,
  trackMouse: true
 };

const INITIAL_STATE = {
  board: getInitialBoard(),
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
  isPlaying: false,
  lastKeyMove: null,
  points: 0,
  highestScore: 0,
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
    this.scroll = new Scroll();
    this.pauseGame = this.pauseGame.bind(this);
    this.nextTurn = this.nextTurn.bind(this);
    this.onSwiped = this.onSwiped.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handleStart = this.handleStart.bind(this);
  }

  componentDidMount() {
    this.winningSound = new Audio(win);
    this.gameoverSound = new Audio(gameover);
    this.backgroundMusic = new Audio(penha);
    this.backgroundMusic.loop = true;  
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleStart() {
    const { highestScore } = this.state;
    this.setState({
      ...INITIAL_STATE,
      highestScore,
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
    debugger;
    this.scroll.disable();
    const { isPlaying } = this.state;
    if (!isPlaying) {
      this.backgroundMusic.play();
    }
  }

  pauseGame() {
    const { isPlaying } = this.state;
    if (!isPlaying) return;
    let { isGamePaused } = this.state;
    isGamePaused = !isGamePaused;
    if (isGamePaused) {
      clearInterval(this.interval);
      this.scroll.enable();
    } else {
      this.interval = setInterval(this.nextTurn, GHOST_SPEED);
      this.scroll.disable();
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
    this.movePacman(lastKeyMove);
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
    const { pacman } = this.state;
    let { board, ghost } = this.state;
    const ammountMoves = posibleMoves.length;
    const nextMove = posibleMoves[Math.floor(Math.random() * ammountMoves)];
    const { previousSquare } = ghost;
    switch(nextMove) {
      case MOVE_LEFT:
        if ( ghost.column === 0 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_RIGHT);
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
          posibleMoves.push(MOVE_DOWN);
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
          posibleMoves.push(MOVE_LEFT);
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
          posibleMoves.push(MOVE_UP);
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
    // Check if game if over
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, ghost });
  }

  onSwiped(event) {
    const { dir } = event;
    let { lastKeyMove } = this.state;
    switch(dir) {
      case SWIPE_LEFT:
        lastKeyMove = ARROW_LEFT_KEY;
        break;
      case SWIPE_UP:
        lastKeyMove = ARROW_UP_KEY;
        break;
      case SWIPE_RIGHT:
        lastKeyMove = ARROW_RIGHT_KEY;
        break;
      case SWIPE_DOWN:
        lastKeyMove = ARROW_DOWN_KEY;
        break;
      default:
        break;
    }
    this.setState({ lastKeyMove });
  }

  onKeyDown(event){
    const { key } = event;
    let { lastKeyMove } = this.state;
    switch(key) {
      case ARROW_LEFT_KEY:
      case ARROW_UP_KEY:
      case ARROW_RIGHT_KEY:
      case ARROW_DOWN_KEY:
        lastKeyMove = key;
        break;
      case SPACE_KEY:
        this.pauseGame();
        break;
      default:
        break;
    }
    this.setState({ lastKeyMove });
  }

  movePacman(key) {
    let previousSquare, nextSquare;
    let { board, pacman } = this.state;
    const { ghost, isGameOver, isGameWon, isPlaying, lastKeyMove} = this.state;
    if (isGameOver) return;
    if (!isGameWon && !isPlaying) return;
    if (!lastKeyMove) return;
    switch(key) {
      case ARROW_LEFT_KEY:
        if ( pacman.column === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column--;
        previousSquare = board[pacman.row][pacman.column]; 
        nextSquare = 'pacman-left';
        break;
      case ARROW_UP_KEY:
        if ( pacman.row === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row--;
        previousSquare = board[pacman.row][pacman.column]; 
        nextSquare = 'pacman-up';
        break;
      case ARROW_RIGHT_KEY:
        if ( pacman.column === COLUMNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column++;
        previousSquare = board[pacman.row][pacman.column]; 
        nextSquare = 'pacman-right';
        break;
      case ARROW_DOWN_KEY:
        if ( pacman.row === ROWNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row++;
        previousSquare = board[pacman.row][pacman.column]; 
        nextSquare = 'pacman-down';
        break;
      default:
        break;
    }
    board[pacman.row][pacman.column] = nextSquare;
    board = this.isGhostScared(board, previousSquare);
    this.increasePoints(previousSquare);
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, pacman });
  }

  isGhostScared(board, previousSquare){
    let { ghost } = this.state;
    if ( previousSquare === 'bigdot' ){
      ghost.isScared = true;
      ghost.scaredCounter = SCARED_SECONDS * 1000 / GHOST_SPEED;
      board[ghost.row][ghost.column] = 'scared-ghost';
    }
    this.setState({ ghost });
    return board;
  }

  increasePoints(previousSquare) {
    let { points, highestScore } = this.state;
    const { ghost } = this.state;
    if ( previousSquare === 'dot' ) {
      if (ghost.isScared) {
        points += 2 * DOT_POINTS; // double points when ghost is scared
      } else {
        points += DOT_POINTS;
      }
    } else if ( previousSquare === 'bigdot' ){
      points += BIGDOT_POINTS;
    }
    if ( points >= highestScore ) {
      highestScore = points;
    }
    this.setState({ points, highestScore });
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
      ghost.row = -1;
      isPlaying = false;
      clearInterval(this.interval);
      this.backgroundMusic.pause();
      this.winningSound.play();
      this.scroll.enable();
    }
    this.setState({ isGameWon, isPlaying, ghost});
    return isGameWon;
  }

  checkForGameOver(pacman, ghost) {
    if (ghost.isScared) return;
    let { isGameOver, isPlaying } = this.state;
    if (pacman.row === ghost.row && pacman.column === ghost.column) {
      isGameOver = true;
      isPlaying = false;
      clearInterval(this.interval);
      this.backgroundMusic.pause();
      this.gameoverSound.play();
      this.scroll.enable();
    }
    this.setState({ isGameOver, isPlaying });
  }

  render (){
    const { board, points, highestScore, isGameOver, isGameWon, isGamePaused, isPlaying } = this.state;
    return (
      <div className="game" tabIndex="0" onDoubleClick={this.pauseGame} onKeyDown={this.onKeyDown}>
          <Swipeable onSwiped={this.onSwiped} {...SWIPEABLE_CONFIG}>
            <Wrapper>
              <p className="yellow-text">Points: {points} | Highest Score: {highestScore}</p>
              <Board 
                board={board} 
                isGameOver={isGameOver} 
                isGameWon={isGameWon} 
                isGamePaused={isGamePaused} 
              />
            </Wrapper>
          </Swipeable>
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

export default Game;
