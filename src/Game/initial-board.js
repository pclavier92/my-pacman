import { config, settings } from '../constants';

const { EMPTY, DOT, BIG_DOT, WALL } = config;
const { COLUMNS, ROWS } = settings;

const empty = Object.freeze({
  isWalkable: true,
  type: EMPTY
});
const dot = Object.freeze({
  isWalkable: true,
  type: DOT
});
const bigDot = Object.freeze({
  isWalkable: true,
  type: BIG_DOT
});
const wall = Object.freeze({
  isWalkable: false,
  type: WALL
});

const createDotFilledRow = () => new Array(COLUMNS).fill(dot);
const createFirstRow = () => {
  const row = new Array(COLUMNS-2).fill(dot);
  row.unshift(empty);
  row.push(bigDot);
  return row;
};
const createLastRow = () => {
  const row = new Array(COLUMNS-2).fill(dot);
  row.push(bigDot);
  row.unshift(bigDot);
  return row;
};

const generateDynamicMap = () => {
  const map = new Array(ROWS-2).fill(createDotFilledRow());
  map.unshift(createFirstRow());
  map.unshift(createLastRow());
  return map;
}

export const getInitialBoard = () => (
  [
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, empty, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall],
    [wall, empty, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, bigDot, wall],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [empty, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, empty],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [wall, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, wall],
    [wall, bigDot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, dot, bigDot, wall],
    [wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, empty, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall, wall]
  ]
);
