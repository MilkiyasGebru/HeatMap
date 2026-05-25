import { useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer';
import InfoPanel from './InfoPanel';
import { seismicLocations } from '../data/seismicPoints';
import calculateVsp from '../utils/calculateVsp';
import type { HeatmapDataPoint } from '../types/heatmap';
import 'leaflet/dist/leaflet.css';

const CANADA_CENTER: [number, number] = [56.1304, -106.3468];
const CANADA_ZOOM = 4;

const GRADIENT: Record<number, string> = {
  0.0: '#eff3ff',
  0.2: '#6baed6',
  0.4: '#fed976',
  0.6: '#fd8d3c',
  0.8: '#e31a1c',
  1.0: '#800026',
};

function computeHeatmapData(ie: number, wp: number) {
  const vspValues = seismicLocations.map((loc) => ({
    lat: loc.lat,
    long: loc.long,
    vsp: calculateVsp(loc.sa02, ie, wp),
  }));

  const maxVsp = Math.max(...vspValues.map((v) => v.vsp));
  const minVsp = Math.min(...vspValues.map((v) => v.vsp));

  const points: HeatmapDataPoint[] = vspValues.map((v) => ({
    lat: v.lat,
    long: v.long,
    intensity: maxVsp > 0 ? (v.vsp / maxVsp) * 100 : 0,
  }));

  return { points, maxVsp, minVsp };
}

export default function CanadaHeatmap() {
  const [ie, setIe] = useState(1.0);
  const [wp, setWp] = useState(1.0);

  const { points, maxVsp, minVsp } = useMemo(
    () => computeHeatmapData(ie, wp),
    [ie, wp],
  );

  return (
    <div className="app-layout">
      <div className="map-section">
        <MapContainer
          center={CANADA_CENTER}
          zoom={CANADA_ZOOM}
          minZoom={3}
          maxZoom={13}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer
            points={points}
            gradient={GRADIENT}
            opacity={0.6}
            power={2.5}
            resolution={4}
          />
        </MapContainer>
      </div>
      <InfoPanel
        ie={ie}
        wp={wp}
        onIeChange={setIe}
        onWpChange={setWp}
        gradient={GRADIENT}
        maxVsp={maxVsp}
        minVsp={minVsp}
        locationCount={seismicLocations.length}
      />
    </div>
  );
}
