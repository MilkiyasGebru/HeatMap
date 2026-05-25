import canadaGeo from './canadaGeo.json';

interface PolyRings {
  outer: number[][];
  holes: number[][][];
}

const geo = canadaGeo as { type: string; coordinates: number[][][][] };

const polygons: PolyRings[] = geo.coordinates.map((poly) => ({
  outer: poly[0],
  holes: poly.slice(1),
}));

// Ray-casting point-in-polygon
function inRing(x: number, y: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

export function isInsideCanada(lat: number, lng: number): boolean {
  // Quick bounding box reject
  if (lat < 41.6 || lat > 83.2 || lng < -141.1 || lng > -52.5) return false;

  for (const poly of polygons) {
    if (inRing(lng, lat, poly.outer)) {
      let inHole = false;
      for (const hole of poly.holes) {
        if (inRing(lng, lat, hole)) {
          inHole = true;
          break;
        }
      }
      if (!inHole) return true;
    }
  }
  return false;
}
