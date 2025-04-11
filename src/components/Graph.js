import React, { useState, useEffect } from 'react';
import Node from './Node';
import Edge from './Edge';
import { dijkstra } from '../utils/dijkstra';

const Graph = () => {
  const nodes = [
    { id: 'home', label: 'Home', x: 100, y: 100 },
    { id: 'market', label: 'Market', x: 100, y: 300 },
    { id: 'park', label: 'Park', x: 400, y: 300 },
    { id: 'school', label: 'School', x: 700, y: 100 },
    { id: 'mid1', label: '', x: 250, y: 100 },
    { id: 'mid2', label: '', x: 250, y: 300 },
    { id: 'mid3', label: '', x: 550, y: 300 },
    { id: 'mid4', label: '', x: 550, y: 100 },
  ];

  const edges = [
    { from: 'home', to: 'mid1' },
    { from: 'market', to: 'mid2' },
    { from: 'mid1', to: 'mid2' },
    { from: 'mid2', to: 'park' },
    { from: 'home', to: 'mid2' },
    { from: 'mid2', to: 'mid3' },
    { from: 'mid3', to: 'mid4' },
    { from: 'mid4', to: 'school' },
    { from: 'mid1', to: 'mid4' },
    { from: 'mid3', to: 'school' },
  ];

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]); // 🔸 Add this state

  const handleNodeClick = (id) => {
    if (!start) setStart(id);
    else if (!end && id !== start) setEnd(id);
    else {
      setStart(id);
      setEnd(null);
    }
  };

  const getNodeById = (id) => nodes.find(n => n.id === id);

  // 🔸 This runs Dijkstra when both nodes are selected
  useEffect(() => {
    if (start && end) {
      const result = dijkstra(nodes, edges, start, end);
      setPath(result);
    } else {
      setPath([]);
    }
  }, [start, end]);

  return (
    <svg
    viewBox="0 0 800 500"
    preserveAspectRatio="xMidYMid meet"
    style={{ width: '100%', height: '100vh', background: '#2b2b2b' }}
  >
  
      {/* Draw edges */}
      {edges.map((edge, index) => {
        const isInPath = path.includes(edge.from) && path.includes(edge.to) &&
          Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;

        return (
          <Edge
            key={index}
            from={getNodeById(edge.from)}
            to={getNodeById(edge.to)}
            highlight={isInPath}
          />
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          {...node}
          isSelected={node.id === start || node.id === end}
          onClick={handleNodeClick}
        />
      ))}
    </svg>
  );
};

export default Graph;
