import React from 'react';
import pacman from './pacman.png';
import ghost from './ghost.png';
import './Square.css';

const pacmanRight = <img src={pacman} className="pacman right" alt="" />;
const pacmanDown = <img src={pacman} className="pacman down" alt="" />;
const pacmanLeft = <img src={pacman} className="pacman left" alt="" />;
const pacmanUp = <img src={pacman} className="pacman up" alt="" />;
const ghostRight = <img src={ghost} className="ghost right" alt="" />;
const ghostLeft = <img src={ghost} className="ghost left" alt="" />;
const dotSquare = <span className="dot">&middot;</span>;
const bigDotSquare = <span className="dot">&bull;</span>;

const Square = ({ type }) => {
  let squareContent = null;
  switch(type) {
    case "pacman-right":  
    squareContent = pacmanRight;
      break;
    case "pacman-down":  
      squareContent = pacmanDown;
        break;
    case "pacman-left":  
      squareContent = pacmanLeft;
        break;
    case "pacman-up":  
      squareContent = pacmanUp;
        break;      
    case "ghost-right":  
    squareContent = ghostRight;
      break;
    case "ghost-left":  
      squareContent = ghostLeft;
      break;
    case "dot":
        squareContent = dotSquare;
      break;
    case "bigdot":
        squareContent = bigDotSquare;
      break;
    default:
      break;
  }

  return (
    <div className="square">
      { squareContent }
    </div>
  );
}

export default Square;
