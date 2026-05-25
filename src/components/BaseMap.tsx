import { MapContainer, TileLayer } from 'react-leaflet';
import CanadaMask from './CanadaMask';
import CapitalCities from './CapitalCities';
import type { ReactNode } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CANADA_CENTER: [number, number] = [62, -96];
const CANADA_BOUNDS: LatLngBoundsExpression = [
  [38, -145],
  [86, -48],
];

interface BaseMapProps {
  children?: ReactNode;
  showCapitals?: boolean;
}

export default function BaseMap({ children, showCapitals = true }: BaseMapProps) {
  return (
    <MapContainer
      center={CANADA_CENTER}
      zoom={3}
      minZoom={3}
      maxZoom={10}
      maxBounds={CANADA_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        noWrap
      />
      {children}
      <CanadaMask />
      {showCapitals && <CapitalCities />}
    </MapContainer>
  );
}
