import React from 'react';
import { WindowSizeContext } from '../context';
import Square from '../Square';
import './Board.css';

const MARGIN = 200;

const computeSquareSize = (board, width, height) => {
  const rows = board.length;
  const columns = board[0].length;
  const squareWidth = Math.ceil((width - MARGIN)/columns) ;
  const squareHeight = Math.ceil((height - MARGIN)/rows);
  return Math.min(squareWidth, squareHeight);
};

const Board = ({ board, isGameOver, isGameWon, isGamePaused }) => {
  return (
    <div className="board">
      <WindowSizeContext.Consumer> 
      { 
        ({width, height}) => {
          const size = computeSquareSize(board, width, height);
          return board.map( row => (
            <div>
              { row.map(t => <Square size={size} type={t} /> ) }
            </div>
          ));
        }
      }
      </WindowSizeContext.Consumer>
      <Modal 
        isGameOver={isGameOver} 
        isGameWon={isGameWon}
        isGamePaused={isGamePaused}
      />
    </div>
  );
};

export default Board;

const Modal = ({ isGameOver, isGameWon, isGamePaused }) => (
  <div style={isGameOver || isGameWon || isGamePaused ? { display: 'block' } : {}} className="modal">
    <div className="modal-content">
      { isGameOver ? <h1 className="red-text">GAME OVER</h1> : null }
      { isGameWon ? <h1 className="yellow-text">YOU HAVE WON!</h1> : null }
      { isGamePaused ? <h1 className="yellow-text">PAUSE</h1> : null }
    </div>
  </div>
)