import React from 'react';
import { dot } from '../media/images';
import { config } from '../constants';
import './Square.css';

const { DOT, BIG_DOT, WALL } = config;

const dotSquare = <img src={dot} className={`${DOT}`} alt="" />;
const bigDotSquare = <img src={dot} className={`${BIG_DOT}`} alt="" />;
const wallSquare = <div className="wall"></div>

const Square = ({ size, type }) => {
  let squareContent = null;
  switch(type) {
    case DOT:
        squareContent = dotSquare;
      break;
    case BIG_DOT:
        squareContent = bigDotSquare;
      break;
    case WALL:
        squareContent = wallSquare;
      break;
    default:
      break;
  }

  return (
    <div style={{ width: size, height: size }} className="square">
      { squareContent }
    </div>  
  );
}

export default Square;
