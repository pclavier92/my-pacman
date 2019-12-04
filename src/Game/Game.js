import React from "react";
import { Swipeable } from "react-swipeable";
import config from "../config";
import settings from "../settings";
import { Scroll, Wrapper } from "../utils";
import { backgroundMusic, winningSound, gameoverSound } from "../media/sounds";
import GlyphsMap from "../Map";
import Map from "./map";
import Pacman from "./pacman";
import Ghost from "./ghost";
import "./Game.css";

const { GAME_SPEED, DOT_POINTS, BIGDOT_POINTS } = settings;

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
  DOT,
  BIG_DOT,
  SWIPEABLE_CONFIG
} = config;

const INITIAL_STATE = {
  isGameOver: false,
  isGameWon: false,
  isGamePaused: false,
  isPlaying: false,
  lastKeyMove: null,
  points: 0,
  highestScore: 0
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.map = new Map();
    this.pacman = new Pacman();
    this.ghost = new Ghost();

    this.state = {
      ...INITIAL_STATE,
      map: this.map.toInitialState(),
      pacman: {
        ...this.pacman.toInitialState()
      },
      ghost: {
        ...this.ghost.toInitialState()
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
    const { highestScore, isPlaying } = this.state;
    this.setState({
      ...INITIAL_STATE,
      highestScore,
      isPlaying: true,
      map: this.map.toInitialState(),
      pacman: {
        ...this.pacman.toInitialState()
      },
      ghost: {
        ...this.ghost.toInitialState()
      }
    });
    clearInterval(this.interval);
    this.interval = setInterval(this.nextTurn, GAME_SPEED);
    this.scroll.disable();
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
    const { lastKeyMove } = this.state;
    this.pacman.move(this.map, lastKeyMove);
    const pacmanPosition = this.map.grid[this.pacman.row][this.pacman.column];
    this.ghost.hasBeenScared(pacmanPosition);
    this.increasePoints();
    const posibleGhostMoves = this.ghost.direction(this.pacman);
    this.ghost.move(this.map, posibleGhostMoves);
    this.checkForGameOver();
    this.ghost.reduceScaredCounter();
    this.setState({
      map: this.map.actualState(),
      pacman: this.pacman.actualState(),
      ghost: this.ghost.actualState()
    });
  }

  onSwiped(event) {
    const { dir } = event;
    let { lastKeyMove } = this.state;
    switch (dir) {
      case MOVE_LEFT:
        if (this.map.isWalkable(this.pacman.row, this.pacman.column - 1))
          lastKeyMove = ARROW_LEFT_KEY;
        break;
      case MOVE_UP:
        if (this.map.isWalkable(this.pacman.row - 1, this.pacman.column))
          lastKeyMove = ARROW_UP_KEY;
        break;
      case MOVE_RIGHT:
        if (this.map.isWalkable(this.pacman.row, this.pacman.column + 1))
          lastKeyMove = ARROW_RIGHT_KEY;
        break;
      case MOVE_DOWN:
        if (this.map.isWalkable(this.pacman.row + 1, this.pacman.column))
          lastKeyMove = ARROW_DOWN_KEY;
        break;
      default:
        break;
    }
    this.setState({ lastKeyMove });
  }

  onKeyDown(event) {
    const { key } = event;
    let { lastKeyMove } = this.state;
    switch (key) {
      case ARROW_LEFT_KEY:
        if (this.map.isWalkable(this.pacman.row, this.pacman.column - 1))
          lastKeyMove = key;
        break;
      case ARROW_UP_KEY:
        if (this.map.isWalkable(this.pacman.row - 1, this.pacman.column))
          lastKeyMove = key;
        break;
      case ARROW_RIGHT_KEY:
        if (this.map.isWalkable(this.pacman.row, this.pacman.column + 1))
          lastKeyMove = key;
        break;
      case ARROW_DOWN_KEY:
        if (this.map.isWalkable(this.pacman.row + 1, this.pacman.column))
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

  // shouldPacmanMove(map, pacman, key) {
  //   const { isGameOver, isGameWon, isPlaying, lastKeyMove } = this.state;
  //   if (!isGameOver && !isGameWon && isPlaying && lastKeyMove) {
  //     this.movePacman(map, pacman, key);
  //   }
  //   return;
  // }

  increasePoints() {
    let { points, highestScore } = this.state;
    const nextPosition = this.map.grid[this.pacman.row][this.pacman.column];
    if (nextPosition.type === DOT) {
      if (this.ghost.isScared) {
        // more points when ghost is scared
        points += 5 * DOT_POINTS;
      } else {
        points += DOT_POINTS;
      }
      this.map.dotsAreEaten(this.pacman);
    } else if (nextPosition.type === BIG_DOT) {
      points += BIGDOT_POINTS;
      this.map.dotsAreEaten(this.pacman);
    }
    if (points >= highestScore) {
      highestScore = points;
    }
    this.setState({ points, highestScore });
  }

  checkForWin() {
    let isGameWon = true;
    let isPlaying = true;
    this.map.grid.forEach(row => {
      row = row.map(r => r.type);
      if (row.includes(DOT) || row.includes(BIG_DOT)) {
        isGameWon = false;
      }
    });
    if (isGameWon) {
      this.ghost.row = -1;
      this.ghost.column = 1;
      isPlaying = false;
      clearInterval(this.interval);
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.winningSound.play();
      this.scroll.enable();
    }
    this.setState({
      isGameWon,
      isPlaying,
      ghost: this.ghost.actualState()
    });
    return isGameWon;
  }

  checkForGameOver() {
    let { isGameOver, isPlaying } = this.state;
    if (
      this.pacman.row === this.ghost.row &&
      this.pacman.column === this.ghost.column
    ) {
      if (this.ghost.isScared) {
        this.ghost.hasBeenEaten();
        return;
      }
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

  render() {
    const {
      map,
      pacman,
      ghost,
      points,
      highestScore,
      isGameOver,
      isGameWon,
      isGamePaused,
      isPlaying
    } = this.state;
    return (
      <div
        className="game"
        tabIndex="0"
        onDoubleClick={this.pauseGame}
        onKeyDown={this.onKeyDown}
      >
        <Swipeable onSwiped={this.onSwiped} {...SWIPEABLE_CONFIG}>
          <Wrapper>
            <p className="yellow-text">
              Points: {points} | Highest Score: {highestScore}
            </p>
            <GlyphsMap
              map={map}
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
    <h1 className="yellow-text">{isPlaying ? "RESTART" : "START"}</h1>
  </div>
);

export default Game;
