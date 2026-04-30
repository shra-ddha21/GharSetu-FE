import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { ArrowLeft, MapPin, Briefcase, Clock, ImageIcon, Map } from 'lucide-react';
import toast from 'react-hot-toast';
import ProviderMap from '../../components/ProviderMap';

export default function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProviders, toggleSelection } = useBooking();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSelected = selectedProviders.includes(id);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const { data } = await api.get(`/users/providers/${id}`);
        setProvider(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider details');
        toast.error('Failed to load provider details');
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">{error || 'Provider not found.'}</p>
        <button
          onClick={() => navigate('/user/search')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate('/user/search')}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Search</span>
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{provider.businessName}</h1>
            <p className="text-slate-500 mt-1">{provider.ownerName}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {provider.location || 'Location not available'}
              </span>
              {provider.experience && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {provider.experience} year{provider.experience !== 1 ? 's' : ''} experience
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => toggleSelection(id)}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
              isSelected
                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isSelected ? 'Remove Selection' : 'Select Provider'}
          </button>
        </div>

        {/* Service Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {provider.servicesOffered && provider.servicesOffered.length > 0 ? (
            provider.servicesOffered.map((s, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full"
              >
                {s}
              </span>
            ))
          ) : provider.serviceType ? (
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
              {provider.serviceType}
            </span>
          ) : (
            <span className="text-sm text-slate-400">No services listed</span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">About</h2>
        <p className="text-slate-600 leading-relaxed">
          {provider.description || 'This provider has not added a description yet.'}
        </p>
      </div>

      {/* Location Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Map className="w-5 h-5 text-slate-500" /> Location
        </h2>
        {provider.coordinates && provider.coordinates.lat ? (
          <ProviderMap 
            providers={[provider]} 
            center={[provider.coordinates.lat, provider.coordinates.lng]} 
            zoom={13} 
            height="300px" 
            interactive={false}
          />
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-800 font-medium">{provider.location}</p>
              <p className="text-sm text-slate-500">Exact map location not available.</p>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Portfolio</h2>
        {provider.portfolioImages && provider.portfolioImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {provider.portfolioImages.map((img, i) => (
              <div
                key={img.publicId || i}
                className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
              >
                <img
                  src={img.url}
                  alt={`Portfolio item ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML =
                      '<div class="w-full h-full flex items-center justify-center text-slate-300"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>';
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No portfolio images available.</p>
            <p className="text-slate-400 text-sm mt-1">This provider has not uploaded any work images yet.</p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      {selectedProviders.length > 0 && (
        <div className="sticky bottom-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between shadow-lg z-10">
          <div>
            <p className="text-indigo-800 font-semibold">
              {selectedProviders.length} Provider(s) Selected
            </p>
            <p className="text-indigo-600 text-sm">
              You can select up to 5 providers for a single request.
            </p>
          </div>
          <button
            onClick={() => navigate('/user/book')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            Continue to Request
          </button>
        </div>
      )}
    </div>
  );
}
