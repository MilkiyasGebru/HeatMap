interface LegendProps {
  gradient: Record<number, string>;
}

export default function Legend({ gradient }: LegendProps) {
  const stops = Object.entries(gradient)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([stop, color]) => `${color} ${Number(stop) * 100}%`)
    .join(', ');

  return (
    <div className="heatmap-legend">
      <div className="legend-title">Intensity</div>
      <div
        className="legend-bar"
        style={{ background: `linear-gradient(to right, ${stops})` }}
      />
      <div className="legend-labels">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
