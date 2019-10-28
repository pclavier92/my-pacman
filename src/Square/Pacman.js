import React, { useEffect, useState } from 'react';
import pacmanImage from './pacman.png';
import './Square.css';

const ANIMATION_STEPS = 5;
const GAME_SPEED = 250;

const computeMovementAnimation = (size, lastMove, column, row, setLeft, setTop, setStepSize, setStep) => {
  setStep(ANIMATION_STEPS);
  const stepSize = size / (ANIMATION_STEPS + 1);
  setStepSize(stepSize);
  if (lastMove === 'right') {
    setLeft(column * size - stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
  }
  if (lastMove === 'left') {
    setLeft(column * size + stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
  }
  if (lastMove === 'down') {
    setTop(row * size - stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
  }
  if (lastMove === 'up') {
    setTop(row * size + stepSize * Math.floor((ANIMATION_STEPS + 1) /2));
  }
}

const Pacman = ({ size, pacman }) => {
  const { lastMove, column, row } = pacman;
  const [stepSize, setStepSize] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [step, setStep] = useState(ANIMATION_STEPS);

  useEffect(() => 
    computeMovementAnimation(size, lastMove, column, row, setLeft, setTop, setStepSize, setStep)
  , [size, lastMove, column, row]);

  useEffect(() => {
    while(step > 0) {
      const timer = setTimeout(() => {
        if (lastMove === 'right') {
          setLeft(left + stepSize);
        }
        if (lastMove === 'left') {
          setLeft(left - stepSize);
        }
        if (lastMove === 'down') {
          setTop(top + stepSize);
        }
        if (lastMove === 'up') {
          setTop(top - stepSize);
        }
        setStep(step - 1);
      }, GAME_SPEED / (ANIMATION_STEPS + 1));
      return () => clearTimeout(timer);
    }
  }, [left, top, step, stepSize, lastMove]);

  return (
    <div style={{ width: size, height: size, left, top }} className="square absolute">
      <img src={pacmanImage} className={`pacman ${pacman.lastMove}`} alt="" />
    </div>  
  );
}

export default Pacman;
