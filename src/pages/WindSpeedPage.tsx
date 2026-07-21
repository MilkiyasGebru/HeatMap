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
type ReturnPeriod = 10 | 50 | 500;

const RETURN_PERIODS: ReturnPeriod[] = [10, 50, 500];

const DATASETS: Record<
  DatasetKey,
  { label: string; description: string; locations: WindLocation[]; hasY500: boolean }
> = {
  NBC2025: {
    label: 'NBC2025',
    description: 'Hourly wind speed per NBC 2025 climatic data.',
    locations: nbc2025WindLocations,
    hasY500: true,
  },
  NBC2020: {
    label: 'NBC2020',
    description: 'Hourly wind speed per NBC 2020 climatic data.',
    locations: nbc2020WindLocations,
    hasY500: false,
  },
  AllIncludingThunderstorm: {
    label: 'AllIncludingThunderstorm',
    description: 'Our analysis of hourly wind speed including thunderstorm events.',
    locations: allThunderstormWindLocations,
    hasY500: true,
  },
  NonThunderstorm: {
    label: 'NonThunderstorm',
    description: 'Our analysis of hourly wind speed excluding thunderstorm events.',
    locations: nonThunderstormWindLocations,
    hasY500: true,
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
function getValue(loc: WindLocation, period: ReturnPeriod): number | undefined {
  if (period === 10) return loc.y10;
  if (period === 50) return loc.y50;
  return loc.y500;
}

function computeData(dataset: DatasetKey, period: ReturnPeriod) {
  const locations = DATASETS[dataset].locations.filter(
    (loc) => getValue(loc, period) !== undefined,
  );
  const points: HeatmapDataPoint[] = locations.map((loc) => {
    const value = getValue(loc, period) as number;
    const clamped = Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
    return {
      lat: loc.lat,
      long: loc.long,
      intensity: ((clamped - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100,
    };
  });
  const values = locations.map((loc) => getValue(loc, period) as number);
  return {
    points,
    minVal: values.length ? Math.min(...values) : 0,
    maxVal: values.length ? Math.max(...values) : 0,
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
              onChange={(e) => {
                const nextDataset = e.target.value as DatasetKey;
                if (period === 500 && !DATASETS[nextDataset].hasY500) {
                  setPeriod(10);
                }
                setDataset(nextDataset);
              }}
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
              {RETURN_PERIODS.filter(
                (p) => p !== 500 || DATASETS[dataset].hasY500,
              ).map((p) => (
                <option key={p} value={p}>
                  {p} year
                </option>
              ))}
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
