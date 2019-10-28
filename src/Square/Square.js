import React from 'react';
import dot from './dot.png';
import './Square.css';

const dotSquare = <img src={dot} className="dot" alt="" />;
const bigDotSquare = <img src={dot} className="bigdot" alt="" />;

const Square = ({ style, size, type }) => {
  let squareContent = null;
  switch(type) {
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
