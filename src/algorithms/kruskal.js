import { makeUnionFind, union } from './unionFind';

export function kruskalSteps(nodes, edges) {
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const uf = makeUnionFind(nodes.length);
  const steps = [];
  const mst = [];

  for (const edge of sorted) {
    steps.push({ considering: edge, mst: [...mst], accepted: false });
    if (union(uf, edge.u, edge.v)) {
      mst.push(edge);
      steps.push({ considering: edge, mst: [...mst], accepted: true });
    }
    if (mst.length === nodes.length - 1) break;
  }

  steps.push({ considering: null, mst: [...mst], done: true });
  return steps;
}