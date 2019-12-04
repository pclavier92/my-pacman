import React from "react";
import settings from "../settings";
import { useMovementAnimation } from "../movement-animation";
import { pacmanOpen, pacmanClosed } from "../media/images";
import "./Glyph.css";

const { ANIMATION_STEPS } = settings;

const Pacman = ({
  size,
  lastMove,
  column,
  row,
  isMovingTowardsWall: halfLenght
}) => {
  const { left, top, step } = useMovementAnimation(
    size,
    lastMove,
    column,
    row,
    halfLenght
  );

  let Pacman;
  if (Math.abs(ANIMATION_STEPS - step) < ANIMATION_STEPS / 2) {
    Pacman = <img src={pacmanClosed} className={`pacman ${lastMove}`} alt="" />;
  } else {
    Pacman = <img src={pacmanOpen} className={`pacman ${lastMove}`} alt="" />;
  }

  return (
    <div
      style={{ width: size, height: size, left, top }}
      className="glyph absolute"
    >
      {Pacman}
    </div>
  );
};

export default Pacman;
