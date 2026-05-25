import type { CustomLocation } from '../types/heatmap';
import { coordsByName } from './seismicPoints';
import csvText from './custom_data.csv?raw';

function parseCSV(text: string): CustomLocation[] {
    const lines = text.trim().split('\n');
    const results: CustomLocation[] = [];

    for (const line of lines.slice(1)) {
        if (!line.trim()) continue;
        const parts = line.split(',');
        const location = parts[0].trim();
        const value = parseFloat(parts[1]);
        const coords = coordsByName.get(location);
        if (!coords) {
            console.log("Value is not found")
            continue}; // skip if no matching coordinates
        results.push({ location, lat: coords.lat, long: coords.long, value });
    }

    return results;
}

export const customLocations: CustomLocation[] = parseCSV(csvText);
