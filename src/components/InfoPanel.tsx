interface InfoPanelProps {
  ie: number;
  wp: number;
  onIeChange: (v: number) => void;
  onWpChange: (v: number) => void;
  gradient: Record<number, string>;
  maxVsp: number;
  minVsp: number;
  locationCount: number;
}

export default function InfoPanel({
  ie,
  wp,
  onIeChange,
  onWpChange,
  gradient,
  maxVsp,
  minVsp,
  locationCount,
}: InfoPanelProps) {
  const stops = Object.entries(gradient)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([stop, color]) => `${color} ${Number(stop) * 100}%`)
    .join(', ');

  return (
    <aside className="info-panel">
      <div className="panel-header">
        <span className="panel-badge">NBC 2025</span>
        <h1>Seismic Hazard Map</h1>
        <p className="panel-subtitle">
          Lateral force on non-structural components
        </p>
      </div>

      <div className="panel-card formula-card">
        <h3>Lateral Force Formula</h3>
        <div className="formula">
          V<sub>sp</sub> = 0.9 &times; S<sub>a</sub>(0.2) &times; I
          <sub>e</sub> &times; W<sub>p</sub>
        </div>
      </div>

      <div className="panel-card">
        <h3>Parameters</h3>

        <div className="param-group">
          <label htmlFor="ie-select">
            <span className="param-name">
              I<sub>e</sub>
            </span>
            <span className="param-desc">Importance Factor</span>
          </label>
          <select
            id="ie-select"
            value={ie}
            onChange={(e) => onIeChange(Number(e.target.value))}
          >
            <option value={1.0}>1.0 &mdash; Normal</option>
            <option value={1.3}>1.3 &mdash; High Importance</option>
            <option value={1.5}>1.5 &mdash; Post-Disaster</option>
          </select>
        </div>

        <div className="param-group">
          <label htmlFor="wp-input">
            <span className="param-name">
              W<sub>p</sub>
            </span>
            <span className="param-desc">Component Weight</span>
          </label>
          <div className="input-with-unit">
            <input
              id="wp-input"
              type="number"
              value={wp}
              min={0.1}
              step={0.1}
              onChange={(e) => onWpChange(Math.max(0.1, Number(e.target.value)))}
            />
            <span className="unit">kN</span>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <h3>
          V<sub>sp</sub> Scale (kN)
        </h3>
        <div
          className="legend-bar"
          style={{ background: `linear-gradient(to right, ${stops})` }}
        />
        <div className="legend-labels">
          <span>{minVsp.toFixed(2)}</span>
          <span>{(maxVsp / 2).toFixed(2)}</span>
          <span>{maxVsp.toFixed(2)}</span>
        </div>
      </div>

      <div className="panel-card panel-info">
        <p>
          Seismic design forces for non-structural components per the National
          Building Code of Canada 2025. S<sub>a</sub>(0.2) values represent
          spectral acceleration at 0.2s period for Site Class XD.
        </p>
        <p className="data-source">
          {locationCount} locations &middot; NBC 2025 Climatic Data
        </p>
      </div>
    </aside>
  );
}
