import { CircleMarker, Popup } from 'react-leaflet';
import BaseMap from '../components/BaseMap';
import SidePanel from '../components/SidePanel';
import {aviationLocations} from '../data/seismicPoints';

const DUMMY_GRADIENT: Record<number, string> = {
    0.0: '#ccc',
    1.0: '#333',
};

export default function AviationPage() {
    return (
        <div className="page-layout">
            <div className="map-section">
                <BaseMap showCapitals={false}>
                    {aviationLocations.map((loc) => (
                        <CircleMarker
                            key={`${loc.lat}-${loc.long}`}
                            center={[loc.lat, loc.long]}
                            radius={4}
                            pathOptions={{
                                fillColor: '#d32f2f',
                                color: '#b71c1c',
                                weight: 1,
                                fillOpacity: 0.9,
                                opacity: 0.9,
                            }}
                        >
                            <Popup>
                                <strong>{loc.location}</strong>, {loc.province}
                            </Popup>
                        </CircleMarker>
                    ))}
                </BaseMap>
            </div>
            <SidePanel
                badge="NBC 2025"
                title="Aviation Site Locations"
                subtitle="All aviations site monitored locations across Canada"
                gradient={DUMMY_GRADIENT}
                minVal={0}
                maxVal={0}
                unit=""
                scaleLabel=""
                description="Aviation Locations from the NBC 2025 that has 30 year data."
                locationCount={aviationLocations.length}
            />
        </div>
    );
}
