import { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import StatsBar from "./components/StatsBar";
import { buildAllEdges } from "./utils/geometry";
import { kruskalSteps } from "./algorithms/kruskal";
import { primSteps } from "./algorithms/prim";

const FLOOR_NODES = [
  { label: "Router",  xp: 0.08, yp: 0.50 },
  { label: "301",     xp: 0.22, yp: 0.25 },
  { label: "302",     xp: 0.22, yp: 0.75 },
  { label: "303",     xp: 0.36, yp: 0.25 },
  { label: "304",     xp: 0.36, yp: 0.75 },
  { label: "L-305",   xp: 0.50, yp: 0.25 },
  { label: "306",     xp: 0.50, yp: 0.75 },
  { label: "307",     xp: 0.64, yp: 0.25 },
  { label: "308",     xp: 0.64, yp: 0.75 },
  { label: "L-309",   xp: 0.80, yp: 0.25 },
  { label: "310",     xp: 0.80, yp: 0.75 },
  { label: "Staff",   xp: 0.95, yp: 0.50 },
];

const CANVAS_W = 900;
const CANVAS_H = 340;

function getNodes() {
  return FLOOR_NODES.map((n) => ({
    label: n.label,
    x: Math.round(n.xp * CANVAS_W),
    y: Math.round(n.yp * CANVAS_H),
  }));
}

const TC = {
  kruskal: "Kruskal's: O(E log E)",
  prim: "Prim's: O(E log V)",
};

export default function App() {
  const nodes = getNodes();
  const allEdges = buildAllEdges(nodes);

  const [mstEdges, setMstEdges] = useState([]);
  const [considering, setConsidering] = useState(null);
  const [algo, setAlgo] = useState("kruskal");
  const [speed, setSpeed] = useState(5);
  const [running, setRunning] = useState(false);
  const [info, setInfo] = useState("Press Find MST to start.");
  const runningRef = useRef(false);

  function reset() {
    setMstEdges([]);
    setConsidering(null);
    setInfo("Press Find MST to start.");
  }

  async function runMST() {
    if (running) return;
    setRunning(true);
    runningRef.current = true;
    setMstEdges([]);
    setConsidering(null);

    const steps =
      algo === "kruskal"
        ? kruskalSteps(nodes, allEdges)
        : primSteps(nodes, allEdges);

    const delay = Math.max(80, 600 - speed * 50);

    setInfo(
      algo === "kruskal"
        ? "Kruskal's: sorting edges by weight, adding shortest that doesn't form a cycle."
        : "Prim's: growing the MST outward from the Router.",
    );

    for (const step of steps) {
      if (!runningRef.current) break;
      setConsidering(step.considering);
      setMstEdges(step.mst);
      await new Promise((r) => setTimeout(r, delay));
    }

    setConsidering(null);
    setRunning(false);
    runningRef.current = false;
    setInfo(
      `Done! Green edges = optimal cable layout. Total edges in MST: ${nodes.length - 1}`,
    );
  }

  return (
    <div
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "24px 20px",
        fontFamily: "sans-serif",
      }}
    >
 
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 2 }}>
        Wi-Fi Cable Layout - Chandigarh University, Block B1, Floor 3
      </h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 0 }}>
        Minimum Spanning Tree finds the optimal cable routing to connect all
        rooms with least wire.
      </p>

      
      <div
        style={{
          background: "#F0F7FF",
          border: "1px solid #C5DCF5",
          borderRadius: 10,
          padding: "14px 18px",
          margin: "16px 0 8px 0",
          fontSize: 13,
          color: "#1a1a1a",
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 14 }}>
          📋 Problem Statement
        </div>
        <div>
          Given <strong>N rooms</strong> on a college floor connected to a
          central <strong>Wi-Fi router</strong>, find the{" "}
          <strong>minimum total cable length</strong> required to connect every
          room to the network - without any redundant (looping) connections.
        </div>
        <div style={{ marginTop: 8, color: "#444" }}>
          <strong>Graph model:</strong> Each room is a <em>node</em>. A cable
          between two rooms is an <em>edge</em>
          weighted by the physical distance between them. The solution is the{" "}
          <strong>Minimum Spanning Tree (MST)</strong>
          of this graph - computed using Kruskal's or Prim's algorithm.
        </div>
        <div style={{ marginTop: 8, color: "#555" }}>
          <strong>Real-world impact:</strong> For a 12-room floor, MST reduces
          cable usage compared to naively connecting every room directly to the
          router - saving cost and avoiding clutter.
        </div>
      </div>

      <Controls
        algo={algo}
        setAlgo={setAlgo}
        onRun={runMST}
        onReset={reset}
        speed={speed}
        setSpeed={setSpeed}
        running={running}
      />

      {/* complexity badge */}
      <div
        style={{
          display: "inline-block",
          fontSize: 12,
          color: "#185FA5",
          background: "#E6F1FB",
          borderRadius: 6,
          padding: "4px 10px",
          marginBottom: 10,
          fontFamily: "monospace",
        }}
      >
        Time complexity: {TC[algo]} &nbsp;|&nbsp; Space: O(V + E)
      </div>

      <StatsBar
        nodeCount={nodes.length}
        mstEdges={mstEdges}
      />

      <Canvas
        nodes={nodes}
        allEdges={allEdges}
        mstEdges={mstEdges}
        considering={considering}
      />

      <div style={{ marginTop: 10, fontSize: 13, color: "#666" }}>{info}</div>

      {/* legend */}
      <div
        style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}
      >
        {[
          { color: "#D4537E", label: "Router (root node)" },
          { color: "#378ADD", label: "Room / node" },
          { color: "#B4B2A9", label: "All possible cables" },
          { color: "#1D9E75", label: "MST — optimal cable" },
          { color: "#EF9F27", label: "Currently considering" },
        ].map((l) => (
          <div
            key={l.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#666",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: l.color,
              }}
            />
            {l.label}
          </div>
        ))}
      </div>

      {/* footer */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 12,
          borderTop: "1px solid #eee",
          fontSize: 12,
          color: "#aaa",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>CC Semester Project - Minimum Spanning Tree</span>
      </div>
    </div>
  );
}
