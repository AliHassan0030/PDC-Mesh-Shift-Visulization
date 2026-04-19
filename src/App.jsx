// src/App.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import ControlPanel from "./components/ControlPanel";
import MeshGrid from "./components/MeshGrid";
import ComplexityPanel from "./components/ComplexityPanel";
import {
  computeFullShift,
  computeComplexity,
  getRowShiftArrows,
  getColShiftArrows,
} from "./utils/shiftLogic";
import "./App.css";

const ANIM_DELAY = 900; // ms per animation step

export default function App() {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(6);
  const [shiftData, setShiftData] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [stage, setStage] = useState("idle");   // idle | row | col | done
  const [currentData, setCurrentData] = useState(null);
  const [arrows, setArrows] = useState([]);
  const [animStep, setAnimStep] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  // Initialize on mount
  useEffect(() => { runShift(16, 6); }, []);

  function runShift(newP, newQ) {
    clearTimeout(timerRef.current);
    const sd = computeFullShift(newP, newQ);
    const cx = computeComplexity(newP, newQ);
    setP(newP); setQ(newQ);
    setShiftData(sd);
    setComplexity(cx);
    setCurrentData(sd.initial);
    setStage("idle");
    setArrows([]);
    setAnimStep(-1);
    setIsAnimating(false);

    // Auto-start animation after short delay
    setTimeout(() => startAnimation(sd, cx, newP, newQ), 600);
  }

  function startAnimation(sd, cx, pv, qv) {
    const sqrtP = Math.sqrt(pv);
    const rowArrows = getRowShiftArrows(pv, sqrtP, sd.rowShift);
    const colArrows = getColShiftArrows(pv, sqrtP, sd.colShift);

    setIsAnimating(true);

    // Stage 1: Row shift
    setStage("row");
    setCurrentData(sd.initial);
    setArrows(rowArrows);
    setAnimStep(0);

    timerRef.current = setTimeout(() => {
      // After row shift — show afterRow state
      setCurrentData(sd.afterRow);
      setAnimStep(sqrtP);

      timerRef.current = setTimeout(() => {
        // Stage 2: Col shift
        setStage("col");
        setArrows(colArrows);
        setAnimStep(0);

        timerRef.current = setTimeout(() => {
          setCurrentData(sd.afterCol);
          setAnimStep(sqrtP);

          timerRef.current = setTimeout(() => {
            // Done
            setStage("done");
            setArrows([]);
            setAnimStep(-1);
            setIsAnimating(false);
          }, ANIM_DELAY);
        }, ANIM_DELAY * 1.5);
      }, ANIM_DELAY);
    }, ANIM_DELAY * 1.5);
  }

  // Three-panel before/mid/after display
  const panels = shiftData ? [
    { label: "BEFORE",        data: shiftData.initial,  stg: "idle" },
    { label: "AFTER STAGE 1", data: shiftData.afterRow, stg: "row"  },
    { label: "AFTER STAGE 2", data: shiftData.afterCol, stg: "done" },
  ] : [];

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-tag">PARALLEL COMPUTING</div>
          <h1 className="header-title">
            Mesh Circular Shift
            <span className="header-accent"> Visualizer</span>
          </h1>
          <p className="header-sub">
            2D Mesh topology · Two-stage circular q-shift · Real-time complexity analysis
          </p>
        </div>
        <div className="header-deco">
          <div className="deco-grid">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="deco-cell" style={{ animationDelay: `${i * 0.08}s` }} />
            ))}
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Left column: controls + complexity */}
        <aside className="sidebar">
          <ControlPanel onRun={runShift} isAnimating={isAnimating} />
          {complexity && (
            <ComplexityPanel
              p={p} q={q}
              rowShift={complexity.rowShift}
              colShift={complexity.colShift}
              meshSteps={complexity.meshSteps}
              ringSteps={complexity.ringSteps}
            />
          )}
        </aside>

        {/* Right column: animated grid + before/after */}
        <section className="viz-section">
          {/* Live animation */}
          <div className="live-grid-wrapper">
            <div className="live-label">
              <span className="live-dot" />
              LIVE ANIMATION
            </div>
            {currentData && (
              <MeshGrid
                data={currentData}
                p={p}
                stage={stage}
                arrows={arrows}
                rowShift={shiftData?.rowShift}
                colShift={shiftData?.colShift}
                animStep={animStep}
              />
            )}
          </div>

          {/* Before / Stage1 / Final static panels */}
          {shiftData && (
            <div className="state-panels">
              <div className="state-panels-title">STATE PROGRESSION</div>
              <div className="state-panels-row">
                {panels.map(({ label, data, stg }) => (
                  <div key={label} className="state-panel">
                    <div className="state-panel-label">{label}</div>
                    <MeshGrid
                      data={data}
                      p={p}
                      stage={stg}
                      arrows={[]}
                      rowShift={shiftData.rowShift}
                      colShift={shiftData.colShift}
                      animStep={-1}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Algorithm info */}
          <div className="algo-box">
            <div className="algo-title">TWO-STAGE ALGORITHM</div>
            <div className="algo-steps">
              <div className="algo-step">
                <span className="algo-num">1</span>
                <div>
                  <strong>Row Shift</strong>
                  <span> — each node shifts within its row by </span>
                  <code>q mod √p</code>
                  {shiftData && <span className="algo-computed"> = {shiftData.rowShift} positions →</span>}
                </div>
              </div>
              <div className="algo-step">
                <span className="algo-num">2</span>
                <div>
                  <strong>Column Shift</strong>
                  <span> — each node shifts within its column by </span>
                  <code>⌊q / √p⌋</code>
                  {shiftData && <span className="algo-computed"> = {shiftData.colShift} positions ↓</span>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        Parallel &amp; Distributed Computing · Spring 2026 · FAST-CFD
      </footer>
    </div>
  );
}
