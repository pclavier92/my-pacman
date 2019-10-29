import React from 'react';
import { Swipeable } from 'react-swipeable';
import { Scroll, Wrapper } from '../utils';
import { 
  backgroundMusic,
  winningSound,
  gameoverSound
} from '../media/sounds'
import Board from '../Board';
import { getInitialBoard } from './initial-board';
import './Game.css';

// Settings
const ROWNS = 10;
const COLUMNS = 25;
const GAME_SPEED = 250; // move every X ms
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
    this.backgroundMusic = new Audio(backgroundMusic);
    this.winningSound = new Audio(winningSound);
    this.gameoverSound = new Audio(gameoverSound);
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
    this.interval = setInterval(this.nextTurn, GAME_SPEED);
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
      this.backgroundMusic.pause();
    } else {
      this.interval = setInterval(this.nextTurn, GAME_SPEED);
      this.scroll.disable();
      this.backgroundMusic.play();
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
    switch(nextMove) {
      case MOVE_LEFT:
        if ( ghost.column === 0 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_RIGHT);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.column--;
        ghost.lastMove = 'left';
        break;
      case MOVE_UP:
        if ( ghost.row === 0 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_DOWN);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.row--;
        break;
      case MOVE_RIGHT:
        if ( ghost.column === COLUMNS-1 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_LEFT);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.column++;
        ghost.lastMove = 'right';
        break;      
      case MOVE_DOWN:
        if ( ghost.row === ROWNS-1 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_UP);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.row++;
        break;
        default:
        break;
    }
    this.reduceScaredCounter(ghost);  
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, ghost });
  }

  reduceScaredCounter(ghost){
    if (ghost.isScared) {
      ghost.scaredCounter--;
      if( ghost.scaredCounter === 0 ){
        ghost.isScared = false;
      }
    }
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
    let nextSquare;
    let { board, pacman } = this.state;
    const { ghost, isGameOver, isGameWon, isPlaying, lastKeyMove} = this.state;
    if (isGameOver) return;
    if (!isGameWon && !isPlaying) return;
    if (!lastKeyMove) return;
    switch(key) {
      case ARROW_LEFT_KEY:
        if ( pacman.column === 0 ) return;
        pacman.column--;
        pacman.lastMove = 'left';
        nextSquare = board[pacman.row][pacman.column]; 
        break;
      case ARROW_UP_KEY:
        if ( pacman.row === 0 ) return;
        pacman.row--;
        pacman.lastMove = 'up';
        nextSquare = board[pacman.row][pacman.column]; 
        break;
      case ARROW_RIGHT_KEY:
        if ( pacman.column === COLUMNS-1 ) return;
        pacman.column++;
        pacman.lastMove = 'right';
        nextSquare = board[pacman.row][pacman.column]; 
        break;
      case ARROW_DOWN_KEY:
        if ( pacman.row === ROWNS-1 ) return;
        pacman.row++;
        pacman.lastMove = 'down';
        nextSquare = board[pacman.row][pacman.column]; 
        break;
      default:
        break;
    }
    this.isGhostScared(board, nextSquare);
    this.increasePoints(nextSquare);
    this.eatDot(board, pacman);
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, pacman });
  }

  eatDot(board, pacman) {
    board[pacman.row][pacman.column] = '';
  }

  isGhostScared(board, nextSquare){
    let { ghost } = this.state;
    if ( nextSquare === 'bigdot' ){
      ghost.isScared = true;
      ghost.scaredCounter = SCARED_SECONDS * 1000 / GAME_SPEED;
    }
    this.setState({ ghost });
  }

  increasePoints(nextSquare) {
    let { points, highestScore } = this.state;
    const { ghost } = this.state;
    if ( nextSquare === 'dot' ) {
      if (ghost.isScared) {
        points += 2 * DOT_POINTS; // double points when ghost is scared
      } else {
        points += DOT_POINTS;
      }
    } else if ( nextSquare === 'bigdot' ){
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
      if (row.includes('dot') || row.includes('bigdot')) {
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
    const { board, pacman, ghost, points, highestScore, isGameOver, isGameWon, isGamePaused, isPlaying } = this.state;
    return (
      <div className="game" tabIndex="0" onDoubleClick={this.pauseGame} onKeyDown={this.onKeyDown}>
          <Swipeable onSwiped={this.onSwiped} {...SWIPEABLE_CONFIG}>
            <Wrapper>
              <p className="yellow-text">Points: {points} | Highest Score: {highestScore}</p>
              <Board 
                board={board} 
                pacman={pacman}
                ghost={ghost}
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
