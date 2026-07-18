import { GeoJSON } from 'react-leaflet';
import provinceGeo from '../data/canadaProvinces.json';
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson';

const data = provinceGeo as unknown as FeatureCollection<Polygon | MultiPolygon>;

export default function ProvinceBorders() {
  return (
    <GeoJSON
      data={data}
      style={{
        fillOpacity: 0,
        color: '#9ca3af',
        weight: 0.75,
        opacity: 0.6,
      }}
      // Non-interactive: province fills are transparent, so clicks should
      // pass through to whatever's underneath (heatmap/markers) instead of
      // this layer swallowing them.
      interactive={false}
    />
  );
}
