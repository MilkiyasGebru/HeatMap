import { GeoJSON } from 'react-leaflet';
import canadaGeo from '../data/canadaGeo.json';
import type { Feature, Polygon } from 'geojson';

const geo = canadaGeo as { type: string; coordinates: number[][][][] };

function createMask(): Feature<Polygon> {
  const world: number[][] = [
    [-180, -90],
    [180, -90],
    [180, 90],
    [-180, 90],
    [-180, -90],
  ];

  // Use only outer rings (poly[0]) — inner rings are water bodies
  // (Hudson Bay, NW Passage, lakes) that we want to keep visible
  const holes: number[][][] = geo.coordinates.map((poly) => poly[0]);

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [world, ...holes],
    },
  };
}

const maskData = createMask();

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
