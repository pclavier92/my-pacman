import React from 'react';
import { 
  ghost as ghostImage, 
  scaredGhost as scaredGhostImage
} from '../media/images';
import './Square.css';

const Ghost = ({ size, lastMove, column, row, isScared }) => {
  const left = column * size;
  const top = row * size;
  let Ghost;
  if (isScared) {
    Ghost = <img src={scaredGhostImage} className="ghost" alt="" />;
  } else {
    Ghost = <img src={ghostImage} className={`ghost ${lastMove}`} alt="" />; 
  }
  return (
    <div style={{ width: size, height: size, left, top }} className="square absolute">
      { Ghost }
    </div>  
  );
}

export default Ghost;
