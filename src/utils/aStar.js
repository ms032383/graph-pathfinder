// src/utils/aStar.js
export function aStar(nodes, edges, startId, endId) {
    const visitedOrder = [];
    const getNode = (id) => nodes.find((n) => n.id === id);
  
    const heuristic = (a, b) => {
      const dx = a.position.x - b.position.x;
      const dy = a.position.y - b.position.y;
      return 0; // scaled down
    };
  
    const gScore = {};
    const fScore = {};
    const prev = {};
    const openSet = new Set([startId]);
  
    nodes.forEach((n) => {
      gScore[n.id] = Infinity;
      fScore[n.id] = Infinity;
    });
  
    gScore[startId] = 0;
    fScore[startId] = heuristic(getNode(startId), getNode(endId));
  
    while (openSet.size > 0) {
      let current = [...openSet].reduce((a, b) => fScore[a] < fScore[b] ? a : b);
      if (current === endId) break;
  
      openSet.delete(current);
      visitedOrder.push(current);
      const neighbors = edges.filter((e) => e.source === current);
  
      for (const edge of neighbors) {
        const tentativeG = gScore[current] + (edge.data?.weight || 1);
        if (tentativeG < gScore[edge.target]) {
          prev[edge.target] = current;
          gScore[edge.target] = tentativeG;
          fScore[edge.target] = tentativeG + heuristic(getNode(edge.target), getNode(endId));
          openSet.add(edge.target);
        }
      }
    }
  
    const path = [];
    let node = endId;
    while (prev[node]) {
      path.unshift([prev[node], node]);
      node = prev[node];
    }
  
    return { path, totalDistance: gScore[endId], visitedOrder };
  }
  