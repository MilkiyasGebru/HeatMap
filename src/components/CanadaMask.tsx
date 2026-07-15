import { GeoJSON } from 'react-leaflet';
import canadaGeo from '../data/canadaGeo.json';
import type { Feature, MultiPolygon } from 'geojson';

// canadaGeo.json is a bare MultiPolygon geometry (outer ring + water-body
// holes per polygon, e.g. Hudson Bay, lakes). We draw it directly as the
// country outline — no basemap to mask out anymore, so there's no need for
// the old "world rectangle minus Canada" inversion trick (that also broke
// under a conic projection, since a world-spanning rectangle doesn't map
// to a sane shape outside Mercator).
const maskData: Feature<MultiPolygon> = {
  type: 'Feature',
  properties: {},
  geometry: canadaGeo as unknown as MultiPolygon,
};

export default function CanadaMask() {
  return (
    <GeoJSON
      data={maskData}
      style={{
        fillColor: '#ffffff',
        fillOpacity: 1,
        color: '#6b7280',
        weight: 1.5,
        opacity: 0.5,
      }}
    />
  );
}
