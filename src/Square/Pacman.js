import React, { useEffect, useState } from 'react';
import { pacmanOpen, pacmanClosed } from '../media/images';
import './Square.css';

const ANIMATION_STEPS = 5;
const GAME_SPEED = 250;

const computeMovementAnimation = (size, lastMove, column, row, setLeft, setTop, setStepSize, setStep) => {
  setStep(ANIMATION_STEPS);
  const stepSize = size / (ANIMATION_STEPS + 1);
  setStepSize(stepSize);
  if (lastMove === 'right') {
    setLeft(column * size - stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
    setTop(row * size);
  } else if (lastMove === 'left') {
    setLeft(column * size + stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
    setTop(row * size);
  } else if (lastMove === 'down') {
    setTop(row * size - stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
    setLeft(column * size);
  } else if (lastMove === 'up') {
    setTop(row * size + stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
    setLeft(column * size);
  } else {
    setTop(row * size);
    setLeft(column * size);
  }
}

const Pacman = ({ size, lastMove, column, row }) => {
  console.log(column, row)
  const [stepSize, setStepSize] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [step, setStep] = useState(ANIMATION_STEPS);

  useEffect(() => 
    computeMovementAnimation(size, lastMove, column, row, setLeft, setTop, setStepSize, setStep)
  , [lastMove, column, row]);

  useEffect(() => {
    while(step > 0) {
      const timer = setTimeout(() => {
        if (lastMove === 'right') {
          setLeft(left + stepSize);
        } else if (lastMove === 'left') {
          setLeft(left - stepSize);
        } else if (lastMove === 'down') {
          setTop(top + stepSize);
        } else if (lastMove === 'up') {
          setTop(top - stepSize);
        }
        setStep(step - 1);
      }, GAME_SPEED / (ANIMATION_STEPS + 1));
      return () => clearTimeout(timer);
    }
  }, [left, top, step, stepSize, lastMove]);

  console.log(left, top)

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
