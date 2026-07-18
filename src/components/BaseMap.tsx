import { MapContainer, ScaleControl } from 'react-leaflet';
import CanadaMask from './CanadaMask';
import ProvinceBorders from './ProvinceBorders';
import CapitalCities from './CapitalCities';
import NorthArrow from './NorthArrow';
import StationLegend, { type StationLegendItem } from './StationLegend';
import PanBoundsGuard from './PanBoundsGuard';
import type { ReactNode } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import { CANADA_CRS, CANADA_MIN_ZOOM, CANADA_MAX_ZOOM } from '../utils/canadaCRS';
import 'leaflet/dist/leaflet.css';

const CANADA_BOUNDS: LatLngBoundsExpression = [
  [38, -145],
  [86, -48],
];

const CAPITAL_LEGEND_ITEM: StationLegendItem = {
  label: 'Capital city',
  symbol: 'dot',
  color: '#1a1a1a',
};

interface BaseMapProps {
  children?: ReactNode;
  showCapitals?: boolean;
  legendItems?: StationLegendItem[];
}

export default function BaseMap({
  children,
  showCapitals = true,
  legendItems = [],
}: BaseMapProps) {
  const items = showCapitals ? [...legendItems, CAPITAL_LEGEND_ITEM] : legendItems;

  return (
    <MapContainer
      crs={CANADA_CRS}
      bounds={CANADA_BOUNDS}
      boundsOptions={{ padding: [20, 20] }}
      minZoom={CANADA_MIN_ZOOM}
      maxZoom={CANADA_MAX_ZOOM}
      style={{ width: '100%', height: '100%', background: '#ffffff' }}
      scrollWheelZoom
    >
      {children}
      <ProvinceBorders />
      <CanadaMask />
      {showCapitals && <CapitalCities />}
      <PanBoundsGuard />
      <NorthArrow />
      <StationLegend items={items} />
      <ScaleControl position="bottomleft" metric imperial={false} />
    </MapContainer>
  );
}
