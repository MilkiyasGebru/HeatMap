import { useMemo } from 'react';
import BaseMap from '../components/BaseMap';
import HeatmapLayer from '../components/HeatmapLayer';
import SidePanel from '../components/SidePanel';
import { seismicLocations } from '../data/seismicPoints';
import type { HeatmapDataPoint } from '../types/heatmap';

// Non-linear PGA scale breakpoints (matching NBC standard legend)
const PGA_BREAKS = [0, 0.01, 0.02, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1.0, 2.0, 4.0];

// Gradient matching the provided image — 12 bands from white to dark maroon
// Each stop maps to one PGA_BREAKS value, evenly spaced in normalized [0,1]
const GRADIENT: Record<number, string> = {
  [0 / 11]: '#ffffff',   // 0.00 g — white
  [1 / 11]: '#d0d0ff',   // 0.01 g — pale lavender
  [2 / 11]: '#9898ff',   // 0.02 g — light blue
  [3 / 11]: '#4040ff',   // 0.05 g — blue
  [4 / 11]: '#00c8c8',   // 0.10 g — cyan
  [5 / 11]: '#00c800',   // 0.20 g — green
  [6 / 11]: '#ffff00',   // 0.40 g — yellow
  [7 / 11]: '#ffc800',   // 0.60 g — amber
  [8 / 11]: '#ff6400',   // 0.80 g — orange
  [9 / 11]: '#ff0000',   // 1.00 g — red
  [10 / 11]: '#880000',  // 2.00 g — dark red
  [11 / 11]: '#320000',  // 4.00 g — dark maroon
};

/** Map a PGA value to 0–1 using the non-linear scale */
function pgaToNormalized(pga: number): number {
  if (pga <= 0) return 0;
  if (pga >= PGA_BREAKS[PGA_BREAKS.length - 1]) return 1;

  for (let i = 0; i < PGA_BREAKS.length - 1; i++) {
    if (pga <= PGA_BREAKS[i + 1]) {
      const lo = PGA_BREAKS[i];
      const hi = PGA_BREAKS[i + 1];
      const t = (pga - lo) / (hi - lo);
      return (i + t) / (PGA_BREAKS.length - 1);
    }
  }
  return 1;
}

function computeData() {
  const maxPga = Math.max(...seismicLocations.map((l) => l.pga));
  const minPga = Math.min(...seismicLocations.map((l) => l.pga));

  const points: HeatmapDataPoint[] = seismicLocations.map((loc) => ({
    lat: loc.lat,
    long: loc.long,
    intensity: pgaToNormalized(loc.pga) * 100,
  }));

  return { points, maxPga, minPga };
}

// Legend tick labels matching the non-linear scale
const LEGEND_TICKS = [0, 0.05, 0.1, 0.2, 0.4, 0.8, 2.0, 4.0];

export default function PGAPage() {
  const { points, maxPga, minPga } = useMemo(() => computeData(), []);

  return (
    <div className="page-layout">
      <div className="map-section">
        <BaseMap>
          <HeatmapLayer
            points={points}
            gradient={GRADIENT}
            opacity={0.7}
            power={2.5}
            resolution={2}
          />
        </BaseMap>
      </div>
      <SidePanel
        badge="NBC 2025"
        title="Peak Ground Acceleration"
        subtitle="PGA for Site Class XD"
        gradient={GRADIENT}
        minVal={minPga}
        maxVal={maxPga}
        unit="g"
        scaleLabel="PGA Scale (non-linear)"
        description="Peak Ground Acceleration (PGA) represents the maximum horizontal acceleration at a site during an earthquake. Values shown are for Site Class XD per NBC 2025 seismic hazard data."
        locationCount={seismicLocations.length}
      >
        <div className="panel-card formula-card">
          <h3>What is PGA?</h3>
          <div className="formula-text">
            Peak ground acceleration — the strongest shaking expected at a
            location, expressed as a fraction of gravity (g).
          </div>
        </div>

        <div className="panel-card">
          <h3>Scale Breakpoints</h3>
          <div className="pga-ticks">
            {LEGEND_TICKS.map((v) => (
              <span key={v} className="pga-tick">
                {v.toFixed(2)} g
              </span>
            ))}
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
