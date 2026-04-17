export function euclideanDist(a, b) {
  return Math.round(Math.hypot(a.x - b.x, a.y - b.y) / 2);
}

export function buildAllEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++)
      edges.push({ u: i, v: j, w: euclideanDist(nodes[i], nodes[j]) });
  return edges;
}