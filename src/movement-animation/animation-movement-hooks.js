import { useEffect } from 'react';

// FPS = 4 * ANIMATION_STEPS = 40 fps
// The time between steps is calculated as GAME_SPEED / ANIMATION_STEPS
const ANIMATION_STEPS = 10;
const GAME_SPEED = 250;

const MOVE_LEFT = 'Left';
const MOVE_UP = 'Up';
const MOVE_RIGHT = 'Right';
const MOVE_DOWN = 'Down';

// size -  the map is divided into a grid of squares of size {size}*{size} px
// lastMove - indicates direction taken by player/IA
// column/row - position on the map/grid
// setLeft/setTop - sets the new position for the player/IA
export const useAnimationInitialPosition = (size, lastMove, column, row, setLeft, setTop, setStep) => {
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
}

// size -  the map is divided into a grid of squares of size {size}*{size} px
// lastMove - indicates direction taken by player/IA
// step - step in the movement animation. ANIMATION_STEPS defines the ammount or renders per movement for the animation 
// setStep - sets the step of the animation for that moment
// setLeft/setTop - sets the new position for the player/IA
export const useMovementAnimation = (size, lastMove, step, setStep, left, setLeft, top, setTop) => {
  useEffect(() => {
    const stepSize = size / ANIMATION_STEPS;
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
}