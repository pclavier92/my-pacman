import config from "../config";
import settings from "../settings";

const { ROWS, COLUMNS } = settings;
const {
  MOVE_LEFT,
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_DOWN,
  ARROW_LEFT_KEY,
  ARROW_UP_KEY,
  ARROW_RIGHT_KEY,
  ARROW_DOWN_KEY
} = config;

class Pacman {
  constructor() {
    this.row = 5;
    this.column = 0;
    this.lastMove = null;
    this.isMovingTowardsWall = false;
  }

  toInitialState() {
    this.row = 5;
    this.column = 0;
    this.lastMove = null;
    this.isMovingTowardsWall = false;
    return {
      row: 5,
      column: 0,
      lastMove: null,
      isMovingTowardsWall: false
    };
  }

  actualState() {
    return {
      row: this.row,
      column: this.column,
      lastMove: this.lastMove,
      isMovingTowardsWall: this.isMovingTowardsWall
    };
  }

  move(map, lastKeyMove) {
    switch (lastKeyMove) {
      case ARROW_LEFT_KEY:
        if (this.column === 0) {
          this.column = COLUMNS - 1;
        } else if (!map.isWalkable(this.row, this.column - 1)) {
          return;
        } else {
          this.column--;
          if (map.isWalkable(this.row, this.column - 1)) {
            this.isMovingTowardsWall = false;
          } else {
            this.isMovingTowardsWall = true;
          }
        }
        this.lastMove = MOVE_LEFT;
        break;
      case ARROW_UP_KEY:
        if (this.row === 0) {
          this.row = ROWS - 1;
        } else if (!map.isWalkable(this.row - 1, this.column)) {
          return;
        } else {
          this.row--;
          if (map.isWalkable(this.row - 1, this.column)) {
            this.isMovingTowardsWall = false;
          } else {
            this.isMovingTowardsWall = true;
          }
        }
        this.lastMove = MOVE_UP;
        break;
      case ARROW_RIGHT_KEY:
        if (this.column === COLUMNS - 1) {
          this.column = 0;
        } else if (!map.isWalkable(this.row, this.column + 1)) {
          return;
        } else {
          this.column++;
          if (map.isWalkable(this.row, this.column + 1)) {
            this.isMovingTowardsWall = false;
          } else {
            this.isMovingTowardsWall = true;
          }
        }
        this.lastMove = MOVE_RIGHT;
        break;
      case ARROW_DOWN_KEY:
        if (this.row === ROWS - 1) {
          this.row = 0;
        } else if (!map.isWalkable(this.row + 1, this.column)) {
          return;
        } else {
          this.row++;
          if (map.isWalkable(this.row + 1, this.column)) {
            this.isMovingTowardsWall = false;
          } else {
            this.isMovingTowardsWall = true;
          }
        }
        this.lastMove = MOVE_DOWN;
        break;
      default:
        break;
    }
  }
}

export default Pacman;
