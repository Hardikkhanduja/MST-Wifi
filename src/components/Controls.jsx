export default function Controls({ algo, setAlgo, onRun, onReset, speed, setSpeed, running }) {
  const btn = {
    padding: '7px 16px', borderRadius: 8, border: '1px solid #ccc',
    background: '#fff', cursor: 'pointer', fontSize: 13
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', margin: '12px 0' }}>
      <select
        value={algo}
        onChange={e => setAlgo(e.target.value)}
        style={{ ...btn, paddingRight: 24 }}
        disabled={running}
      >
        <option value="kruskal">Kruskal's algorithm</option>
        <option value="prim">Prim's algorithm</option>
      </select>

      <button style={{ ...btn, background: '#378ADD', color: '#fff', border: 'none' }}
        onClick={onRun} disabled={running}>
        {running ? 'Running...' : 'Find MST'}
      </button>

      <button style={btn} onClick={onReset} disabled={running}>
        Reset
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <span style={{ fontSize: 13, color: '#888' }}>Speed</span>
        <input type="range" min={1} max={10} step={1} value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          style={{ width: 90 }} />
        <span style={{ fontSize: 13, minWidth: 16 }}>{speed}</span>
      </div>
    </div>
  );
}