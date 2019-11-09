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
export const useMovementAnimation = (size, lastMove, column, row, halfLenght = false) => { 
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
    setStep(ANIMATION_STEPS);
  }, [size, lastMove, column, row]);

  useEffect(() => {
    let stepSize = size / ANIMATION_STEPS;
    stepSize = halfLenght ? stepSize/2 : stepSize;
    while(step > 0) {
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
      }, GAME_SPEED / ANIMATION_STEPS );
      return () => clearTimeout(timer);
    }
  }, [left, top, step, lastMove]);
  return { left, top, step };
};