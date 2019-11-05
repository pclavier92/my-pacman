import React from 'react';
import { 
  dot,
  verticalWall,
  horizontalWall,
  topLeftCornerWall,
  topRightCornerWall,
  bottomRightCornerWall,
  bottomLeftCornerWall
} from '../media/images';
import { config } from '../constants';
import './Square.css';

const { 
  DOT, 
  BIG_DOT, 
  VERTICAL_WALL,
  HORIZONTAL_WALL,
  TOP_LEFT_CORNER_WALL,
  TOP_RIGHT_CORNER_WALL,
  BOTTOM_RIGHT_CORNER_WALL,
  BOTTOM_LEFT_CORNER_WALL
} = config;

const imagesMap = {
  [DOT]: <img src={dot} className={`${DOT}`} alt="" />,
  [BIG_DOT]: <img src={dot} className={`${BIG_DOT}`} alt="" />,
  [VERTICAL_WALL]: <img src={verticalWall} className="wall" alt="" />,
  [HORIZONTAL_WALL]: <img src={horizontalWall} className="wall" alt="" />,
  [TOP_LEFT_CORNER_WALL]: <img src={topLeftCornerWall} className="wall" alt="" />,
  [TOP_RIGHT_CORNER_WALL]: <img src={topRightCornerWall} className="wall" alt="" />,
  [BOTTOM_RIGHT_CORNER_WALL]: <img src={bottomRightCornerWall} className="wall" alt="" />,
  [BOTTOM_LEFT_CORNER_WALL]: <img src={bottomLeftCornerWall} className="wall" alt="" />
}

const Square = ({ size, type }) => {
  const squareContent = imagesMap[type] || null;
  return (
    <div style={{ width: size, height: size }} className="square">
      { squareContent }
    </div>  
  );
}

export default Square;
