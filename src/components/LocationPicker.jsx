import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ 
  value, 
  onChange, 
  height = '300px',
  defaultCenter = [20.5937, 78.9629],
  defaultZoom = 4
}) {
  const [position, setPosition] = useState(value || null);

  // Sync internal state if prop changes
  useEffect(() => {
    if (value && value.lat && value.lng) {
      setPosition(value);
    }
  }, [value]);

  const handlePositionChange = (latlng) => {
    setPosition(latlng);
    onChange({ lat: latlng.lat, lng: latlng.lng });
  };

  const center = position || defaultCenter;
  const zoom = position ? 13 : defaultZoom;

  return (
    <div className="flex flex-col gap-3">
      <div style={{ height, width: '100%' }} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm z-0 relative">
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handlePositionChange} />
        </MapContainer>
      </div>
      <p className="text-xs text-slate-500">
        Click anywhere on the map to pin your exact service location.
        {position && (
          <span className="block mt-1 text-indigo-600 font-medium">
            Selected coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </span>
        )}
      </p>
    </div>
  );
}
