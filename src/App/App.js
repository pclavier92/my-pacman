import React, { useLayoutEffect, useState } from 'react';
import { WindowSizeContext } from '../context';
import Game from '../Game';
import './App.css';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function App() {
  const [width, height] = useWindowSize();
  const windowSize = { width, height };
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-header">My Pacman</h1>
      </header>
      <WindowSizeContext.Provider value={windowSize}>
        <Game />
      </WindowSizeContext.Provider>
    </div>
  );
}

export default App;
