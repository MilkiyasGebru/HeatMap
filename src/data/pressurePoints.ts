import type { PressureLocation } from '../types/heatmap';
import { coordsByName } from './seismicPoints';
import csvText from './pressure_data.csv?raw';

function parseCSV(text: string): PressureLocation[] {
  const lines = text.trim().split('\n');
  const results: PressureLocation[] = [];

  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const parts = line.split(',');
    const location = parts[0].trim();
    const p500 = parseFloat(parts[3]);
    const coords = coordsByName.get(location);
    if (!coords) continue; // skip if no matching coordinates
    results.push({ location, lat: coords.lat, long: coords.long, p500 });
  }

  return results;
}

export const pressureLocations: PressureLocation[] = parseCSV(csvText);
