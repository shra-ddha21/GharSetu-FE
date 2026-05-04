import React, { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../contexts/BookingContext';
import { Map, List, Search as SearchIcon, MapPin, SlidersHorizontal, X, BadgeCheck, ArrowLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ProviderMap from '../../components/ProviderMap';
import useDebounce from '../../hooks/useDebounce';
import Skeleton from '../../components/Skeleton';

const EXPERIENCES = [
  { label: 'Any Experience', value: 0 },
  { label: '1+ Years', value: 1 },
  { label: '3+ Years', value: 3 },
  { label: '5+ Years', value: 5 }
];

export default function Search() {
  const navigate = useNavigate();
  const { selectedProviders, toggleSelection } = useBooking();

  // Navigation State
  const [viewState, setViewState] = useState('categories'); // 'categories', 'subcategories', 'results'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  
  // Categories State
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Results State
  const [providers, setProviders] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [loading, setLoading] = useState(true);
  
  // Filter State
  const [filters, setFilters] = useState({
    keyword: '',
    state: '',
    district: '',
    city: '',
    minExperience: 0
  });

  const debouncedKeyword = useDebounce(filters.keyword, 500);
  const debouncedState = useDebounce(filters.state, 500);
  const debouncedDistrict = useDebounce(filters.district, 500);
  const debouncedCity = useDebounce(filters.city, 500);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/services/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (viewState !== 'results') return;

    const fetchProviders = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/search', {
          params: {
            keyword: debouncedKeyword,
            category: selectedSubcategory,
            state: debouncedState,
            district: debouncedDistrict,
            city: debouncedCity,
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
  }, [debouncedKeyword, debouncedState, debouncedDistrict, debouncedCity, filters.minExperience, selectedSubcategory, viewState]);

  const clearFilters = () => {
    setFilters({
      keyword: '',
      state: '',
      district: '',
      city: '',
      minExperience: 0
    });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setViewState('subcategories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setViewState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Categories View
  if (viewState === 'categories') {
    return (
      <div className="max-w-7xl mx-auto pb-12">
        <div className="text-center mb-12 mt-6">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">What service do you need?</h1>
          <p className="text-lg text-slate-500">Choose a category to find verified professionals near you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loadingCategories ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <Skeleton variant="avatar" className="mb-4" />
                <Skeleton variant="title" />
                <Skeleton variant="text" />
                <Skeleton variant="text" className="w-1/2" />
              </div>
            ))
          ) : (
            categories.map(category => {
              const IconComponent = LucideIcons[category.icon] || LucideIcons.Wrench;
              return (
                <button 
                  key={category.categoryId}
                  onClick={() => handleSelectCategory(category)}
                  className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-300 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-50/50 rounded-full group-hover:scale-[2] transition-transform duration-700 ease-in-out"></div>
                  <div className="relative z-10 w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="relative z-10 text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors leading-tight">{category.name}</h3>
                  <p className="relative z-10 text-sm text-slate-500 line-clamp-2 leading-relaxed">{category.description}</p>
                </button>
              )
            })
          )}
        </div>
      </div>
    );
  }

  // 2. Subcategories View
  if (viewState === 'subcategories') {
    return (
      <div className="max-w-5xl mx-auto pb-12">
        <button 
          onClick={() => setViewState('categories')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-semibold transition-colors px-4 py-2 hover:bg-indigo-50 rounded-lg w-fit"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Categories
        </button>
        
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 pb-8 border-b border-slate-100 relative z-10">
            <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
              {selectedCategory && (() => {
                const SelectedIcon = LucideIcons[selectedCategory.icon] || LucideIcons.Wrench;
                return <SelectedIcon className="w-10 h-10" />;
              })()}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{selectedCategory?.name}</h2>
              <p className="text-lg text-slate-500 mt-2 font-medium">Select a specific service</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {selectedCategory?.subcategories.map(sub => (
              <button
                key={sub}
                onClick={() => handleSelectSubcategory(sub)}
                className="px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-left hover:bg-white hover:border-indigo-300 hover:shadow-lg hover:text-indigo-700 font-semibold text-slate-700 transition-all flex justify-between items-center group active:scale-[0.98]"
              >
                <span className="pr-4">{sub}</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. Results View
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start pb-12">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex-shrink-0 md:sticky md:top-6">
        
        <button 
          onClick={() => setViewState('subcategories')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8 font-bold transition-colors bg-indigo-50 px-4 py-2.5 rounded-xl w-full justify-center hover:bg-indigo-100"
        >
          <ArrowLeft className="w-4 h-4" /> Change Service
        </button>

        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 tracking-tight">
            <SlidersHorizontal className="w-5 h-5 text-indigo-600" /> Filters
          </h2>
          {(filters.keyword || filters.state || filters.district || filters.city || filters.minExperience > 0) && (
            <button 
              onClick={clearFilters}
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Keyword Search */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Search Keyword</label>
            <div className="relative">
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="Name or keyword..." 
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                value={filters.keyword}
                onChange={e => setFilters({...filters, keyword: e.target.value})}
              />
              {filters.keyword && (
                 <button onClick={() => setFilters({...filters, keyword: ''})} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-md">
                   <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                 </button>
              )}
            </div>
          </div>

          {/* Location Filters */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 ml-1">Location Settings</h3>
            
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="State (e.g. Maharashtra)" 
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                value={filters.state}
                onChange={e => setFilters({...filters, state: e.target.value})}
              />
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="District (e.g. Pune)" 
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                value={filters.district}
                onChange={e => setFilters({...filters, district: e.target.value})}
              />
            </div>

            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                placeholder="City or Area" 
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                value={filters.city}
                onChange={e => setFilters({...filters, city: e.target.value})}
              />
            </div>
          </div>

          {/* Minimum Experience */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Minimum Experience</label>
            <div className="space-y-3 pl-1">
              {EXPERIENCES.map(exp => (
                <label 
                  key={exp.value} 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => setFilters({...filters, minExperience: exp.value})}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${filters.minExperience === exp.value ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white group-hover:border-indigo-400'}`}>
                    {filters.minExperience === exp.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={`text-sm ${filters.minExperience === exp.value ? 'text-slate-900 font-bold' : 'text-slate-600 font-medium group-hover:text-slate-900'}`}>
                    {exp.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4">
        <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {selectedSubcategory}
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              {providers.length} {providers.length === 1 ? 'Provider' : 'Providers'} Found
            </p>
          </div>
          <div className="bg-slate-100 p-1.5 rounded-xl flex border border-slate-200 shadow-inner w-fit">
            <button 
              onClick={() => setViewMode('list')}
              className={`px-5 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`px-5 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-all ${viewMode === 'map' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Map className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {/* Results Container */}
        {loading ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton variant="avatar" className="h-14 w-14" />
                  <div className="space-y-2 flex-1">
                    <Skeleton variant="title" className="h-6" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                </div>
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" className="w-1/2" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 flex-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <ProviderMap providers={providers} height="600px" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {providers.map(p => {
                  const isSelected = selectedProviders.includes(p._id);
                  return (
                    <div key={p._id} className={`p-6 bg-white rounded-[2rem] border transition-all duration-300 ${isSelected ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg scale-[1.02]' : 'hover:shadow-xl hover:-translate-y-1 border-slate-200 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            {p.profileImage?.url ? (
                              <img src={p.profileImage.url} alt={p.businessName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl">
                                {p.businessName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">{p.businessName}</h3>
                              {p.isVerifiedProfile && (
                                <div className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 uppercase tracking-wide">
                                  <BadgeCheck className="w-3 h-3" />
                                  Verified
                                </div>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-500">{p.ownerName}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-slate-700 leading-snug">
                            {p.address?.city ? `${p.address.city}, ${p.address.district}, ${p.address.state}` : p.location}
                          </p>
                        </div>
                        {p.experience > 0 && (
                           <div className="flex items-center gap-3">
                             <div className="w-4 h-4 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full shrink-0">
                               <span className="text-[10px] font-black">★</span> 
                             </div>
                             <p className="text-sm font-bold text-indigo-700">{p.experience} Years Experience</p>
                           </div>
                        )}
                        <p className="text-sm text-slate-600 line-clamp-2 mt-2 font-medium">
                          {p.description || "No description provided."}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => navigate(`/user/provider/${p._id}`)}
                          className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-[0.98]"
                        >
                          View Profile
                        </button>
                        <button 
                          onClick={() => toggleSelection(p._id)}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98] ${
                            isSelected 
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                          }`}
                        >
                          {isSelected ? 'Remove' : 'Select'}
                        </button>
                      </div>
                    </div>
                  )
                })}
                {providers.length === 0 && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500 bg-white rounded-[2rem] border border-slate-200 shadow-sm text-center px-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <SearchIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-xl font-extrabold text-slate-800 tracking-tight">No providers found</p>
                    <p className="text-base font-medium text-slate-500 mt-2 max-w-sm">We couldn't find any providers matching your current filters in this category.</p>
                    {(filters.keyword || filters.state || filters.district || filters.city || filters.minExperience > 0) && (
                      <button 
                        onClick={clearFilters}
                        className="mt-8 px-6 py-3 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all active:scale-95"
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