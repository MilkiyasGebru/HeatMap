import { useMemo } from 'react';
import BaseMap from '../components/BaseMap';
import HeatmapLayer from '../components/HeatmapLayer';
import SidePanel from '../components/SidePanel';
import { pressureLocations } from '../data/pressurePoints';
import type { HeatmapDataPoint } from '../types/heatmap';
const GRADIENT: Record<number, string> = {
  0.0: '#eff3ff',
  0.2: '#6baed6',
  0.4: '#fed976',
  0.6: '#fd8d3c',
  0.8: '#e31a1c',
  1.0: '#800026',
};

function computeData() {
  const maxP = Math.max(...pressureLocations.map((l) => l.p500));
  const minP = Math.min(...pressureLocations.map((l) => l.p500));
  const points: HeatmapDataPoint[] = pressureLocations.map((loc) => ({
    lat: loc.lat,
    long: loc.long,
    intensity: maxP > 0 ? (loc.p500 / maxP) * 100 : 0,
  }));
  return { points, maxP, minP };
}

export default function PressurePage() {
  const { points, maxP, minP } = useMemo(computeData, []);

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
        title="Wind Pressure (1/500)"
        subtitle="Hourly wind pressure, 1-in-500-year return"
        gradient={GRADIENT}
        minVal={minP}
        maxVal={maxP}
        unit="kPa"
        scaleLabel="Pressure Scale"
        description="Hourly wind pressure for a 1-in-500-year return period per NBC 2025 climatic data. Used for structural design of cladding and components exposed to wind loads."
        locationCount={pressureLocations.length}
      >
        <div className="panel-card formula-card">
          <h3>Return Period</h3>
          <div className="formula-text">
            1/500 &mdash; the wind pressure expected to be exceeded on average
            once every 500 years (0.2% annual probability).
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
