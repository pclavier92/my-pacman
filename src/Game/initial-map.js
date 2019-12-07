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
  BOTTOM_LEFT_CORNER_WALL,
  LEFT_END_WALL,
  RIGHT_END_WALL,
  UP_END_WALL,
  DOWN_END_WALL
} = config;
// const { COLUMNS, ROWS } = settings;

const createWalkable = type =>
  Object.freeze({
    isWalkable: true,
    type
  });

const createNotWalkable = type =>
  Object.freeze({
    isWalkable: false,
    type
  });

const empty = createWalkable(EMPTY);
const dot = createWalkable(DOT);
const bigDot = createWalkable(BIG_DOT);

const verticalWall = createNotWalkable(VERTICAL_WALL);
const horizontalWall = createNotWalkable(HORIZONTAL_WALL);
const topLeftConrnerWall = createNotWalkable(TOP_LEFT_CORNER_WALL);
const topRightCornerWall = createNotWalkable(TOP_RIGHT_CORNER_WALL);
const bottomRightCornerWall = createNotWalkable(BOTTOM_RIGHT_CORNER_WALL);
const bottomLeftCornerWAll = createNotWalkable(BOTTOM_LEFT_CORNER_WALL);
const leftEndWall = createNotWalkable(LEFT_END_WALL);
const rightEndWall = createNotWalkable(RIGHT_END_WALL);
const upEndWall = createNotWalkable(UP_END_WALL);
const downEndWall = createNotWalkable(DOWN_END_WALL);

// const createDotFilledRow = () => new Array(COLUMNS).fill(dot);
// const createFirstRow = () => {
//   const row = new Array(COLUMNS - 2).fill(dot);
//   row.unshift(empty);
//   row.push(bigDot);
//   return row;
// };
// const createLastRow = () => {
//   const row = new Array(COLUMNS - 2).fill(dot);
//   row.push(bigDot);
//   row.unshift(bigDot);
//   return row;
// };

// export const generateDynamicMap = () => {
//   const map = new Array(ROWS - 2).fill(createDotFilledRow());
//   map.unshift(createFirstRow());
//   map.unshift(createLastRow());
//   return map;
// };

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
    rightEndWall,
    empty,
    leftEndWall,
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
    leftEndWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    rightEndWall,
    dot,
    leftEndWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    horizontalWall,
    topRightCornerWall,
    dot,
    topLeftConrnerWall,
    rightEndWall,
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
    downEndWall,
    dot,
    leftEndWall,
    bottomRightCornerWall,
    dot,
    downEndWall,
    dot,
    downEndWall,
    dot,
    downEndWall,
    dot,
    topLeftConrnerWall,
    dot,
    topRightCornerWall,
    dot,
    downEndWall,
    dot,
    downEndWall,
    dot,
    downEndWall,
    dot,
    bottomLeftCornerWAll,
    rightEndWall,
    dot,
    downEndWall
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
    upEndWall,
    dot,
    leftEndWall,
    topRightCornerWall,
    dot,
    upEndWall,
    dot,
    upEndWall,
    dot,
    upEndWall,
    dot,
    bottomLeftCornerWAll,
    dot,
    bottomRightCornerWall,
    dot,
    upEndWall,
    dot,
    upEndWall,
    dot,
    upEndWall,
    dot,
    topLeftConrnerWall,
    rightEndWall,
    dot,
    upEndWall
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
    leftEndWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    rightEndWall,
    dot,
    leftEndWall,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    horizontalWall,
    bottomRightCornerWall,
    dot,
    bottomLeftCornerWAll,
    rightEndWall,
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
    rightEndWall,
    empty,
    leftEndWall,
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
