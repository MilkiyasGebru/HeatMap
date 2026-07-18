import { GeoJSON } from 'react-leaflet';
import provinceBorders from '../data/canadaProvinceBorders.json';
import type { MultiLineString } from 'geojson';

// Interior province/territory boundaries only (shared edges between two
// provinces) — pre-computed via topojson so the exterior/coastline arcs
// (which include the international border running through the Great Lakes)
// are excluded. The country outline itself is drawn separately by
// CanadaMask, so we don't want a second, redundant line tracing the coast.
const data = provinceBorders as unknown as MultiLineString;

export default function ProvinceBorders() {
  return (
    <GeoJSON
      data={data}
      style={{
        color: '#9ca3af',
        weight: 0.75,
        opacity: 0.6,
      }}
      interactive={false}
    />
  );
}
