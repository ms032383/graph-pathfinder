// src/components/CustomFlow.js
import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { dijkstra } from '../utils/dijkstra';
import { aStar } from '../utils/aStar';
import { bellmanFord } from '../utils/bellmanFord';

const templateNodes = [
  { id: 'home', type: 'default', position: { x: 100, y: 100 }, data: { label: '🏠 Home' }, style: { backgroundColor: '#4CAF50', color: 'white', padding: 10, borderRadius: 10 } },
  { id: 'market', type: 'default', position: { x: 300, y: 100 }, data: { label: '🛒 Market' }, style: { backgroundColor: '#2196F3', color: 'white', padding: 10, borderRadius: 10 } },
  { id: 'school', type: 'default', position: { x: 500, y: 300 }, data: { label: '🏫 School' }, style: { backgroundColor: '#FFC107', color: '#000', padding: 10, borderRadius: 10 } },
  { id: 'road1', type: 'default', position: { x: 200, y: 200 }, data: { label: '🛣️ Road 1' }, style: { backgroundColor: '#9E9E9E', color: 'white', padding: 10, borderRadius: 10 } },
  { id: 'road2', type: 'default', position: { x: 400, y: 200 }, data: { label: '🛣️ Road 2' }, style: { backgroundColor: '#9E9E9E', color: 'white', padding: 10, borderRadius: 10 } },
];

const templateEdges = [
  { id: 'e1', source: 'home', target: 'road1', label: '5', data: { weight: 5 } },
  { id: 'e2', source: 'road1', target: 'market', label: '3', data: { weight: 3 } },
  { id: 'e3', source: 'market', target: 'road2', label: '2', data: { weight: 2 } },
  { id: 'e4', source: 'road2', target: 'school', label: '4', data: { weight: 4 } },
  { id: 'e5', source: 'road1', target: 'road2', label: '6', data: { weight: 6 } },
];


const CustomFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(templateNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(templateEdges);
  const [nodeCount, setNodeCount] = useState(templateNodes.length + 1);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [shortestPath, setShortestPath] = useState([]);
  const [distance, setDistance] = useState(null);
  const [pathString, setPathString] = useState('');
  const [animatedEdges, setAnimatedEdges] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [algorithm, setAlgorithm] = useState('dijkstra');

  const addNode = () => {
    const newNode = {
      id: `${nodeCount}`,
      type: 'default',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: `Node ${nodeCount}` },
    };
    saveHistory();
    setNodes((nds) => [...nds, newNode]);
    setNodeCount((n) => n + 1);
  };

  const saveHistory = () => {
    setHistory((h) => [...h, { nodes: [...nodes], edges: [...edges] }]);
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, h.length - 1));
    setRedoStack((r) => [...r, { nodes: [...nodes], edges: [...edges] }]);
    setNodes(last.nodes);
    setEdges(last.edges);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, r.length - 1));
    setHistory((h) => [...h, { nodes: [...nodes], edges: [...edges] }]);
    setNodes(next.nodes);
    setEdges(next.edges);
  };

  const resetGraph = () => {
    saveHistory();
    setNodes([]);
    setEdges([]);
    setNodeCount(1);
    setStartNode(null);
    setEndNode(null);
    setShortestPath([]);
    setDistance(null);
    setAnimatedEdges([]);
  };

  const onConnect = useCallback((connection) => {
    const weight = prompt('Enter weight for this edge:', '1');
    if (weight === null || isNaN(weight)) return;
    saveHistory();
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          label: weight,
          data: { weight: Number(weight) },
          style: { strokeWidth: 3 },
          animated: true,
        },
        eds
      )
    );
  }, [nodes, edges]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === startNode) {
          return { ...node, style: { backgroundColor: '#00ff00' } }; // green
        } else if (node.id === endNode) {
          return { ...node, style: { backgroundColor: '#ff0000' } }; // red
        }
        return { ...node, style: {} };
      })
    );
  }, [startNode, endNode, setNodes]);

  useEffect(() => {
    if (!startNode || !endNode) {
      setShortestPath([]);
      setDistance(null);
      setAnimatedEdges([]);
      return;
    }

    let result;
    if (algorithm === 'aStar') {
      result = aStar(nodes, edges, startNode, endNode);
    } else if (algorithm === 'bellmanFord') {
      result = bellmanFord(nodes, edges, startNode, endNode);
    } else {
      result = dijkstra(nodes, edges, startNode, endNode);
    }
    setShortestPath(result.path);
    setDistance(result.totalDistance);

    // Generate path string from startNode and result.path
    const idToLabel = Object.fromEntries(nodes.map(n => [n.id, n.data.label?.replace(/[^a-zA-Z0-9 ]/g, '')]));
    const fullPath = [startNode, ...result.path.map(p => p[1])];
    setPathString(fullPath.map(id => idToLabel[id] || id).join(' → '));

    setAnimatedEdges([]);
    result.path.forEach(([from, to], index) => {
      setTimeout(() => {
        setAnimatedEdges((prev) => [...prev, [from, to]]);
      }, index * 500);
    });
  }, [startNode, endNode, nodes, edges]);

  const highlightedEdges = edges.map(edge => {
    const isInPath = animatedEdges.some(
      ([from, to]) =>
        (edge.source === from && edge.target === to) ||
        (edge.source === to && edge.target === from)
    );

    return isInPath
      ? {
          ...edge,
          style: { stroke: 'yellow', strokeWidth: 5 },
          animated: true,
        }
      : edge;
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1000,
        display: 'flex',
        gap: '12px'
      }}>
        <button onClick={addNode}>Add Node</button>
        <button onClick={resetGraph}>Reset Graph</button>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={() => {
          saveHistory();
          setNodes([...templateNodes]);
          setEdges([...templateEdges]);
          setNodeCount(templateNodes.length + 1);
          setStartNode(null);
          setEndNode(null);
          setShortestPath([]);
          setDistance(null);
          setAnimatedEdges([]);
        }}>Load Template</button>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} style={{ padding: '4px' }}>
          <option value="dijkstra">Dijkstra</option>
          <option value="aStar">A*</option>
          <option value="bellmanFord">Bellman-Ford</option>
        </select>
      </div>

      {distance !== null && (
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', backgroundColor: '#eee', padding: '16px 32px', borderRadius: 12, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', zIndex: 10 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Result</div>
          <div style={{ fontSize: 16, color: '#333' }}>{pathString}</div>
        </div>
      )}


      <ReactFlow
        nodes={nodes}
        edges={highlightedEdges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(event, node) => {
          if (!startNode) setStartNode(node.id);
          else if (!endNode && node.id !== startNode) setEndNode(node.id);
          else {
            setStartNode(node.id);
            setEndNode(null);
          }
        }}
        onNodeDoubleClick={(event, node) => {
          const newLabel = prompt('Rename this node:', node.data.label);
          if (newLabel !== null) {
            saveHistory();
            setNodes((nds) =>
              nds.map((n) =>
                n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
              )
            );
          }
        }}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default CustomFlow;
