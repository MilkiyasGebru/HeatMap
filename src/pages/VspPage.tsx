import { useState, useMemo } from 'react';
import BaseMap from '../components/BaseMap';
import HeatmapLayer from '../components/HeatmapLayer';
import SidePanel from '../components/SidePanel';
import { seismicLocations } from '../data/seismicPoints';
import calculateVsp from '../utils/calculateVsp';
import type { HeatmapDataPoint } from '../types/heatmap';
const GRADIENT: Record<number, string> = {
  0.0: '#eff3ff',
  0.2: '#6baed6',
  0.4: '#fed976',
  0.6: '#fd8d3c',
  0.8: '#e31a1c',
  1.0: '#800026',
};

function computeData(ie: number, wp: number) {
  const values = seismicLocations.map((loc) => ({
    lat: loc.lat,
    long: loc.long,
    vsp: calculateVsp(loc.sa02, ie, wp),
  }));
  const maxVsp = Math.max(...values.map((v) => v.vsp));
  const minVsp = Math.min(...values.map((v) => v.vsp));
  const points: HeatmapDataPoint[] = values.map((v) => ({
    lat: v.lat,
    long: v.long,
    intensity: maxVsp > 0 ? (v.vsp / maxVsp) * 100 : 0,
  }));
  return { points, maxVsp, minVsp };
}

export default function VspPage() {
  const [ie, setIe] = useState(1.0);
  const [wp, setWp] = useState(1.0);
  const { points, maxVsp, minVsp } = useMemo(
    () => computeData(ie, wp),
    [ie, wp],
  );

  return (
    <div className="page-layout">
      <div className="map-section">
        <BaseMap>
          <HeatmapLayer
            points={points}
            gradient={GRADIENT}
            opacity={0.6}
            power={2.5}
            resolution={4}
          />
        </BaseMap>
      </div>
      <SidePanel
        badge="NBC 2025"
        title="Seismic Lateral Force"
        subtitle="Vsp for non-structural components"
        gradient={GRADIENT}
        minVal={minVsp}
        maxVal={maxVsp}
        unit="kN"
        scaleLabel="Vsp Scale"
        description={`Lateral earthquake force (Vsp) calculated as 0.9 × Sa(0.2) × Ie × Wp per NBC 2025. Sa(0.2) is the spectral acceleration at 0.2s for Site Class XD.`}
        locationCount={seismicLocations.length}
      >
        <div className="panel-card formula-card">
          <h3>Formula</h3>
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
              onChange={(e) => setIe(Number(e.target.value))}
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
                onChange={(e) => setWp(Math.max(0.1, Number(e.target.value)))}
              />
              <span className="unit">kN</span>
            </div>
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
