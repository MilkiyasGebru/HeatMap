import L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';

/**
 * NAD83 / Canada Atlas Lambert (EPSG:3978) — the Lambert Conformal Conic
 * projection Natural Resources Canada and Statistics Canada use for
 * national maps. Unlike Web Mercator, it keeps Canada's shape and relative
 * scale geometrically accurate instead of inflating high-latitude area.
 */
const EPSG3978_DEF =
  '+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +units=m +no_defs';

proj4.defs('EPSG:3978', EPSG3978_DEF);

// Projected bounding box of Canada's lat/lng extent in EPSG:3978 meters
// (computed by sampling the country's bbox border), padded ~300km on
// every side so the map isn't flush against the container edge.
const ORIGIN: [number, number] = [-4122065, 4367293]; // north-west corner [minX, maxY]

// Meters-per-pixel at each integer zoom level (halves each step, same
// geometric progression a tile pyramid would use, but there are no raster
// tiles here — this just governs pan/zoom scale for the vector layers).
const RESOLUTIONS = [
  16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16,
];

export const CANADA_CRS = new L.Proj.CRS('EPSG:3978', EPSG3978_DEF, {
  origin: ORIGIN,
  resolutions: RESOLUTIONS,
});

export const CANADA_MIN_ZOOM = 0;
export const CANADA_MAX_ZOOM = RESOLUTIONS.length - 1;
