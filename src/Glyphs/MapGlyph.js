import React from "react";
import {
  dot,
  verticalWall,
  horizontalWall,
  topLeftCornerWall,
  topRightCornerWall,
  bottomRightCornerWall,
  bottomLeftCornerWall,
  leftEndWall,
  rightEndWall,
  upEndWall,
  downEndWall
} from "../media/images";
import config from "../config";
import "./Glyph.css";

const {
  DOT,
  BIG_DOT,
  VERTICAL_WALL,
  HORIZONTAL_WALL,
  TOP_LEFT_CORNER_WALL,
  TOP_RIGHT_CORNER_WALL,
  BOTTOM_RIGHT_CORNER_WALL,
  BOTTOM_LEFT_CORNER_WALL,
  LEFT_END_WALL,
  RIGHT_END_WALL,
  UP_END_WALL,
  DOWN_END_WALL
} = config;

const imagesMap = {
  [DOT]: <img src={dot} className={`${DOT}`} alt="" />,
  [BIG_DOT]: <img src={dot} className={`${BIG_DOT}`} alt="" />,
  [VERTICAL_WALL]: <img src={verticalWall} className="wall" alt="" />,
  [HORIZONTAL_WALL]: <img src={horizontalWall} className="wall" alt="" />,
  [TOP_LEFT_CORNER_WALL]: (
    <img src={topLeftCornerWall} className="wall" alt="" />
  ),
  [TOP_RIGHT_CORNER_WALL]: (
    <img src={topRightCornerWall} className="wall" alt="" />
  ),
  [BOTTOM_RIGHT_CORNER_WALL]: (
    <img src={bottomRightCornerWall} className="wall" alt="" />
  ),
  [BOTTOM_LEFT_CORNER_WALL]: (
    <img src={bottomLeftCornerWall} className="wall" alt="" />
  ),
  [LEFT_END_WALL]: <img src={leftEndWall} className="wall" alt="" />,
  [RIGHT_END_WALL]: <img src={rightEndWall} className="wall" alt="" />,
  [UP_END_WALL]: <img src={upEndWall} className="wall" alt="" />,
  [DOWN_END_WALL]: <img src={downEndWall} className="wall" alt="" />
};

const MapGlyph = ({ size, type }) => {
  const glyphContent = imagesMap[type] || null;
  return (
    <div style={{ width: size, height: size }} className="glyph">
      {glyphContent}
    </div>
  );
};

export default MapGlyph;
