import React from 'react';
import pacmanImage from './pacman.png';
import './Square.css';

const Pacman = ({ size, pacman }) => {
  const left = pacman.column * size;
  const top = pacman.row * size;
  return (
    <div style={{ width: size, height: size, left, top }} className="square absolute">
      <img src={pacmanImage} style={{animationPlayState: 'running'}} className={`pacman ${pacman.lastMove}`} alt="" />
    </div>  
  );
}

export default Pacman;
