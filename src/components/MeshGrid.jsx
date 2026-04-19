// src/components/MeshGrid.jsx
import { useEffect, useRef } from "react";

const STAGE_LABELS = {
  idle:     { label: "INITIAL STATE",       color: "#64ffda" },
  row:      { label: "STAGE 1 — ROW SHIFT", color: "#ffb347" },
  col:      { label: "STAGE 2 — COL SHIFT", color: "#a78bfa" },
  done:     { label: "FINAL STATE",         color: "#4ade80" },
};

function getNodeColor(value, p, stage) {
  const ratio = value / (p - 1);
  if (stage === "row")  return `hsl(${30 + ratio * 40}, 90%, ${45 + ratio * 20}%)`;
  if (stage === "col")  return `hsl(${260 + ratio * 40}, 80%, ${50 + ratio * 15}%)`;
  if (stage === "done") return `hsl(${140 + ratio * 30}, 75%, ${40 + ratio * 20}%)`;
  return `hsl(${200 + ratio * 30}, 70%, ${40 + ratio * 20}%)`;
}

export default function MeshGrid({ data, p, stage, arrows, rowShift, colShift, animStep }) {
  const sqrtP = Math.sqrt(p);
  const stageInfo = STAGE_LABELS[stage] || STAGE_LABELS.idle;

  // Determine which nodes are "moving" in this animation step
  const movingNodes = new Set();
  if (arrows && animStep >= 0) {
    arrows.slice(0, (animStep + 1) * sqrtP).forEach(a => {
      movingNodes.add(a.from);
      movingNodes.add(a.to);
    });
  }

  const cellSize = Math.min(68, Math.floor(520 / sqrtP));
  const fontSize = cellSize > 50 ? 15 : cellSize > 36 ? 12 : 10;

  return (
    <div className="mesh-wrapper">
      {/* Stage indicator */}
      <div className="stage-badge" style={{ borderColor: stageInfo.color, color: stageInfo.color }}>
        {stageInfo.label}
        {(stage === "row" || stage === "col") && (
          <span className="shift-amount">
            &nbsp;{stage === "row" ? `+${rowShift} col` : `+${colShift} row`}
          </span>
        )}
      </div>

      {/* Grid */}
      <div
        className="mesh-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${sqrtP}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${sqrtP}, ${cellSize}px)`,
          gap: "6px",
        }}
      >
        {data.map((val, idx) => {
          const row = Math.floor(idx / sqrtP);
          const col = idx % sqrtP;
          const isMoving = movingNodes.has(idx);
          const bg = getNodeColor(val, p, stage);

          // Find arrow for this node
          const arrow = arrows?.find(a => a.from === idx);
          let arrowSymbol = null;
          if (arrow) {
            if (arrow.direction === "row") arrowSymbol = rowShift > 0 ? "→" : null;
            if (arrow.direction === "col") arrowSymbol = colShift > 0 ? "↓" : null;
          }

          return (
            <div
              key={idx}
              className={`mesh-node ${isMoving ? "node-moving" : ""} ${stage === "done" ? "node-done" : ""}`}
              style={{
                width: cellSize,
                height: cellSize,
                background: bg,
                fontSize,
                animationDelay: `${(row + col) * 0.04}s`,
              }}
              title={`Node ${idx} | Value: ${val} | (r${row},c${col})`}
            >
              <span className="node-value">{val}</span>
              {arrowSymbol && stage !== "idle" && stage !== "done" && (
                <span className="node-arrow">{arrowSymbol}</span>
              )}
              <span className="node-index">({idx})</span>
            </div>
          );
        })}
      </div>

      {/* Row-major flat view */}
      <div className="flat-view">
        <span className="flat-label">row-major:</span>
        <span className="flat-data">[{data.join(", ")}]</span>
      </div>
    </div>
  );
}
