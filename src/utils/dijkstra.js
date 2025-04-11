export function dijkstra(nodes, edges, startId, endId) {
    const distances = {};
    const previous = {};
    const visited = new Set();
    const queue = [];
  
    // Set initial distances to Infinity
    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
    });
    distances[startId] = 0;
    queue.push({ id: startId, dist: 0 });
  
    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      const { id: currentId } = queue.shift();
      visited.add(currentId);
  
      if (currentId === endId) break;
  
      // Get all neighbors
      const neighbors = edges.filter(e =>
        e.source === currentId || e.target === currentId
      );
  
      for (const edge of neighbors) {
        const neighborId = edge.source === currentId ? edge.target : edge.source;
        if (visited.has(neighborId)) continue;
  
        const weight = edge.data?.weight || 1;
        const newDist = distances[currentId] + weight;
  
        if (newDist < distances[neighborId]) {
          distances[neighborId] = newDist;
          previous[neighborId] = currentId;
          queue.push({ id: neighborId, dist: newDist });
        }
      }
    }
  
    // Reconstruct path
    const path = [];
    let current = endId;
    while (current && previous[current]) {
      path.unshift([previous[current], current]);
      current = previous[current];
    }
  
    const totalDistance = distances[endId];
    return path.length ? { path, totalDistance } : { path: [], totalDistance: 0 };
  }
  