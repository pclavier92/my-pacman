import React, { Fragment } from "react";
import settings from "../settings";
import { WindowSizeContext } from "../context";
import { MapGlyph, PacmanGlyph, GhostGlyph } from "../Glyphs";
import "./Map.css";

const { WIDTH_MARGIN, HEIGHT_MARGIN } = settings;

const computeGlyphSize = (map, width, height) => {
  const rows = map.length;
  const columns = map[0].length;
  const glyphWidth = Math.ceil((width * (1 - WIDTH_MARGIN)) / columns);
  const glyphHeight = Math.ceil((height * (1 - HEIGHT_MARGIN)) / rows);
  return Math.min(glyphWidth, glyphHeight);
};

const Map = ({ map, pacman, ghost, isGameOver, isGameWon, isGamePaused }) => {
  return (
    <div className="map-background">
      <WindowSizeContext.Consumer>
        {({ width, height }) => {
          const size = computeGlyphSize(map, width, height);
          return (
            <Fragment>
              <div className="map">
                {map.map((row, i) => (
                  <div key={i}>
                    {row.map(({ type }, j) => (
                      <MapGlyph key={j} size={size} type={type} />
                    ))}
                  </div>
                ))}
                {isGameOver ? null : <PacmanGlyph {...pacman} size={size} />}
                <GhostGlyph {...ghost} size={size} />
              </div>
              <Modal
                isGameOver={isGameOver}
                isGameWon={isGameWon}
                isGamePaused={isGamePaused}
              />
            </Fragment>
          );
        }}
      </WindowSizeContext.Consumer>
    </div>
  );
};

export default Map;

const Modal = ({ isGameOver, isGameWon, isGamePaused }) => (
  <div
    style={isGameOver || isGameWon || isGamePaused ? { display: "block" } : {}}
    className="modal"
  >
    <div className="modal-content">
      {isGameOver ? <h1 className="red-text">GAME OVER</h1> : null}
      {isGameWon ? <h1 className="yellow-text">YOU HAVE WON!</h1> : null}
      {isGamePaused ? <h1 className="yellow-text">PAUSE</h1> : null}
    </div>
  </div>
);
