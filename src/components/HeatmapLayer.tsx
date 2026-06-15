import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { HeatmapDataPoint } from '../types/heatmap';
import { isInsideCanada } from '../data/canadaBoundary';

interface HeatmapLayerProps {
  points: HeatmapDataPoint[];
  gradient?: Record<number, string>;
  opacity?: number;
  /** IDW power parameter — higher = sharper falloff near points (default 2.5) */
  power?: number;
  /** Pixel step for sampling — lower = sharper but slower (default 4) */
  resolution?: number;
  /**
   * CSS blur radius in pixels applied to the whole layer container.
   * Smooths colour transitions without introducing tile-seam white lines.
   * Default: 8px — increase for a more painterly look, 0 to disable.
   */
  blurRadius?: number;
}

const DEFAULT_GRADIENT: Record<number, string> = {
  0.0: '#e0f2ff',
  0.2: '#7ec8e3',
  0.4: '#f7e463',
  0.6: '#f5a623',
  0.8: '#e04040',
  1.0: '#8b0000',
};

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

interface GradientStop {
  stop: number;
  rgb: [number, number, number];
}

function buildStops(gradient: Record<number, string>): GradientStop[] {
  return Object.entries(gradient)
      .map(([s, color]) => ({ stop: Number(s), rgb: hexToRgb(color) }))
      .sort((a, b) => a.stop - b.stop);
}

function colorFromValue(
    v: number,
    stops: GradientStop[],
    alpha: number,
): [number, number, number, number] {
  const clamped = Math.max(0, Math.min(1, v));
  let lo = stops[0];
  let hi = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (clamped >= stops[i].stop && clamped <= stops[i + 1].stop) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }

  const range = hi.stop - lo.stop;
  const t = range === 0 ? 0 : (clamped - lo.stop) / range;

  return [
    Math.round(lo.rgb[0] + t * (hi.rgb[0] - lo.rgb[0])),
    Math.round(lo.rgb[1] + t * (hi.rgb[1] - lo.rgb[1])),
    Math.round(lo.rgb[2] + t * (hi.rgb[2] - lo.rgb[2])),
    Math.round(alpha * 255),
  ];
}

/**
 * True Inverse Distance Weighting interpolation.
 * Every point contributes, weighted by 1 / distance^power.
 */
function idw(
    lat: number,
    lng: number,
    points: HeatmapDataPoint[],
    power: number,
): number {
  let weightedSum = 0;
  let weightTotal = 0;

  for (let i = 0; i < points.length; i++) {
    const dLat = lat - points[i].lat;
    const dLng = lng - points[i].long;
    const distSq = dLat * dLat + dLng * dLng;

    if (distSq < 1e-10) return points[i].intensity / 100;

    const w = 1 / Math.pow(distSq, power / 2);
    weightedSum += w * (points[i].intensity / 100);
    weightTotal += w;
  }

  return weightTotal === 0 ? 0 : weightedSum / weightTotal;
}

export default function HeatmapLayer({
                                       points,
                                       gradient = DEFAULT_GRADIENT,
                                       opacity = 0.6,
                                       power = 2.5,
                                       resolution = 4,
                                       blurRadius = 8,
                                     }: HeatmapLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.GridLayer | null>(null);

  useEffect(() => {
    const stops = buildStops(gradient);

    const IDWGrid = L.GridLayer.extend({
      createTile(coords: L.Coords) {
        const tile = document.createElement('canvas');
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        // No per-tile blur — blur is applied once on the layer container
        // below, which avoids the white-line seam artifact.

        const ctx = tile.getContext('2d');
        if (!ctx) return tile;

        const imgData = ctx.createImageData(size.x, size.y);
        const buf = imgData.data;

        for (let y = 0; y < size.y; y += resolution) {
          for (let x = 0; x < size.x; x += resolution) {
            const absPoint = L.point(
                coords.x * size.x + x,
                coords.y * size.y + y,
            );
            const ll = map.unproject(absPoint, coords.z);

            if (!isInsideCanada(ll.lat, ll.lng)) continue;

            const val = idw(ll.lat, ll.lng, points, power);
            const c = colorFromValue(val, stops, opacity);

            for (let dy = 0; dy < resolution && y + dy < size.y; dy++) {
              for (let dx = 0; dx < resolution && x + dx < size.x; dx++) {
                const idx = ((y + dy) * size.x + (x + dx)) * 4;
                buf[idx]     = c[0];
                buf[idx + 1] = c[1];
                buf[idx + 2] = c[2];
                buf[idx + 3] = c[3];
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        return tile;
      },

      // After the layer's container pane is ready, apply blur to the whole
      // pane element — one filter over all tiles, so no seams appear.
      onAdd(map: L.Map) {
        // Call the parent onAdd first
        (L.GridLayer.prototype).onAdd.call(this, map);

        if (blurRadius > 0) {
          const pane = this.getPane();
          if (pane) {
            pane.style.filter = `blur(${blurRadius}px)`;
          }
        }
      },

      onRemove(map: L.Map) {
        if (blurRadius > 0) {
          const pane = this.getPane();
          if (pane) {
            pane.style.filter = '';
          }
        }
        (L.GridLayer.prototype).onRemove.call(this, map);
      },
    });

    layerRef.current = new IDWGrid() as L.GridLayer;
    layerRef.current.addTo(map);

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, gradient, opacity, power, resolution, blurRadius]);

  return null;
}
