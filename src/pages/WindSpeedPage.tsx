import { useMemo, useState } from 'react';
import BaseMap from '../components/BaseMap';
import HeatmapLayer from '../components/HeatmapLayer';
import SidePanel from '../components/SidePanel';
import {
  nbc2025WindLocations,
  nbc2020WindLocations,
  allThunderstormWindLocations,
  nonThunderstormWindLocations,
} from '../data/windSpeedPoints';
import type { HeatmapDataPoint, WindLocation } from '../types/heatmap';

type DatasetKey = 'NBC2025' | 'NBC2020' | 'NonThunderstorm' | 'AllIncludingThunderstorm';
type ReturnPeriod = 10 | 50;

const DATASETS: Record<
  DatasetKey,
  { label: string; description: string; locations: WindLocation[] }
> = {
  NBC2025: {
    label: 'NBC2025',
    description: 'Hourly wind speed per NBC 2025 climatic data.',
    locations: nbc2025WindLocations,
  },
  NBC2020: {
    label: 'NBC2020',
    description: 'Hourly wind speed per NBC 2020 climatic data.',
    locations: nbc2020WindLocations,
  },
  AllIncludingThunderstorm: {
    label: 'AllIncludingThunderstorm',
    description: 'Our analysis of hourly wind speed including thunderstorm events.',
    locations: allThunderstormWindLocations,
  },
  NonThunderstorm: {
    label: 'NonThunderstorm',
    description: 'Our analysis of hourly wind speed excluding thunderstorm events.',
    locations: nonThunderstormWindLocations,
  },
};

// Fixed value scale shared by all 8 dataset/return-period combinations so
// colours and cutoffs line up when comparing maps against each other.
const SCALE_MIN = 20;
const SCALE_MAX = 25;
const GRADIENT: Record<number, string> = {
  0.0: '#0000ff', // Deep Blue
  0.2: '#00ffff', // Cyan
  0.4: '#00ff00', // Green
  0.6: '#ffff00', // Yellow
  0.8: '#ff8000', // Orange
  1.0: '#ff0000', // Red
};
function computeData(dataset: DatasetKey, period: ReturnPeriod) {
  const locations = DATASETS[dataset].locations;
  const points: HeatmapDataPoint[] = locations.map((loc) => {
    const value = period === 10 ? loc.y10 : loc.y50;
    const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
    return {
      lat: loc.lat,
      long: loc.long,
      intensity: ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100,
    };
  });
  const values = locations.map((loc) => (period === 10 ? loc.y10 : loc.y50));
  return {
    points,
    minVal: Math.min(...values),
    maxVal: Math.max(...values),
    locationCount: locations.length,
  };
}

export default function WindSpeedPage() {
  const [dataset, setDataset] = useState<DatasetKey>('NBC2025');
  const [period, setPeriod] = useState<ReturnPeriod>(10);

  const { points, minVal, maxVal, locationCount } = useMemo(
    () => computeData(dataset, period),
    [dataset, period],
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
        badge={DATASETS[dataset].label}
        title={`Wind Speed (1/${period})`}
        subtitle={`${period}-year return period hourly wind speed`}
        gradient={GRADIENT}
        minVal={SCALE_MIN}
        maxVal={SCALE_MAX}
        unit="m/s"
        scaleLabel="Wind Speed Scale (fixed across all datasets)"
        description={DATASETS[dataset].description}
        locationCount={locationCount}
      >
        <div className="panel-card">
          <h3>Dataset</h3>
          <div className="param-group">
            <label htmlFor="dataset-select">
              <span className="param-name">Source</span>
              <span className="param-desc">Wind data set</span>
            </label>
            <select
              id="dataset-select"
              value={dataset}
              onChange={(e) => setDataset(e.target.value as DatasetKey)}
            >
              {(Object.keys(DATASETS) as DatasetKey[]).map((key) => (
                <option key={key} value={key}>
                  {DATASETS[key].label}
                </option>
              ))}
            </select>
          </div>
          <div className="param-group">
            <label htmlFor="period-select">
              <span className="param-name">1/N</span>
              <span className="param-desc">Return period</span>
            </label>
            <select
              id="period-select"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value) as ReturnPeriod)}
            >
              <option value={10}>10 year</option>
              <option value={50}>50 year</option>
            </select>
          </div>
        </div>

        <div className="panel-card formula-card">
          <h3>This selection&apos;s range</h3>
          <div className="formula-text">
            {minVal.toFixed(2)} &ndash; {maxVal.toFixed(2)} m/s across{' '}
            {locationCount} locations.
          </div>
        </div>
      </SidePanel>
    </div>
  );
}
