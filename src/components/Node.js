import React from 'react';

const Node = ({ id, x, y, label, onClick, isSelected }) => {
  return (
    <>
      <circle
        cx={x}
        cy={y}
        r="25"
        fill={isSelected ? "#f00" : "#ddd"}
        stroke="#000"
        strokeWidth="2"
        onClick={() => onClick(id)}
        style={{ cursor: "pointer" }}
      />
      <text x={x} y={y + 40} fill="#fff" fontSize="14px" textAnchor="middle">
  {label}
</text>

    </>
  );
};

export default Node;
