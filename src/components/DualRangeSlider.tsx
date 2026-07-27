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

  const decrementLo = useCallback(() => {
    onChange([Math.max(min, lo - step), hi]);
  }, [min, lo, hi, step, onChange]);

  const incrementLo = useCallback(() => {
    onChange([Math.min(hi - step, lo + step), hi]);
  }, [hi, lo, step, onChange]);

  const decrementHi = useCallback(() => {
    onChange([lo, Math.max(lo + step, hi - step)]);
  }, [lo, hi, step, onChange]);

  const incrementHi = useCallback(() => {
    onChange([lo, Math.min(max, hi + step)]);
  }, [max, lo, hi, step, onChange]);

  return (
    <div className="dual-range-wrapper">
      <div className="dual-range-current">
        {formatValue(lo)} &ndash; {formatValue(hi)}
      </div>

      <div className="dual-range-row">
        <div className="dual-range-stepper">
          <button
            type="button"
            className="dual-range-step"
            aria-label="Increase minimum value"
            onClick={incrementLo}
            disabled={lo >= hi - step}
          >
            +
          </button>
          <button
            type="button"
            className="dual-range-step"
            aria-label="Decrease minimum value"
            onClick={decrementLo}
            disabled={lo <= min}
          >
            &minus;
          </button>
        </div>

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
        </div>

        <div className="dual-range-stepper">
          <button
            type="button"
            className="dual-range-step"
            aria-label="Increase maximum value"
            onClick={incrementHi}
            disabled={hi >= max}
          >
            +
          </button>
          <button
            type="button"
            className="dual-range-step"
            aria-label="Decrease maximum value"
            onClick={decrementHi}
            disabled={hi <= lo + step}
          >
            &minus;
          </button>
        </div>
      </div>

      <div className="dual-range-bounds">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
