// src/components/ComplexityPanel.jsx

export default function ComplexityPanel({ p, q, rowShift, colShift, meshSteps, ringSteps }) {
  const sqrtP = Math.sqrt(p);
  const maxBar = Math.max(meshSteps, ringSteps, 1);
  const meshPct = (meshSteps / maxBar) * 100;
  const ringPct = (ringSteps / maxBar) * 100;
  const saving = ringSteps > 0 ? (((ringSteps - meshSteps) / ringSteps) * 100).toFixed(0) : 0;

  // Build table for various q values
  const qSamples = [1, Math.floor(p/4), Math.floor(p/2), Math.floor(3*p/4), p-1].filter(
    (v, i, a) => v >= 1 && v <= p-1 && a.indexOf(v) === i
  );

  return (
    <div className="complexity-panel">
      <div className="panel-header">
        <span className="panel-label">COMPLEXITY ANALYSIS</span>
      </div>

      {/* Current values */}
      <div className="complexity-current">
        <div className="cx-item">
          <span className="cx-key">Row Shift</span>
          <span className="cx-val">{rowShift}</span>
          <span className="cx-formula">q mod √p = {q} mod {sqrtP}</span>
        </div>
        <div className="cx-item">
          <span className="cx-key">Col Shift</span>
          <span className="cx-val">{colShift}</span>
          <span className="cx-formula">⌊q / √p⌋ = ⌊{q}/{sqrtP}⌋</span>
        </div>
        <div className="cx-item highlight">
          <span className="cx-key">Mesh Steps</span>
          <span className="cx-val mesh-color">{meshSteps}</span>
          <span className="cx-formula">{rowShift} + {colShift}</span>
        </div>
        <div className="cx-item">
          <span className="cx-key">Ring Steps</span>
          <span className="cx-val ring-color">{ringSteps}</span>
          <span className="cx-formula">min({q}, {p}-{q})</span>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bar-chart">
        <div className="bar-title">Steps Comparison</div>

        <div className="bar-row">
          <span className="bar-label">Mesh</span>
          <div className="bar-track">
            <div
              className="bar-fill mesh-bar"
              style={{ width: `${meshPct}%` }}
            >
              <span className="bar-num">{meshSteps}</span>
            </div>
          </div>
        </div>

        <div className="bar-row">
          <span className="bar-label">Ring</span>
          <div className="bar-track">
            <div
              className="bar-fill ring-bar"
              style={{ width: `${ringPct}%` }}
            >
              <span className="bar-num">{ringSteps}</span>
            </div>
          </div>
        </div>

        {meshSteps < ringSteps && (
          <div className="saving-badge">
            ↓ Mesh saves {saving}% steps vs Ring
          </div>
        )}
      </div>

      {/* Formula box */}
      <div className="formula-box">
        <div className="formula-row">
          <span className="formula-label">Ring:</span>
          <code>min(q, p−q) = min({q}, {p-q}) = {ringSteps}</code>
        </div>
        <div className="formula-row">
          <span className="formula-label">Mesh:</span>
          <code>(q mod √p) + ⌊q/√p⌋ = {rowShift} + {colShift} = {meshSteps}</code>
        </div>
      </div>

      {/* Table for multiple q values */}
      <div className="cx-table-wrapper">
        <div className="cx-table-title">Step Count for p={p}</div>
        <table className="cx-table">
          <thead>
            <tr>
              <th>q</th>
              <th>Row Shift</th>
              <th>Col Shift</th>
              <th>Mesh</th>
              <th>Ring</th>
            </tr>
          </thead>
          <tbody>
            {qSamples.map(qv => {
              const rs = qv % sqrtP;
              const cs = Math.floor(qv / sqrtP);
              const ms = rs + cs;
              const rg = Math.min(qv, p - qv);
              return (
                <tr key={qv} className={qv === q ? "row-active" : ""}>
                  <td>{qv}</td>
                  <td>{rs}</td>
                  <td>{cs}</td>
                  <td className="mesh-color">{ms}</td>
                  <td className="ring-color">{rg}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
