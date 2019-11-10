import React, { useLayoutEffect, useState } from 'react';

import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';

import { WindowSizeContext } from '../context';
import Game from '../Game';
import './App.css';

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const VolumeWrapper = ({ children, mute, setMute}) => (
  <div className="volume-icon" onClick={() => setMute(!mute)}>
    { children }
  </div>
);

const App = () => {
  const [width, height] = useWindowSize();
  const [mute, setMute] = useState(false);
  const windowSize = { width, height };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-header">My Pacman</h1>
        <VolumeWrapper mute={mute} setMute={setMute}>
          { mute ? <VolumeOffRoundedIcon fontSize="small" /> : <VolumeUpRoundedIcon fontSize="small" /> }
        </VolumeWrapper>
      </header>
      <WindowSizeContext.Provider value={windowSize}>
        <Game isMuted={mute} />
      </WindowSizeContext.Provider>
    </div>
  );
}

export default App;
