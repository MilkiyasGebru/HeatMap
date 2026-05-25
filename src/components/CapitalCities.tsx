import { Rectangle, Tooltip } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';

const CAPITALS = [
  { name: 'Whitehorse', lat: 60.7216, long: -135.0549 },
  { name: 'Yellowknife', lat: 62.4541, long: -114.3774 },
  { name: 'Vancouver', lat: 49.2606, long: -123.1139 },
  { name: 'Victoria', lat: 48.4283, long: -123.3650 },
  { name: 'Edmonton', lat: 53.5462, long: -113.4912 },
  { name: 'Regina', lat: 50.4480, long: -104.6159 },
  { name: 'Winnipeg', lat: 49.8955, long: -97.1385 },
  { name: 'Ottawa', lat: 45.4215, long: -75.6972 },
  { name: 'Toronto', lat: 43.6532, long: -79.3832 },
  { name: 'Québec', lat: 46.8137, long: -71.2084 },
  { name: 'Montréal', lat: 45.5090, long: -73.5540 },
  { name: 'Charlottetown', lat: 46.2354, long: -63.1265 },
  { name: 'Fredericton', lat: 45.9488, long: -66.6292 },
  { name: 'Halifax', lat: 44.6486, long: -63.5859 },
  { name: "St. John's", lat: 47.5615, long: -52.7126 },
  { name: 'Iqaluit', lat: 63.7467, long: -68.5170 },
];

const DOT_SIZE = 0.35; // degrees — visible at zoom 3

function squareBounds(
  lat: number,
  lng: number,
): LatLngBoundsExpression {
  const h = DOT_SIZE / 2;
  return [
    [lat - h, lng - h],
    [lat + h, lng + h],
  ];
}

export default function CapitalCities() {
  return (
    <>
      {CAPITALS.map((c) => (
        <Rectangle
          key={c.name}
          bounds={squareBounds(c.lat, c.long)}
          pathOptions={{
            color: '#1a1a1a',
            weight: 1.5,
            fillColor: '#1a1a1a',
            fillOpacity: 0.85,
            opacity: 1,
          }}
        >
          <Tooltip
            direction="right"
            offset={[4, 0]}
            permanent
            className="city-label"
          >
            {c.name}
          </Tooltip>
        </Rectangle>
      ))}
    </>
  );
}
