import React from 'react';
import dot from './dot.png';
import ghost from './ghost.png';
import scaredGhost from './scared-ghost.png';
import './Square.css';

const ghostRight = <img src={ghost} className="ghost right" alt="" />;
const ghostLeft = <img src={ghost} className="ghost left" alt="" />;
const scaredGhostSquare = <img src={scaredGhost} className="ghost" alt="" />;
const dotSquare = <img src={dot} className="dot" alt="" />;
const bigDotSquare = <img src={dot} className="bigdot" alt="" />;

const Square = ({ style, size, type }) => {
  let squareContent = null;
  switch(type) {     
    case "ghost-right":  
    squareContent = ghostRight;
      break;
    case "ghost-left":  
      squareContent = ghostLeft;
      break;
    case "scared-ghost":  
      squareContent = scaredGhostSquare;
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
    <div style={{ ...style, width: size, height: size }} className="square">
      { squareContent }
    </div>  
  );
}

export default Square;
