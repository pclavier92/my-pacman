import config from "../config";
import settings from "../settings";

const {
  EMPTY,
  DOT,
  BIG_DOT,
  VERTICAL_WALL,
  HORIZONTAL_WALL,
  TOP_LEFT_CORNER_WALL,
  TOP_RIGHT_CORNER_WALL,
  BOTTOM_RIGHT_CORNER_WALL,
  BOTTOM_LEFT_CORNER_WALL
} = config;
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
const verticalWall = Object.freeze({
  isWalkable: false,
  type: VERTICAL_WALL
});
const horizontalWall = Object.freeze({
  isWalkable: false,
  type: HORIZONTAL_WALL
});

const topLeftConrnerWall = Object.freeze({
  isWalkable: false,
  type: TOP_LEFT_CORNER_WALL
});

const topRightCornerWall = Object.freeze({
  isWalkable: false,
  type: TOP_RIGHT_CORNER_WALL
});

const bottomRightCornerWall = Object.freeze({
  isWalkable: false,
  type: BOTTOM_RIGHT_CORNER_WALL
});

const bottomLeftCornerWAll = Object.freeze({
  isWalkable: false,
  type: BOTTOM_LEFT_CORNER_WALL
});

const createDotFilledRow = () => new Array(COLUMNS).fill(dot);
const createFirstRow = () => {
  const row = new Array(COLUMNS - 2).fill(dot);
  row.unshift(empty);
  row.push(bigDot);
  return row;
};
const createLastRow = () => {
  const row = new Array(COLUMNS - 2).fill(dot);
  row.push(bigDot);
  row.unshift(bigDot);
  return row;
};

export const generateDynamicMap = () => {
  const map = new Array(ROWS - 2).fill(createDotFilledRow());
  map.unshift(createFirstRow());
  map.unshift(createLastRow());
  return map;
};

export const getInitialMap = () => [
  [
    topLeftConrnerWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    empty,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    topRightCornerWall
  ],
  [
    verticalWall,
    bigDot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    bigDot,
    verticalWall
  ],
  [
    verticalWall,
    dot,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    horizontalWall,
    dot,
    horizontalWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    dot,
    verticalWall
  ],
  [
    verticalWall,
    dot,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    dot,
    dot,
    dot,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    dot,
    verticalWall
  ],
  [
    verticalWall,
    dot,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    topLeftConrnerWall,
    dot,
    topRightCornerWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    dot,
    verticalWall
  ],
  [
    empty,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    bigDot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    empty
  ],
  [
    verticalWall,
    dot,
    horizontalWall,
    topRightCornerWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    bottomLeftCornerWAll,
    dot,
    bottomRightCornerWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    dot,
    verticalWall
  ],
  [
    verticalWall,
    dot,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    dot,
    dot,
    dot,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    verticalWall,
    dot,
    dot,
    verticalWall
  ],
  [
    verticalWall,
    dot,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    horizontalWall,
    dot,
    horizontalWall,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    dot,
    verticalWall
  ],
  [
    verticalWall,
    bigDot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    dot,
    bigDot,
    verticalWall
  ],
  [
    bottomLeftCornerWAll,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    empty,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    horizontalWall,
    bottomRightCornerWall
  ]
];
