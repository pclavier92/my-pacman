const EMPTY = {
  isWalkable: true,
  render: ''
}

const DOT = {
  isWalkable: true,
  render: 'dot'
}

const BIG_DOT = {
  isWalkable: true,
  render: 'bigdot'
}

const INITIAL_BOARD = [
  ['pacman-right', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'bigdot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
  ['bigdot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'bigdot']
 ];

export const getInitialBoard = () => INITIAL_BOARD.map(row => row.slice());
