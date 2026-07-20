import type { WindLocation } from '../types/heatmap';
import seismicCsvText from './seismic_data.csv?raw';
import hourlyStationsCsvText from './Hourly_Aviation_Stations_Extract.csv?raw';
import stationsCsvText from './Aviation_Stations_Extract.csv?raw';
import nbc2025CsvText from './wind_datas/NBC2025_wind - Sheet1.csv?raw';
import nbc2020CsvText from './wind_datas/NBC2020_WindData.csv?raw';
import allCsvText from './wind_datas/Our_analysis_wind_all.csv?raw';
import nonThunderstormCsvText from './wind_datas/Our_analysis_wind_nonThunderstorm.csv?raw';

interface Coords {
  lat: number;
  long: number;
}

/**
 * A handful of NBC2025/NBC2020 location names are mangled by a double UTF-8
 * re-encoding upstream (e.g. "Sept-Îles" -> "Sept-ÃŽles") in a way that isn't
 * cleanly reversible. Map the mangled raw string straight to its coordinates.
 */
const MANUAL_COORDS: Record<string, Coords> = {
  'Sept-ÃŽles': { lat: 50.2023, long: -66.3817 },
  'BehchokÇ«Ì€ / Rae-Edzo': { lat: 62.8506, long: -116.0543 },
  'Behchok Ç«Ì€ / Rae-Edzo': { lat: 62.8506, long: -116.0543 },
};

/** Reverses a UTF-8 byte sequence that was mistakenly decoded as Latin-1. */
function fixMojibake(value: string): string {
  if (!/[-￿]/.test(value)) return value;
  try {
    const bytes = Uint8Array.from([...value].map((c) => c.charCodeAt(0)));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

/** Lowercase, accent-stripped, alphanumeric-only key used for fuzzy name matching. */
function normalizeName(value: string): string {
  return fixMojibake(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function splitCsvLines(text: string): string[] {
  return text.trim().split('\n').filter((line) => line.trim());
}

/**
 * Builds a resolver for NBC2025/NBC2020 "city name" locations, backed by
 * seismic_data.csv. Some names repeat (same city name in different
 * provinces); duplicates are consumed in file order, which matches the row
 * order the wind CSVs were generated in.
 */
function buildCityNameResolver() {
  const queues = new Map<string, Coords[]>();
  for (const line of splitCsvLines(seismicCsvText).slice(1)) {
    const parts = line.split(',');
    const location = parts[0].trim();
    const lat = parseFloat(parts[2]);
    const long = parseFloat(parts[3]);
    const key = normalizeName(location);
    const list = queues.get(key) ?? [];
    list.push({ lat, long });
    queues.set(key, list);
  }

  return function resolve(rawLocation: string): Coords | undefined {
    if (MANUAL_COORDS[rawLocation]) return MANUAL_COORDS[rawLocation];
    const key = normalizeName(rawLocation);
    const list = queues.get(key);
    if (!list || list.length === 0) return undefined;
    return list.shift();
  };
}

/**
 * Builds a resolver for Our_analysis station-code locations, e.g.
 * "ABBOTSFORD_A_702". Backed by the aviation station extracts, keyed by
 * NAME_STATIONID with the same normalization the source data used
 * (apostrophes stripped, "/" -> "-", spaces -> "_").
 */
function buildStationCodeResolver() {
  const byKey = new Map<string, Coords>();

  function ingest(csvText: string) {
    const lines = splitCsvLines(csvText);
    const header = lines[0].split(',');
    const nameIdx = header.indexOf('Name');
    const stationIdIdx = header.indexOf('Station ID');
    const latIdx = header.indexOf('Latitude (Decimal Degrees)');
    const longIdx = header.indexOf('Longitude (Decimal Degrees)');

    for (const line of lines.slice(1)) {
      const parts = line.split(',');
      const name = parts[nameIdx]?.trim();
      const stationId = parts[stationIdIdx]?.trim();
      const lat = parseFloat(parts[latIdx]);
      const long = parseFloat(parts[longIdx]);
      if (!name || !stationId || Number.isNaN(lat) || Number.isNaN(long)) continue;

      const key =
        name.toUpperCase().replace(/'/g, '').replace(/\//g, '-').replace(/\s+/g, '_') +
        '_' +
        stationId;
      if (!byKey.has(key)) byKey.set(key, { lat, long });
    }
  }

  ingest(hourlyStationsCsvText);
  ingest(stationsCsvText);

  // TORONTO_LESTER_B has no station-ID suffix in the source data; it's a
  // truncated reference to TORONTO LESTER B. PEARSON INT'L A (station 5097).
  byKey.set('TORONTO_LESTER_B', { lat: 43.68, long: -79.63 });

  return function resolve(rawLocation: string): Coords | undefined {
    return byKey.get(rawLocation);
  };
}

function parseCityNameWindCsv(csvText: string, y10Idx: number, y50Idx: number): WindLocation[] {
  const resolve = buildCityNameResolver();
  const results: WindLocation[] = [];
  for (const line of splitCsvLines(csvText).slice(1)) {
    const parts = line.split(',');
    const location = parts[0].trim();
    const coords = resolve(location);
    if (!coords) {
      console.warn(`windSpeedPoints: no coordinates for "${location}"`);
      continue;
    }
    results.push({
      location,
      lat: coords.lat,
      long: coords.long,
      y10: parseFloat(parts[y10Idx]),
      y50: parseFloat(parts[y50Idx]),
    });
  }
  return results;
}

function parseStationCodeWindCsv(csvText: string): WindLocation[] {
  const resolve = buildStationCodeResolver();
  const results: WindLocation[] = [];
  for (const line of splitCsvLines(csvText).slice(1)) {
    const parts = line.split(',');
    const location = parts[0].trim();
    const coords = resolve(location);
    if (!coords) {
      console.warn(`windSpeedPoints: no coordinates for "${location}"`);
      continue;
    }
    results.push({
      location,
      lat: coords.lat,
      long: coords.long,
      y10: parseFloat(parts[1]),
      y50: parseFloat(parts[2]),
    });
  }
  return results;
}

export const nbc2025WindLocations: WindLocation[] = parseCityNameWindCsv(nbc2025CsvText, 1, 2);
export const nbc2020WindLocations: WindLocation[] = parseCityNameWindCsv(nbc2020CsvText, 1, 2);
export const allThunderstormWindLocations: WindLocation[] = parseStationCodeWindCsv(allCsvText);
export const nonThunderstormWindLocations: WindLocation[] =
  parseStationCodeWindCsv(nonThunderstormCsvText);
