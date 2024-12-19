import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Users, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { delhiMetroStations } from '../../data/stations';

const ZoneMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const ZoomToZone = ({ stationName }: { stationName: string | null }) => {
    const map = useMap();
    React.useEffect(() => {
      if (stationName) {
        const station = delhiMetroStations.find(s => s.name === stationName);
        if (station) {
          map.setView([station.lat, station.lng], 14);
        }
      }
    }, [stationName, map]);
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {delhiMetroStations.map((station) => (
          <button
            key={station.name}
            onClick={() => setSelectedZone(station.name)}
            className={`px-3 py-2 text-sm rounded-full transition-all ${selectedZone === station.name ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900 dark:text-white dark:hover:bg-indigo-800'}`}
          >
            {station.name}
          </button>
        ))}
      </div>

      <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={11}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ZoomToZone stationName={selectedZone} />
          {delhiMetroStations.map((station) => (
            <React.Fragment key={station.name}>
              <Marker
                position={[station.lat, station.lng]}
                icon={customIcon}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{station.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Zone: {station.zone}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Rickshaws: {station.activeRickshaws}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Wait Time: {station.waitTime} min</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Demand: {station.demand}</p>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ZoneMap;