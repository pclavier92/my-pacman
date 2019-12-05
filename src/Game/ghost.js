import config from "../config";
import settings from "../settings";

const { ROWS, COLUMNS, GAME_SPEED, SCARED_SECONDS } = settings;
const { MOVE_LEFT, MOVE_UP, MOVE_RIGHT, MOVE_DOWN, BIG_DOT } = config;

const EMPTY = 0;
const GHOST = -1;
const PACMAN = 1;

class Ghost {
  constructor() {
    this.row = 5;
    this.column = COLUMNS - 1;
    this.lastMove = null;
    this.isScared = false;
    this.scaredCounter = 0;
    this.isMovingTowardsWall = false;
  }

  toInitialState() {
    this.row = 5;
    this.column = COLUMNS - 1;
    this.lastMove = null;
    this.isScared = false;
    this.scaredCounter = 0;
    this.isMovingTowardsWall = false;
    return {
      row: 5,
      column: COLUMNS - 1,
      lastMove: null,
      isScared: false,
      scaredCounter: 0,
      isMovingTowardsWall: false
    };
  }

  actualState() {
    return {
      row: this.row,
      column: this.column,
      lastMove: this.lastMove,
      isScared: this.isScared,
      scaredCounter: this.scaredCounter,
      isMovingTowardsWall: this.isMovingTowardsWall
    };
  }

  direction(map, pacman) {
    if (this.isScared) {
      return this.setScaredDirection(pacman);
    }
    return this.setDirection(map, pacman);
  }

  //TO BE DEPRECATED
  _setDirection(map, pacman) {
    let posibleMoves = [];
    if (pacman.row < this.row) {
      posibleMoves.push(MOVE_UP);
    }
    if (pacman.row > this.row) {
      posibleMoves.push(MOVE_DOWN);
    }
    if (pacman.column < this.column) {
      posibleMoves.push(MOVE_LEFT);
    }
    if (pacman.column > this.column) {
      posibleMoves.push(MOVE_RIGHT);
    }
    return posibleMoves;
  }

  setDirection(map, pacman) {
    const posibleMoves = [];
    let cursor;
    let currentDistance;
    let nextMove;
    const matrix = map.grid.map(() => new Array(COLUMNS).fill(EMPTY));
    matrix[this.row][this.column] = GHOST;
    matrix[pacman.row][pacman.column] = PACMAN;
    const queue = [];
    queue.push({
      row: pacman.row,
      column: pacman.column
    });
    while (queue.length > 0) {
      cursor = queue.shift();
      currentDistance = matrix[cursor.row][cursor.column];
      this.findPath(
        queue,
        map,
        matrix,
        cursor.row + 1,
        cursor.column,
        currentDistance
      );
      this.findPath(
        queue,
        map,
        matrix,
        cursor.row - 1,
        cursor.column,
        currentDistance
      );
      this.findPath(
        queue,
        map,
        matrix,
        cursor.row,
        cursor.column + 1,
        currentDistance
      );
      this.findPath(
        queue,
        map,
        matrix,
        cursor.row,
        cursor.column - 1,
        currentDistance
      );
    }
    currentDistance = ROWS * COLUMNS;

    if (
      matrix[this.row + 1][this.column] !== EMPTY &&
      matrix[this.row + 1][this.column] < currentDistance
    ) {
      nextMove = MOVE_DOWN;
      currentDistance = matrix[this.row + 1][this.column];
    }
    if (
      matrix[this.row - 1][this.column] !== EMPTY &&
      matrix[this.row - 1][this.column] < currentDistance
    ) {
      nextMove = MOVE_UP;
      currentDistance = matrix[this.row - 1][this.column];
    }
    if (
      matrix[this.row][this.column + 1] !== EMPTY &&
      matrix[this.row][this.column + 1] < currentDistance
    ) {
      nextMove = MOVE_RIGHT;
      currentDistance = matrix[this.row][this.column + 1];
    }
    if (
      matrix[this.row][this.column - 1] !== EMPTY &&
      matrix[this.row][this.column - 1] < currentDistance
    ) {
      nextMove = MOVE_LEFT;
      currentDistance = matrix[this.row][this.column - 1];
    }
    posibleMoves.push(nextMove);
    return posibleMoves;
  }

