export interface StationLegendItem {
  label: string;
  symbol: 'dot' | 'square' | 'ring';
  color?: string;
}

interface StationLegendProps {
  items: StationLegendItem[];
  title?: string;
}

export default function StationLegend({ items, title = 'Legend' }: StationLegendProps) {
  if (items.length === 0) return null;

  return (
    <div className="map-station-legend">
      <div className="map-station-legend-title">{title}</div>
      <ul className="map-station-legend-list">
        {items.map((item) => (
          <li key={item.label} className="map-station-legend-item">
            <span
              className={`map-station-legend-symbol map-station-legend-symbol--${item.symbol}`}
              style={{ borderColor: item.color ?? '#d32f2f', background: item.symbol === 'ring' ? 'transparent' : (item.color ?? '#d32f2f') }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
