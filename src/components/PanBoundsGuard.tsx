import { useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { CANADA_CRS } from '../utils/canadaCRS';

// Generous pan limits in projected meters, well beyond Canada's actual
// extent (minX/maxX/minY/maxY below are the country's true EPSG:3978
// bounding box, padded by 1500km on every side).
//
// Leaflet's built-in `maxBounds` assumes a lat/lng rectangle maps to an
// axis-aligned pixel rectangle — true for Mercator, false for a Lambert
// conic projection, where it produces a degenerate/wrong clamp region
// (verified: with maxBounds set, dragging wasn't constrained at all and
// could pan into the numerically unstable region of the projection,
// where the map broke down entirely). Clamping the center in projected
// meters instead is valid here because CANADA_CRS is a simple affine map
// from meters to pixels, independent of the underlying lat/lng distortion.
const PAD = 1_500_000;
const PAN_BOUNDS_METERS = {
  minX: -3822065 - PAD,
  maxX: 3688294 + PAD,
  minY: -1020824 - PAD,
  maxY: 4067293 + PAD,
};

export default function PanBoundsGuard() {
  // panTo() below ends in its own 'moveend' — without this guard that
  // triggers another bounds check, which (thanks to float round-trip noise
  // through project/unproject) rarely lands exactly in bounds either,
  // producing an infinite pan-correction loop.
  const correctingRef = useRef(false);

  useMapEvents({
    moveend(e) {
      if (correctingRef.current) {
        correctingRef.current = false;
        return;
      }

      const map = e.target;
      const center = map.getCenter();
      const point = CANADA_CRS.project(center);
      const clampedX = Math.min(Math.max(point.x, PAN_BOUNDS_METERS.minX), PAN_BOUNDS_METERS.maxX);
      const clampedY = Math.min(Math.max(point.y, PAN_BOUNDS_METERS.minY), PAN_BOUNDS_METERS.maxY);

      if (clampedX !== point.x || clampedY !== point.y) {
        correctingRef.current = true;
        const clampedLatLng = CANADA_CRS.unproject(L.point(clampedX, clampedY));
        map.panTo(clampedLatLng, { animate: true });
      }
    },
  });

  return null;
}
