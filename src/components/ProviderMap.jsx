import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';

export default function ProviderMap({ 
  providers = [], 
  center = [20.5937, 78.9629], // Default to India center
  zoom = 5, 
  height = '400px',
  interactive = true
}) {
  const navigate = useNavigate();

  // Filter providers that actually have coordinates
  const markers = providers.filter(p => p.coordinates && p.coordinates.lat && p.coordinates.lng);

  return (
    <div style={{ height, width: '100%' }} className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm z-0 relative">
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {markers.map((provider) => (
          <Marker 
            key={provider._id} 
            position={[provider.coordinates.lat, provider.coordinates.lng]}
          >
            <Popup className="rounded-xl">
              <div className="p-1 min-w-[200px]">
                <h3 className="font-bold text-slate-900 text-sm mb-1">{provider.businessName}</h3>
                <p className="text-xs text-slate-500 mb-2">{provider.serviceType || 'Service Provider'}</p>
                <p className="text-xs text-slate-600 mb-3 line-clamp-1">{provider.location}</p>
                <button 
                  onClick={() => navigate(`/user/provider/${provider._id}`)}
                  className="w-full py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
