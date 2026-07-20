import type {AviationLocation, SeismicLocation} from '../types/heatmap';
import csvText from './seismic_data.csv?raw';
import aviationText from './filitered_aviation_stations.csv?raw'

function parseCSV(text: string): SeismicLocation[] {
  const lines = text.trim().split('\n');
  return lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(',');
      return {
        location: parts[0].trim(),
        province: parts[1].trim(),
        lat: parseFloat(parts[2]),
        long: parseFloat(parts[3]),
        sa02: parseFloat(parts[4]),
        pga: parseFloat(parts[10]),
      };
    });
}

function parseSecondCSV(text: string): AviationLocation[] {
    const lines = text.trim().split('\n');
    return lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
            const parts = line.split(',');
            return {
                location: parts[0].trim(),
                province: parts[1].trim(),
                lat: parseFloat(parts[6]),
                long: parseFloat(parts[7]),
                sa02: parseFloat(parts[4]),
                pga: parseFloat(parts[10]),
            };
        });
}

export const seismicLocations: SeismicLocation[] = parseCSV(csvText);

export const aviationLocations: AviationLocation[] = parseSecondCSV(aviationText)

/** Lookup map: location name → { lat, long } */
export const coordsByName = new Map(
  seismicLocations.map((loc) => [loc.location, { lat: loc.lat, long: loc.long }]),
);
