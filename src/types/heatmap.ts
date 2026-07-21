export interface HeatmapDataPoint {
  lat: number;
  long: number;
  intensity: number; // 0-100
}

export interface SeismicLocation {
  location: string;
  province: string;
  lat: number;
  long: number;
  sa02: number;
  pga: number;
}

export interface PressureLocation {
  location: string;
  lat: number;
  long: number;
  p500: number; // 1/500 value
}

export interface CustomLocation {
  location: string;
  lat: number;
  long: number;
  value: number;
}

export interface AviationLocation {
  location: string;
  province: string;
  lat: number;
  long: number;
}

export interface WindLocation {
  location: string;
  lat: number;
  long: number;
  y10: number;
  y50: number;
  y500?: number;
}