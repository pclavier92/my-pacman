import React from 'react';
import { Swipeable } from 'react-swipeable';
import { settings, config } from '../constants';
import { Scroll, Wrapper } from '../utils';
import { 
  backgroundMusic,
  winningSound,
  gameoverSound
} from '../media/sounds'
import Board from '../Board';
import { getInitialBoard } from './initial-board';
import './Game.css';

const {
  ROWNS,
  COLUMNS,
  GAME_SPEED,
  SCARED_SECONDS,
  DOT_POINTS,
  BIGDOT_POINTS
} = settings;

const {
  MOVE_LEFT,
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_DOWN,
  ARROW_LEFT_KEY,
  ARROW_UP_KEY,
  ARROW_RIGHT_KEY,
  ARROW_DOWN_KEY,
  SPACE_KEY,
  EMPTY,
  DOT, 
  BIG_DOT,
  SWIPEABLE_CONFIG
} = config;

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
    row: 5,
    column: 0,
    isMovingTowardsWall: false
  },
  ghost: {
    row: 5,
    column: COLUMNS-1,
    isScared: false,
    scaredCounter: 0,
    isMovingTowardsWall: false
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

    const { isMuted } = this.props;
    this.backgroundMusic.muted = isMuted;
    this.winningSound.muted = isMuted;
    this.gameoverSound.muted = isMuted;
  }

  componentDidUpdate(prevProps) {
    if (this.props.isMuted !== prevProps.isMuted) {
      const { isMuted } = this.props;
      this.backgroundMusic.muted = isMuted;
      this.winningSound.muted = isMuted;
      this.gameoverSound.muted = isMuted;
    }
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
    this.movePacman(lastKeyMove);
    this.moveGhost(posibleGhostMoves);
    this.reduceScaredCounter(ghost);
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
    if ( pacman.row > ghost.row ) {
      posibleMoves.push(MOVE_UP);
    }
    if ( pacman.row < ghost.row ) {
      posibleMoves.push(MOVE_DOWN);
    }
    if ( pacman.column > ghost.column ) {
      posibleMoves.push(MOVE_LEFT);
    }
    if ( pacman.column < ghost.column ) {
      posibleMoves.push(MOVE_RIGHT);
    }
    return posibleMoves;
  }

  moveGhost(posibleMoves) {
    const { pacman } = this.state;
    let { board, ghost } = this.state;
    if (ghost.isScared && ghost.scaredCounter % 2 === 0 ) return;
    const ammountMoves = posibleMoves.length;
    const nextMove = posibleMoves[Math.floor(Math.random() * ammountMoves)];
    switch(nextMove) {
      case MOVE_LEFT:
        if ( !this.isWalkable(board, ghost.row, ghost.column-1) || ghost.column-1 < 0 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_RIGHT);
          posibleMoves.push(MOVE_DOWN);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.column--;
        ghost.lastMove = MOVE_LEFT;
        if ( this.isWalkable(board, ghost.row, ghost.column-1) ){
          ghost.isMovingTowardsWall = false;
        } else {
          ghost.isMovingTowardsWall = true;
        }
        break;
      case MOVE_UP:
        if ( !this.isWalkable(board, ghost.row-1, ghost.column) || ghost.row-1 < 0 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_RIGHT);
          posibleMoves.push(MOVE_DOWN);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.row--;
        ghost.lastMove = MOVE_UP;
        if ( this.isWalkable(board, ghost.row-1, ghost.column) ){
          ghost.isMovingTowardsWall = false;
        } else {
          ghost.isMovingTowardsWall = true;
        }
        break;
      case MOVE_RIGHT:
        if ( !this.isWalkable(board, ghost.row, ghost.column+1) || ghost.column+1 > COLUMNS-1 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_DOWN);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.column++;
        ghost.lastMove = MOVE_RIGHT;
        if ( this.isWalkable(board, ghost.row, ghost.column+1) ){
          ghost.isMovingTowardsWall = false;
        } else {
          ghost.isMovingTowardsWall = true;
        }
        break;      
      case MOVE_DOWN:
        if ( !this.isWalkable(board, ghost.row+1, ghost.column) || ghost.row+1 > ROWNS-1 ) {
          posibleMoves.splice(nextMove,1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_RIGHT);
          this.moveGhost(posibleMoves);
          return;
        }
        ghost.row++;
        ghost.lastMove = MOVE_DOWN;
        if ( this.isWalkable(board, ghost.row+1, ghost.column) ){
          ghost.isMovingTowardsWall = false;
        } else {
          ghost.isMovingTowardsWall = true;
        }
        break;
        default:
        break;
    } 
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, ghost });
  }

  reduceScaredCounter(ghost){
    if (ghost.isScared) {
      ghost.scaredCounter--;
      if( ghost.scaredCounter === 0 ){
        ghost.isScared = false;
      }
      this.setState({ ghost });
    }
  }

  onSwiped(event) {
    const { dir } = event;
    let { lastKeyMove } = this.state;
    const { pacman, board } = this.state;
    switch(dir) {
      case MOVE_LEFT:
        if(this.isWalkable(board, pacman.row, pacman.column-1)) lastKeyMove = ARROW_LEFT_KEY;
        break;
      case MOVE_UP:
        if(this.isWalkable(board, pacman.row-1, pacman.column)) lastKeyMove = ARROW_UP_KEY;
        break;
      case MOVE_RIGHT:
        if(this.isWalkable(board, pacman.row, pacman.column+1)) lastKeyMove = ARROW_RIGHT_KEY;
        break;
      case MOVE_DOWN:
        if(this.isWalkable(board, pacman.row+1, pacman.column)) lastKeyMove = ARROW_DOWN_KEY;
        break;
      default:
        break;
    }
    this.setState({ lastKeyMove });
  }

  onKeyDown(event){
    const { key } = event;
    let { lastKeyMove } = this.state;
    const { pacman, board } = this.state;
    switch(key) {
      case ARROW_LEFT_KEY:
        if(this.isWalkable(board, pacman.row, pacman.column-1)) lastKeyMove = key;
        break;
      case ARROW_UP_KEY:
        if(this.isWalkable(board, pacman.row-1, pacman.column)) lastKeyMove = key;
        break;
      case ARROW_RIGHT_KEY:
        if(this.isWalkable(board, pacman.row, pacman.column+1)) lastKeyMove = key;
        break;
      case ARROW_DOWN_KEY:
        if(this.isWalkable(board, pacman.row+1, pacman.column)) lastKeyMove = key;
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
    let { board, pacman } = this.state;
    const { ghost, isGameOver, isGameWon, isPlaying, lastKeyMove} = this.state;
    if (isGameOver) return;
    if (!isGameWon && !isPlaying) return;
    if (!lastKeyMove) return;
    switch(key) {
      case ARROW_LEFT_KEY:
        if ( pacman.column === 0 ) {
          pacman.column = COLUMNS-1;  
        } else if (!this.isWalkable(board, pacman.row, pacman.column-1)){
          return;
        }
        else {
          pacman.column--;
          if ( this.isWalkable(board, pacman.row, pacman.column-1) ){
            pacman.isMovingTowardsWall = false;
          } else {
            pacman.isMovingTowardsWall = true;
          }
        }
        pacman.lastMove = MOVE_LEFT; 
        break;
      case ARROW_UP_KEY:
        if ( pacman.row === 0 ) {
          pacman.row = ROWNS-1;  
        } else if (!this.isWalkable(board, pacman.row-1, pacman.column)) {
          return;
        } else {
          pacman.row--;
          if ( this.isWalkable(board, pacman.row-1, pacman.column) ){
            pacman.isMovingTowardsWall = false;
          } else {
            pacman.isMovingTowardsWall = true;
          }
        }
        pacman.lastMove = MOVE_UP; 
        break;
      case ARROW_RIGHT_KEY:
        if ( pacman.column === COLUMNS-1 ) {
          pacman.column = 0;  
        } else if (!this.isWalkable(board, pacman.row, pacman.column+1)) {
          return;
        } else {
          pacman.column++;
          if ( this.isWalkable(board, pacman.row, pacman.column+1) ){
            pacman.isMovingTowardsWall = false;
          } else {
            pacman.isMovingTowardsWall = true;
          }
        }
        pacman.lastMove = MOVE_RIGHT;
        break;
      case ARROW_DOWN_KEY:
        if ( pacman.row === ROWNS-1 ) {
          pacman.row = 0;  
        } else if (!this.isWalkable(board, pacman.row+1, pacman.column)) {
          return;
        } else {
          pacman.row++;
          if ( this.isWalkable(board, pacman.row+1, pacman.column) ){
            pacman.isMovingTowardsWall = false;
          } else {
            pacman.isMovingTowardsWall = true;
          }
        }
        pacman.lastMove = MOVE_DOWN;
        break;
      default:
        break;
    }
    const nextSquare = board[pacman.row][pacman.column];
    this.isGhostScared(nextSquare);
    this.increasePoints(nextSquare);
    this.eatDot(board, pacman);
    this.checkForGameOver(pacman, ghost);
    this.setState({ board, pacman });
  }

  isWalkable(board, nextRow, nextColumn) {
    return board[nextRow] && 
      board[nextRow][nextColumn] && 
      board[nextRow][nextColumn].isWalkable;
  }

  eatDot(board, pacman) {
    board[pacman.row][pacman.column] = {
      isWalkable: true,
      type: EMPTY
    };
  }

  isGhostScared(nextSquare){
    let { ghost } = this.state;
    if ( nextSquare.type === BIG_DOT ){
      ghost.isScared = true;
      ghost.scaredCounter = SCARED_SECONDS * 1000 / GAME_SPEED;
    }
    this.setState({ ghost });
  }

  increasePoints(nextSquare) {
    let { points, highestScore } = this.state;
    const { ghost } = this.state;
    if ( nextSquare.type === DOT ) {
      if (ghost.isScared) {
        points += 5 * DOT_POINTS; // quintuple points when ghost is scared
      } else {
        points += DOT_POINTS;
      }
    } else if ( nextSquare.type === BIG_DOT ){
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
      row = row.map( r => r.type);
      if (row.includes(DOT) || row.includes(BIG_DOT)) {
        isGameWon = false;
      }
    })
    if (isGameWon){
      ghost.row = -1;
      ghost.column = 1;
      isPlaying = false;
      clearInterval(this.interval);
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
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
      this.backgroundMusic.currentTime = 0;
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
