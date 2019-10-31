import React, { useState } from 'react';
import { useAnimationInitialPosition, useMovementAnimation } from '../movement-animation';
import { pacmanOpen, pacmanClosed } from '../media/images';
import './Square.css';



const ANIMATION_STEPS = 10;

const Pacman = ({ size, lastMove, column, row }) => {
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [step, setStep] = useState(0);
  useAnimationInitialPosition(size, lastMove, column, row, setLeft, setTop, setStep);
  useMovementAnimation(size, lastMove, step, setStep, left, setLeft, top, setTop);
  
  let Pacman;
  if ( Math.abs(ANIMATION_STEPS - step) < ANIMATION_STEPS/2 ) {
    Pacman = <img src={pacmanClosed} className={`pacman ${lastMove}`} alt="" />;
  } else {
    Pacman = <img src={pacmanOpen} className={`pacman ${lastMove}`} alt="" />;
  }

  return (
    <div style={{ width: size, height: size, left, top }} className="square absolute">
      { Pacman }
    </div>  
  );
}

export default Pacman;
