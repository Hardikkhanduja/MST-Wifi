export function makeUnionFind(n) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array(n).fill(0);
  return { parent, rank };
}

export function find(uf, x) {
  if (uf.parent[x] !== x) uf.parent[x] = find(uf, uf.parent[x]);
  return uf.parent[x];
}

export function union(uf, a, b) {
  const ra = find(uf, a), rb = find(uf, b);
  if (ra === rb) return false;
  if (uf.rank[ra] < uf.rank[rb]) uf.parent[ra] = rb;
  else if (uf.rank[ra] > uf.rank[rb]) uf.parent[rb] = ra;
  else { uf.parent[rb] = ra; uf.rank[ra]++; }
  return true;
}