import React from 'react';
import ghostImage from './ghost.png';
import scaredGhostImage from './scared-ghost.png';
import './Square.css';

const Ghost = ({ size, ghost }) => {
  const left = ghost.column * size;
  const top = ghost.row * size;
  let Ghost;
  if (ghost.isScared) {
    Ghost = <img src={scaredGhostImage} className="ghost" alt="" />;
  } else {
    Ghost = <img src={ghostImage} className={`ghost ${ghost.lastMove}`} alt="" />; 
  }
  return (
    <div style={{ width: size, height: size, left, top }} className="square absolute">
      { Ghost }
    </div>  
  );
}

export default Ghost;
