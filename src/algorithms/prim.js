export function primSteps(nodes, edges) {
  const steps = [];
  const inMST = new Set([0]);
  const mst = [];

  while (inMST.size < nodes.length) {
    let best = null;

    for (const edge of edges) {
      const uIn = inMST.has(edge.u), vIn = inMST.has(edge.v);
      if ((uIn && !vIn) || (vIn && !uIn)) {
        steps.push({ considering: edge, mst: [...mst], accepted: false });
        if (!best || edge.w < best.w) best = edge;
      }
    }

    if (!best) break;
    mst.push(best);
    inMST.add(best.u);
    inMST.add(best.v);
    steps.push({ considering: best, mst: [...mst], accepted: true });
  }

  steps.push({ considering: null, mst: [...mst], done: true });
  return steps;
}