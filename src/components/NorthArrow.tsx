export default function NorthArrow() {
  return (
    <div className="map-north-arrow" aria-hidden="true">
      <svg viewBox="0 0 40 60" width="26" height="39">
        <polygon points="20,0 28,40 20,32 12,40" fill="#1a1a1a" />
        <polygon
          points="20,32 28,40 20,60 12,40"
          fill="#ffffff"
          stroke="#1a1a1a"
          strokeWidth="1.5"
        />
      </svg>
      <span className="map-north-label">N</span>
    </div>
  );
}