  findPath(queue, map, matrix, row, column, distance) {
    if (map.isWalkable(row, column)) {
      if (matrix[row][column] === EMPTY) {
        matrix[row][column] = distance + 1;
        queue.push({
          row: row,
          column: column
        });
      }
    }
  }

  setScaredDirection(pacman) {
    let posibleMoves = [];
    if (pacman.row > this.row) {
      posibleMoves.push(MOVE_UP);
    }
    if (pacman.row < this.row) {
      posibleMoves.push(MOVE_DOWN);
    }
    if (pacman.column > this.column) {
      posibleMoves.push(MOVE_LEFT);
    }
    if (pacman.column < this.column) {
      posibleMoves.push(MOVE_RIGHT);
    }
    return posibleMoves;
  }

  move(map, posibleMoves) {
    if (this.isScared && this.scaredCounter % 2 === 0) return;
    const ammountMoves = posibleMoves.length;
    const nextMove = posibleMoves[Math.floor(Math.random() * ammountMoves)];
    switch (nextMove) {
      case MOVE_LEFT:
        if (!map.isWalkable(this.row, this.column - 1) || this.column - 1 < 0) {
          posibleMoves.splice(nextMove, 1);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_RIGHT);
          posibleMoves.push(MOVE_DOWN);
          this.move(map, posibleMoves);
          return;
        }
        this.column--;
        this.lastMove = MOVE_LEFT;
        if (map.isWalkable(this.row, this.column - 1)) {
          this.isMovingTowardsWall = false;
        } else {
          this.isMovingTowardsWall = true;
        }
        break;
      case MOVE_UP:
        if (!map.isWalkable(this.row - 1, this.column) || this.row - 1 < 0) {
          posibleMoves.splice(nextMove, 1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_RIGHT);
          posibleMoves.push(MOVE_DOWN);
          this.move(map, posibleMoves);
          return;
        }
        this.row--;
        this.lastMove = MOVE_UP;
        if (map.isWalkable(this.row - 1, this.column)) {
          this.isMovingTowardsWall = false;
        } else {
          this.isMovingTowardsWall = true;
        }
        break;
      case MOVE_RIGHT:
        if (
          !map.isWalkable(this.row, this.column + 1) ||
          this.column + 1 > COLUMNS - 1
        ) {
          posibleMoves.splice(nextMove, 1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_DOWN);
          this.move(map, posibleMoves);
          return;
        }
        this.column++;
        this.lastMove = MOVE_RIGHT;
        if (map.isWalkable(this.row, this.column + 1)) {
          this.isMovingTowardsWall = false;
        } else {
          this.isMovingTowardsWall = true;
        }
        break;
      case MOVE_DOWN:
        if (
          !map.isWalkable(this.row + 1, this.column) ||
          this.row + 1 > ROWS - 1
        ) {
          posibleMoves.splice(nextMove, 1);
          posibleMoves.push(MOVE_LEFT);
          posibleMoves.push(MOVE_UP);
          posibleMoves.push(MOVE_RIGHT);
          this.move(map, posibleMoves);
          return;
        }
        this.row++;
        this.lastMove = MOVE_DOWN;
        if (map.isWalkable(this.row + 1, this.column)) {
          this.isMovingTowardsWall = false;
        } else {
          this.isMovingTowardsWall = true;
        }
        break;
      default:
        break;
    }
  }

  reduceScaredCounter() {
    if (this.isScared) {
      this.scaredCounter--;
      if (this.scaredCounter === 0) {
        this.isScared = false;
      }
    }
  }

  hasBeenScared(pacmanPosition) {
    if (pacmanPosition.type === BIG_DOT) {
      this.isScared = true;
      this.scaredCounter = (SCARED_SECONDS * 1000) / GAME_SPEED;
    }
  }

  hasBeenEaten() {
    this.row = 5;
    this.isMovingTowardsWall = false;
    if (this.column < COLUMNS / 2) {
      this.column = COLUMNS - 1;
    } else {
      this.column = 0;
    }
  }
}

export default Ghost;
