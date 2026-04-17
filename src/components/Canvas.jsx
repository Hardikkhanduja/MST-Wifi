import { useEffect, useRef } from 'react';

export default function Canvas({ nodes, allEdges, mstEdges, considering }) {
  const ref = useRef();

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext('2d');
    cv.width = cv.offsetWidth;
    cv.height = cv.offsetHeight;
    const w = cv.width, h = cv.height;

    ctx.clearRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // all edges faint
    allEdges.forEach(e => {
      ctx.strokeStyle = 'rgba(180,178,169,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
      ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
      ctx.stroke();
    });

    // considering edge
    if (considering) {
      ctx.strokeStyle = '#EF9F27';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(nodes[considering.u].x, nodes[considering.u].y);
      ctx.lineTo(nodes[considering.v].x, nodes[considering.v].y);
      ctx.stroke();
      ctx.setLineDash([]);
      const mx = (nodes[considering.u].x + nodes[considering.v].x) / 2;
      const my = (nodes[considering.u].y + nodes[considering.v].y) / 2;
      ctx.fillStyle = '#854F0B';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(considering.w + 'm', mx, my - 6);
    }

    // MST edges
    mstEdges.forEach(e => {
      ctx.strokeStyle = '#1D9E75';
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(nodes[e.u].x, nodes[e.u].y);
      ctx.lineTo(nodes[e.v].x, nodes[e.v].y);
      ctx.stroke();
      const mx = (nodes[e.u].x + nodes[e.v].x) / 2;
      const my = (nodes[e.u].y + nodes[e.v].y) / 2;
      ctx.fillStyle = '#085041';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(e.w + 'm', mx, my - 6);
    });

    // nodes
    nodes.forEach((n, i) => {
      const isRouter = i === 0;
      const r = isRouter ? 18 : 16;
      ctx.fillStyle = isRouter ? '#D4537E' : '#378ADD';
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '500 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x, n.y);
      ctx.textBaseline = 'alphabetic';
    });

  }, [nodes, allEdges, mstEdges, considering]);

  return (
    <canvas
      ref={ref}
      style={{
        width: '100%', height: 340,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        display: 'block'
      }}
    />
  );
}