import React from 'react';

const Edge = ({ from, to, highlight }) => {
    return (
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={highlight ? "yellow" : "black"}
        strokeWidth={highlight ? "8" : "5"}
      />
    );
  };
  

export default Edge;
