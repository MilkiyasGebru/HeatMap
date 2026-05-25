import type { ReactNode } from 'react';

interface SidePanelProps {
  badge: string;
  title: string;
  subtitle: string;
  gradient: Record<number, string>;
  minVal: number;
  maxVal: number;
  unit: string;
  scaleLabel: string;
  description: string;
  locationCount: number;
  children?: ReactNode;
}

export default function SidePanel({
  badge,
  title,
  subtitle,
  gradient,
  minVal,
  maxVal,
  unit,
  scaleLabel,
  description,
  locationCount,
  children,
}: SidePanelProps) {
  const stops = Object.entries(gradient)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([stop, color]) => `${color} ${Number(stop) * 100}%`)
    .join(', ');

  return (
    <aside className="info-panel">
      <div className="panel-header">
        <span className="panel-badge">{badge}</span>
        <h1>{title}</h1>
        <p className="panel-subtitle">{subtitle}</p>
      </div>

      {children}

      {scaleLabel && (
        <div className="panel-card">
          <h3>{scaleLabel}</h3>
          <div
            className="legend-bar"
            style={{ background: `linear-gradient(to right, ${stops})` }}
          />
          <div className="legend-labels">
            <span>
              {minVal.toFixed(2)} {unit}
            </span>
            <span>
              {((minVal + maxVal) / 2).toFixed(2)} {unit}
            </span>
            <span>
              {maxVal.toFixed(2)} {unit}
            </span>
          </div>
        </div>
      )}

      <div className="panel-card panel-info">
        <p>{description}</p>
        <p className="data-source">
          {locationCount} locations &middot; NBC 2025 Climatic Data
        </p>
      </div>
    </aside>
  );
}
