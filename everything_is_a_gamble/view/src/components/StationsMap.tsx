import { useEffect } from 'react';
import { LatLngBounds } from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type MapStationPoint = {
  id: number;
  lat: number;
  lon: number;
  name: string;
};

function FitMapToStations({ points }: { points: MapStationPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lon], 14);
      return;
    }
    const b = new LatLngBounds([points[0].lat, points[0].lon], [points[0].lat, points[0].lon]);
    points.forEach((p) => b.extend([p.lat, p.lon]));
    map.fitBounds(b, { padding: [40, 40], maxZoom: 15 });
  }, [map, points]);

  return null;
}

type StationsMapProps = {
  points: MapStationPoint[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

export function StationsMap({ points, selectedId, onSelect }: StationsMapProps) {
  return (
    <div className="relative w-full h-[min(520px,65vh)] min-h-[320px] rounded-2xl overflow-hidden border border-white/20 shadow-xl bg-slate-900/40">
      <MapContainer
        center={[45.7578, 4.832]}
        zoom={12}
        className="h-full w-full z-0 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:bg-white/90"
        scrollWheelZoom
      >
        <FitMapToStations points={points} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => {
          const selected = selectedId === p.id;
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lon]}
              radius={selected ? 11 : 8}
              pathOptions={{
                color: selected ? '#facc15' : '#a855f7',
                fillColor: selected ? '#fde047' : '#c084fc',
                fillOpacity: 0.88,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onSelect(p.id),
              }}
            >
              <Popup>
                <div className="min-w-[150px] text-gray-900">
                  <p className="font-semibold mb-2">{p.name}</p>
                  <button
                    type="button"
                    onClick={() => onSelect(p.id)}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm py-2 px-3 hover:opacity-95"
                  >
                    Parier sur cette station
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
