import React from 'react';
import { WindowSizeContext } from '../context';
import Square from '../Square';
import Pacman from '../Square/Pacman';
import Ghost from '../Square/Ghost';
import './Board.css';

const WIDTH_MARGIN = 0.1;
const HEIGHT_MARGIN = 0.5;

const computeSquareSize = (board, width, height) => {
  const rows = board.length;
  const columns = board[0].length;
  const squareWidth = Math.ceil(width*(1 - WIDTH_MARGIN)/columns) ;
  const squareHeight = Math.ceil(height*(1 - HEIGHT_MARGIN)/rows);
  return Math.min(squareWidth, squareHeight);
};

const Board = ({ board, pacman, ghost, isGameOver, isGameWon, isGamePaused }) => {
  return (
    <div className="board-background">   
      <WindowSizeContext.Consumer>
        { 
          ({width, height}) => {
            const size = computeSquareSize(board, width, height);
            return (
              <div>
                <div className="board">   
                {
                  board.map( row => (
                  <div>
                    { row.map(t => <Square size={size} type={t} /> ) }
                  </div>
                  ))
                }
                <Pacman pacman={pacman} size={size} />
                <Ghost ghost={ghost} size={size} />
                </div>
                <Modal 
                  isGameOver={isGameOver} 
                  isGameWon={isGameWon}
                  isGamePaused={isGamePaused}
                />
              </div>
            );
          }
        }
      </WindowSizeContext.Consumer>
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