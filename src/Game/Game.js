import React from 'react';

import Square from '../Square';
import './Game.css';

const ROWNS = 5;
const COLUMNS = 10;

const INITIAL_BOARD = [
 ['pacman-right', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'bigdot'],
 ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
 ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
 ['dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot'],
 ['bigdot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'dot', 'bigdot']
];

const ARROW_LEFT = 'ArrowLeft';
const ARROW_UP = 'ArrowUp';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_DOWN = 'ArrowDown';

class Game extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      board: INITIAL_BOARD,
      pacman: {
        row: 0,
        column: 0
      }
    }
  }

  movePacman(event) {
    let { board, pacman } = this.state;
    switch(event.key) {
      case ARROW_LEFT:
        if ( pacman.column === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column--;
        board[pacman.row][pacman.column] = 'pacman-left';
        break;
      case ARROW_UP:
        if ( pacman.row === 0 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row--;
        board[pacman.row][pacman.column] = 'pacman-up';
        break;
      case ARROW_RIGHT:
        if ( pacman.column === COLUMNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.column++;
        board[pacman.row][pacman.column] = 'pacman-right';
        break;
      case ARROW_DOWN:
        if ( pacman.row === ROWNS-1 ) return;
        board[pacman.row][pacman.column] = '';
        pacman.row++;
        board[pacman.row][pacman.column] = 'pacman-down';
        break;
      default:
        break;
    }
    this.setState({ board, pacman});
  }

  render (){
    const Board = this.state.board.map( row => (
        <div>
          { row.map(t => <Square type={t} /> ) }
        </div> 
      ) 
    );
    return (
      <div className="board" tabIndex="0" onKeyDown={this.movePacman.bind(this)}>
        { Board }
      </div>
    );
  } 
}

export default Game;
