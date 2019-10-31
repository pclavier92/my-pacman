import React, { useState } from 'react';
import { useAnimationInitialPosition, useMovementAnimation } from '../movement-animation';
import { 
  ghost as ghostImage, 
  scaredGhost as scaredGhostImage
} from '../media/images';
import './Square.css';

const Ghost = ({ size, lastMove, column, row, isScared }) => {
  // const left = column * size;
  // const top = row * size;
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [step, setStep] = useState(0);
  useAnimationInitialPosition(size, lastMove, column, row, setLeft, setTop, setStep);
  useMovementAnimation(size, lastMove, step, setStep, left, setLeft, top, setTop);
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
