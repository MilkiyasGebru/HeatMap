import { useCallback } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
}

export default function DualRangeSlider({
  min,
  max,
  step = 0.5,
  value,
  onChange,
  formatValue = (v) => v.toFixed(1),
}: DualRangeSliderProps) {
  const [lo, hi] = value;
  const range = max - min || 1;
  const loPct = ((lo - min) / range) * 100;
  const hiPct = ((hi - min) / range) * 100;

  const handleLoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.min(Number(e.target.value), hi - step);
      onChange([next, hi]);
    },
    [hi, step, onChange],
  );

  const handleHiChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Math.max(Number(e.target.value), lo + step);
      onChange([lo, next]);
    },
    [lo, step, onChange],
  );

  return (
    <div className="dual-range">
      <div className="dual-range-track">
        <div
          className="dual-range-fill"
          style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }}
        />
      </div>
      <input
        type="range"
        className="dual-range-thumb"
        aria-label="Minimum value"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={handleLoChange}
      />
      <input
        type="range"
        className="dual-range-thumb"
        aria-label="Maximum value"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={handleHiChange}
      />
      <div className="dual-range-values">
        <span>{formatValue(lo)}</span>
        <span>{formatValue(hi)}</span>
      </div>
    </div>
  );
}
