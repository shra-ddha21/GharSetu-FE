import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { Map, List, Search as SearchIcon, MapPin, SlidersHorizontal, X } from 'lucide-react';
import ProviderMap from '../../components/ProviderMap';
import useDebounce from '../../hooks/useDebounce';

const CATEGORIES = ['Plumbing', 'Cleaning', 'Electrical', 'Carpentry', 'Painting', 'Other'];
const EXPERIENCES = [
  { label: 'Any Experience', value: 0 },
  { label: '1+ Years', value: 1 },
  { label: '3+ Years', value: 3 },
  { label: '5+ Years', value: 5 }
];

export default function Search() {
  const navigate = useNavigate();
  const { selectedProviders, toggleSelection } = useBooking();

  const [providers, setProviders] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    minExperience: 0
  });

  // Debounce the text inputs to avoid spamming the API
  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedLocation = useDebounce(filters.location, 500);

  // Fetch data automatically when debounced values or direct filters change
  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/search', {
          params: {
            keyword: debouncedKeyword,
            location: debouncedLocation,
            category: filters.category === 'Other' ? '' : filters.category, // 'Other' just clears category match in this simple implementation
            minExperience: filters.minExperience
          }
        });
        setProviders(data);
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [debouncedKeyword, debouncedLocation, filters.category, filters.minExperience]);

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      category: '',
      minExperience: 0
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0 sticky top-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Filters
          </h2>
          {(filters.keyword || filters.location || filters.category || filters.minExperience > 0) && (
            <button 
              onClick={clearFilters}
              className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Keyword Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Search</label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Name or service..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={filters.keyword}
                onChange={e => setFilters({...filters, keyword: e.target.value})}
              />
              {filters.keyword && (
                 <button onClick={() => setFilters({...filters, keyword: ''})} className="absolute right-3 top-1/2 -translate-y-1/2">
                   <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                 </button>
              )}
            </div>
          </div>

          {/* Location Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="City or area..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={filters.location}
                onChange={e => setFilters({...filters, location: e.target.value})}
              />
              {filters.location && (
                 <button onClick={() => setFilters({...filters, location: ''})} className="absolute right-3 top-1/2 -translate-y-1/2">
                   <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                 </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Service Category</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="radio" 
                  name="category"
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                  checked={filters.category === ''}
                  onChange={() => setFilters({...filters, category: ''})}
                />
                <span className={`text-sm ${filters.category === '' ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>All Categories</span>
              </label>
              {CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category"
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={filters.category === cat}
                    onChange={() => setFilters({...filters, category: cat})}
                  />
                  <span className={`text-sm ${filters.category === cat ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Minimum Experience</label>
            <div className="space-y-2">
              {EXPERIENCES.map(exp => (
                <label key={exp.value} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="experience"
                    className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    checked={filters.minExperience === exp.value}
                    onChange={() => setFilters({...filters, minExperience: exp.value})}
                  />
                  <span className={`text-sm ${filters.minExperience === exp.value ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'}`}>{exp.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {providers.length} {providers.length === 1 ? 'Provider' : 'Providers'} Found
          </h1>
          <div className="bg-white p-1 rounded-lg flex border border-slate-200 shadow-sm w-fit">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${viewMode === 'map' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Map className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {/* Results Container */}
        {loading ? (
           <div className="py-20 flex justify-center">
             <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
           </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                <ProviderMap providers={providers} height="600px" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {providers.map(p => {
                  const isSelected = selectedProviders.includes(p._id);
                  return (
                    <div key={p._id} className={`p-4 sm:p-6 bg-white rounded-2xl border transition-all ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 shadow-md' : 'hover:shadow-md border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{p.businessName}</h3>
                          <p className="text-sm text-slate-500">{p.ownerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                          {p.serviceType}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400" /> {p.location}
                        </p>
                        {p.experience && (
                           <p className="text-sm text-slate-600 flex items-center gap-2">
                             <span className="w-4 h-4 flex items-center justify-center text-slate-400 font-bold text-[10px] border border-slate-400 rounded-full">★</span> 
                             {p.experience} Years Exp.
                           </p>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2 mt-2">
                          {p.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate(`/user/provider/${p._id}`)}
                          className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => toggleSelection(p._id)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isSelected ? 'Remove' : 'Select'}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {providers.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <SearchIcon className="w-12 h-12 text-slate-300 mb-4" />
                    <p className="text-lg font-medium text-slate-700">No providers found</p>
                    <p className="text-sm mt-1">Try adjusting your filters to find more results.</p>
                    {(filters.keyword || filters.location || filters.category || filters.minExperience > 0) && (
                      <button 
                        onClick={clearFilters}
                        className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}