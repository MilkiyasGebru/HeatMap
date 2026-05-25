import type { HeatmapDataPoint } from '../types/heatmap';

// Sample data: intensity loosely based on population density / urban activity
export const canadaCities: HeatmapDataPoint[] = [
  // === Ontario ===
  { lat: 43.6532, long: -79.3832, intensity: 98 },  // Toronto
  { lat: 43.2557, long: -79.8711, intensity: 72 },  // Hamilton
  { lat: 43.4643, long: -80.5204, intensity: 58 },  // Kitchener-Waterloo
  { lat: 42.9849, long: -81.2453, intensity: 52 },  // London
  { lat: 43.8561, long: -79.3370, intensity: 62 },  // Markham
  { lat: 43.6591, long: -79.6441, intensity: 68 },  // Mississauga
  { lat: 43.7735, long: -79.5020, intensity: 55 },  // Vaughan
  { lat: 44.3894, long: -79.6903, intensity: 44 },  // Barrie
  { lat: 45.4215, long: -75.6972, intensity: 78 },  // Ottawa
  { lat: 44.2312, long: -76.4860, intensity: 38 },  // Kingston
  { lat: 44.3000, long: -78.3197, intensity: 33 },  // Peterborough
  { lat: 43.1594, long: -79.2469, intensity: 42 },  // St. Catharines-Niagara
  { lat: 42.3149, long: -83.0364, intensity: 45 },  // Windsor
  { lat: 46.4917, long: -80.9930, intensity: 30 },  // Sudbury
  { lat: 48.3809, long: -89.2477, intensity: 28 },  // Thunder Bay
  { lat: 46.3167, long: -79.4500, intensity: 22 },  // North Bay
  { lat: 44.3500, long: -79.2167, intensity: 25 },  // Orillia
  { lat: 42.7792, long: -80.2633, intensity: 20 },  // Brantford
  { lat: 43.5448, long: -80.2482, intensity: 50 },  // Guelph
  { lat: 48.7500, long: -80.6833, intensity: 14 },  // Kirkland Lake
  { lat: 49.7667, long: -86.9500, intensity: 10 },  // Geraldton
  { lat: 51.2531, long: -80.6164, intensity: 6 },   // Moosonee

  // === Quebec ===
  { lat: 45.5017, long: -73.5673, intensity: 92 },  // Montreal
  { lat: 46.8139, long: -71.2080, intensity: 62 },  // Quebec City
  { lat: 45.4042, long: -71.8929, intensity: 38 },  // Sherbrooke
  { lat: 46.3500, long: -72.5500, intensity: 34 },  // Trois-Rivieres
  { lat: 48.4284, long: -71.0686, intensity: 30 },  // Saguenay
  { lat: 45.5500, long: -73.4167, intensity: 48 },  // Longueuil
  { lat: 45.5333, long: -73.6833, intensity: 45 },  // Laval
  { lat: 47.2333, long: -79.0167, intensity: 16 },  // Rouyn-Noranda
  { lat: 48.8167, long: -67.5000, intensity: 18 },  // Rimouski
  { lat: 49.2167, long: -68.1500, intensity: 14 },  // Sept-Iles
  { lat: 48.1000, long: -77.7833, intensity: 12 },  // Val-d'Or
  { lat: 46.0600, long: -73.1300, intensity: 25 },  // Sorel-Tracy
  { lat: 53.2000, long: -70.8500, intensity: 4 },   // Radisson (James Bay)
  { lat: 58.1000, long: -68.4000, intensity: 3 },   // Kuujjuaq

  // === British Columbia ===
  { lat: 49.2827, long: -123.1207, intensity: 90 },  // Vancouver
  { lat: 48.4284, long: -123.3656, intensity: 50 },  // Victoria
  { lat: 49.8880, long: -119.4960, intensity: 40 },  // Kelowna
  { lat: 52.8737, long: -122.7806, intensity: 20 },  // Quesnel
  { lat: 49.1666, long: -123.9401, intensity: 42 },  // Nanaimo
  { lat: 53.9171, long: -122.7497, intensity: 32 },  // Prince George
  { lat: 54.2325, long: -130.3271, intensity: 14 },  // Prince Rupert
  { lat: 50.6745, long: -120.3273, intensity: 28 },  // Kamloops
  { lat: 49.0504, long: -122.3045, intensity: 55 },  // Surrey/Langley
  { lat: 56.2335, long: -120.8466, intensity: 18 },  // Fort St. John
  { lat: 58.8050, long: -122.6970, intensity: 10 },  // Fort Nelson
  { lat: 59.2333, long: -129.9833, intensity: 6 },   // Dease Lake

  // === Alberta ===
  { lat: 51.0447, long: -114.0719, intensity: 82 },  // Calgary
  { lat: 53.5461, long: -113.4937, intensity: 78 },  // Edmonton
  { lat: 52.2690, long: -113.8113, intensity: 35 },  // Red Deer
  { lat: 49.6942, long: -112.8328, intensity: 30 },  // Lethbridge
  { lat: 56.7264, long: -111.3803, intensity: 24 },  // Fort McMurray
  { lat: 55.1700, long: -118.7952, intensity: 22 },  // Grande Prairie
  { lat: 53.8933, long: -116.5765, intensity: 16 },  // Hinton
  { lat: 51.1800, long: -115.5708, intensity: 26 },  // Banff/Canmore
  { lat: 58.7900, long: -117.1500, intensity: 8 },   // High Level

  // === Saskatchewan ===
  { lat: 52.1332, long: -106.6700, intensity: 42 },  // Saskatoon
  { lat: 50.4452, long: -104.6189, intensity: 40 },  // Regina
  { lat: 53.2033, long: -105.7531, intensity: 18 },  // Prince Albert
  { lat: 50.3933, long: -105.5519, intensity: 14 },  // Moose Jaw
  { lat: 56.6333, long: -105.2833, intensity: 8 },   // La Ronge
  { lat: 54.1167, long: -108.4333, intensity: 6 },   // Meadow Lake

  // === Manitoba ===
  { lat: 49.8951, long: -97.1384, intensity: 65 },  // Winnipeg
  { lat: 50.9500, long: -99.9500, intensity: 18 },  // Dauphin
  { lat: 54.7667, long: -101.8748, intensity: 12 },  // Flin Flon
  { lat: 55.7500, long: -97.8500, intensity: 10 },  // Thompson
  { lat: 58.7857, long: -94.1827, intensity: 8 },   // Churchill
  { lat: 50.2275, long: -100.4456, intensity: 16 }, // Brandon

  // === Atlantic Provinces ===
  { lat: 44.6488, long: -63.5752, intensity: 52 },  // Halifax
  { lat: 46.2382, long: -63.1311, intensity: 28 },  // Charlottetown
  { lat: 47.5615, long: -52.7126, intensity: 36 },  // St. John's
  { lat: 45.2733, long: -66.0633, intensity: 30 },  // Saint John NB
  { lat: 46.0878, long: -64.7782, intensity: 32 },  // Moncton
  { lat: 47.0316, long: -65.4681, intensity: 22 },  // Bathurst NB
  { lat: 45.9636, long: -66.6431, intensity: 34 },  // Fredericton
  { lat: 46.1368, long: -60.1942, intensity: 18 },  // Sydney NS
  { lat: 48.9500, long: -54.5667, intensity: 14 },  // Gander NL
  { lat: 49.1667, long: -57.9500, intensity: 12 },  // Corner Brook NL
  { lat: 53.3076, long: -60.3300, intensity: 8 },   // Happy Valley-Goose Bay

  // === Territories ===
  { lat: 62.4540, long: -114.3718, intensity: 20 },  // Yellowknife
  { lat: 60.7212, long: -135.0568, intensity: 16 },  // Whitehorse
  { lat: 63.7467, long: -68.5170, intensity: 10 },  // Iqaluit
  { lat: 64.0500, long: -139.4333, intensity: 6 },  // Dawson City
  { lat: 69.1169, long: -105.0597, intensity: 4 },  // Cambridge Bay
  { lat: 66.5000, long: -136.2167, intensity: 3 },  // Fort McPherson
  { lat: 68.3607, long: -133.7230, intensity: 5 },  // Inuvik
  { lat: 72.6833, long: -77.9667, intensity: 2 },   // Pond Inlet
  { lat: 74.6944, long: -94.8694, intensity: 2 },   // Resolute
  { lat: 82.5000, long: -62.3333, intensity: 1 },   // Alert (northernmost)
];
