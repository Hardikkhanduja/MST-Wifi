export default function StatsBar({ nodeCount, mstEdges }) {
  const mstTotal = mstEdges.reduce((s, e) => s + e.w, 0);

  const card = { background: '#f5f5f5', borderRadius: 8, padding: '10px 16px', minWidth: 120 };
  const label = { fontSize: 11, color: '#888', marginBottom: 3 };
  const value = { fontSize: 20, fontWeight: 500 };

  return (
    <div style={{ display: 'flex', gap: 12, margin: '12px 0', flexWrap: 'wrap' }}>
      <div style={card}>
        <div style={label}>Rooms</div>
        <div style={value}>{nodeCount}</div>
      </div>
      <div style={card}>
        <div style={label}>Cable used (MST)</div>
        <div style={value}>{mstEdges.length ? mstTotal + 'm' : '—'}</div>
      </div>
      <div style={card}>
        <div style={label}>MST Edges</div>
        <div style={value}>{mstEdges.length ? mstEdges.length : '—'}</div>
      </div>
    </div>
  );
}