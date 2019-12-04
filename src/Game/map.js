import config from "../config";
import { getInitialMap } from "./initial-map";

const { EMPTY } = config;

class Pacman {
  constructor() {
    this.grid = getInitialMap();
  }

  toInitialState() {
    this.grid = getInitialMap();
    return this.grid;
  }

  actualState() {
    return this.grid;
  }

  isWalkable(nextRow, nextColumn) {
    return (
      this.grid[nextRow] &&
      this.grid[nextRow][nextColumn] &&
      this.grid[nextRow][nextColumn].isWalkable
    );
  }

  dotsAreEaten(pacman) {
    this.grid[pacman.row][pacman.column] = {
      isWalkable: true,
      type: EMPTY
    };
  }
}

export default Pacman;
