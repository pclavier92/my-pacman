import React from 'react';
import { useMovementAnimation } from '../movement-animation';
import { 
  ghost as ghostImage, 
  scaredGhost as scaredGhostImage
} from '../media/images';
import './Square.css';

const Ghost = ({ size, lastMove, column, row, isScared, isMovingTowardsWall: halfLenght }) => {
  const halfSpeed = isScared;
  const { left, top } = useMovementAnimation(size, lastMove, column, row, halfLenght, halfSpeed);

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
