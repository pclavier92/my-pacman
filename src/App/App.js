import React from 'react';
import heading from './heading.png';
import './App.css';
import Game from '../Game';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={heading} className="App-logo" alt="heading" />
      </header>
      <Game />
    </div>
  );
}

export default App;
