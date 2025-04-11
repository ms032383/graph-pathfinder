export function bellmanFord(nodes, edges, startId, endId) {
    const dist = {};
    const prev = {};
    const nodeIds = nodes.map(n => n.id);
  
    nodeIds.forEach(id => {
      dist[id] = Infinity;
      prev[id] = null;
    });
    dist[startId] = 0;
  
    for (let i = 0; i < nodeIds.length - 1; i++) {
      for (const edge of edges) {
        const { source, target, data } = edge;
        const weight = data?.weight || 1;
        if (dist[source] + weight < dist[target]) {
          dist[target] = dist[source] + weight;
          prev[target] = source;
        }
      }
    }
  
    const path = [];
    let u = endId;
    while (prev[u]) {
      path.unshift([prev[u], u]);
      u = prev[u];
    }
  
    return { path, totalDistance: dist[endId] };
  }
  