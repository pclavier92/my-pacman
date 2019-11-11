import { useEffect, useState } from 'react';

import { config, settings } from '../constants';

const {
  GAME_SPEED,
  ANIMATION_STEPS
} = settings;
// FPS = 4 * ANIMATION_STEPS = 40 fps
// The time between steps is calculated as GAME_SPEED / ANIMATION_STEPS

const {
  MOVE_LEFT,
  MOVE_UP,
  MOVE_RIGHT,
  MOVE_DOWN
} = config;

/* 
*   @size: the map is divided into a grid of squares of size {size}*{size} px
*   @lastMove: indicates direction taken by player/IA
*   @column/row: position on the map/grid
*/
export const useMovementAnimation = (size, lastMove, column, row, halfLenght = false, halfSpeed = false) => { 
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    switch(lastMove) {
      case MOVE_RIGHT:
        setLeft(column * size - size/2);
        setTop(row * size);
        break;
      case MOVE_LEFT:
        setLeft(column * size + size/2);
        setTop(row * size);
        break;
      case MOVE_DOWN:
        setTop(row * size - size/2);
        setLeft(column * size);
        break;
      case MOVE_UP:
        setTop(row * size + size/2);
        setLeft(column * size);
        break;
      default:
        setTop(row * size);
        setLeft(column * size);
        break;
    }
    let numberOfSteps = halfLenght ? ANIMATION_STEPS/2 : ANIMATION_STEPS;
    numberOfSteps = halfSpeed ? 2*numberOfSteps : numberOfSteps;
    setStep(numberOfSteps);
  }, [size, lastMove, column, row, halfLenght]);

  useEffect(() => {
    const stepSize = size / ANIMATION_STEPS;
    while(step > 0) {
      let movementSpeed = GAME_SPEED / ANIMATION_STEPS
      movementSpeed = halfSpeed ? 2 * movementSpeed : movementSpeed;
      const timer = setTimeout(() => {
        switch(lastMove){
          case MOVE_RIGHT:
            setLeft(left + stepSize);
            break;
          case MOVE_LEFT:
            setLeft(left - stepSize);
            break;
          case MOVE_DOWN:
            setTop(top + stepSize);
            break;
          case MOVE_UP:
            setTop(top - stepSize);
            break;
          default:
            break
        }
        setStep(step - 1);
      }, movementSpeed );
      return () => clearTimeout(timer);
    }
  }, [left, top, step, lastMove]);
  return { left, top, step };
};