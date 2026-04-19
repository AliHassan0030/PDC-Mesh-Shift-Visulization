// src/components/ControlPanel.jsx
import { useState } from "react";
import { validateInputs } from "../utils/shiftLogic";

const VALID_P = [4, 9, 16, 25, 36, 49, 64];

export default function ControlPanel({ onRun, isAnimating }) {
  const [pVal, setPVal] = useState(16);
  const [qVal, setQVal] = useState(6);
  const [error, setError] = useState(null);

  function handleRun() {
    const p = parseInt(pVal);
    const q = parseInt(qVal);
    const { valid, error: err } = validateInputs(p, q);
    if (!valid) { setError(err); return; }
    setError(null);
    onRun(p, q);
  }

  function handleReset() {
    setPVal(16);
    setQVal(6);
    setError(null);
    onRun(16, 6);
  }

  return (
    <div className="control-panel">
      <div className="panel-header">
        <span className="panel-label">PARAMETERS</span>
      </div>

      <div className="control-row">
        <div className="control-group">
          <label htmlFor="p-select">Nodes (p)</label>
          <select
            id="p-select"
            value={pVal}
            onChange={e => { setPVal(parseInt(e.target.value)); setError(null); }}
            disabled={isAnimating}
          >
            {VALID_P.map(v => (
              <option key={v} value={v}>{v} ({Math.sqrt(v)}×{Math.sqrt(v)})</option>
            ))}
          </select>
          <span className="hint">perfect square, 4–64</span>
        </div>

        <div className="control-group">
          <label htmlFor="q-input">Shift (q)</label>
          <input
            id="q-input"
            type="number"
            min={1}
            max={pVal - 1}
            value={qVal}
            onChange={e => { setQVal(parseInt(e.target.value)); setError(null); }}
            disabled={isAnimating}
          />
          <span className="hint">1 to {pVal - 1}</span>
        </div>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div className="btn-row">
        <button
          className="btn-run"
          onClick={handleRun}
          disabled={isAnimating}
        >
          {isAnimating ? "ANIMATING…" : "▶ RUN SHIFT"}
        </button>
        <button
          className="btn-reset"
          onClick={handleReset}
          disabled={isAnimating}
        >
          ↺ RESET
        </button>
      </div>
    </div>
  );
}
