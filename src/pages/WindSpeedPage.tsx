import { useCallback, useMemo, useState } from 'react';
import BaseMap from '../components/BaseMap';
import DualRangeSlider from '../components/DualRangeSlider';
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

// Each return period (1/10, 1/50, 1/500) has its own independent gradient
// scale, adjustable by the user via the double-range slider in the side
// panel. This keeps colours consistent across datasets for a given return
// period while letting each period be tuned separately.
const DEFAULT_SCALE_MIN = 20;
const DEFAULT_SCALE_MAX = 25;

// Bounds the slider allows for each return period, chosen from the observed
// min/max hourly wind speed across all datasets for that period.
const SLIDER_BOUNDS: Record<ReturnPeriod, [number, number]> = {
  10: [10, 50],
  50: [10, 60],
  500: [10, 75],
};

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

function computeData(
  dataset: DatasetKey,
  period: ReturnPeriod,
  scaleMin: number,
  scaleMax: number,
) {
  const locations = DATASETS[dataset].locations.filter(
    (loc) => getValue(loc, period) !== undefined,
  );
  const scaleRange = scaleMax - scaleMin || 1;
  const points: HeatmapDataPoint[] = locations.map((loc) => {
    const value = getValue(loc, period) as number;
    const clamped = Math.max(scaleMin, Math.min(scaleMax, value));
    return {
      lat: loc.lat,
      long: loc.long,
      intensity: ((clamped - scaleMin) / scaleRange) * 100,
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
  const [scaleRanges, setScaleRanges] = useState<
    Record<ReturnPeriod, [number, number]>
  >({
    10: [DEFAULT_SCALE_MIN, DEFAULT_SCALE_MAX],
    50: [DEFAULT_SCALE_MIN, DEFAULT_SCALE_MAX],
    500: [DEFAULT_SCALE_MIN, DEFAULT_SCALE_MAX],
  });

  const [scaleMin, scaleMax] = scaleRanges[period];

  const handleScaleChange = useCallback(
    (next: [number, number]) => {
      setScaleRanges((prev) => ({ ...prev, [period]: next }));
    },
    [period],
  );

  const { points, minVal, maxVal, locationCount } = useMemo(
    () => computeData(dataset, period, scaleMin, scaleMax),
    [dataset, period, scaleMin, scaleMax],
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
        minVal={scaleMin}
        maxVal={scaleMax}
        unit="m/s"
        scaleLabel={`Wind Speed Scale — 1/${period} year (fixed across datasets)`}
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

        <div className="panel-card">
          <h3>Gradient Range — 1/{period} year</h3>
          <div className="param-desc" style={{ marginBottom: 4 }}>
            Sets the min/max wind speed mapped to the colour scale for this
            return period. Applies to every dataset shown at 1/{period}.
          </div>
          <DualRangeSlider
            min={SLIDER_BOUNDS[period][0]}
            max={SLIDER_BOUNDS[period][1]}
            step={0.5}
            value={scaleRanges[period]}
            onChange={handleScaleChange}
            formatValue={(v) => `${v.toFixed(1)} m/s`}
          />
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
