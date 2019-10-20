
import React from 'react';

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const WindowSizeContext = React.createContext({
  width: 0,
  height: 0
});

