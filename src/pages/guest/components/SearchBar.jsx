import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onSearch, onButtonClick }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearchClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    if (onSearch) {
      onSearch({ query, location });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto -mt-8 mb-16 relative z-30 px-4 sm:px-0 md:px-8 lg:px-12">
      <div className="bg-white rounded-[2rem] p-3 shadow-2xl shadow-indigo-100/50 border border-slate-100 flex flex-col md:flex-row items-center gap-2">
        
        {/* Search Input */}
        <div className="flex-1 flex items-center px-4 py-3 w-full border-b md:border-b-0 md:border-r border-slate-100 relative group">
          <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="What are you looking for?" 
            className="w-full pl-3 pr-4 py-1 text-slate-700 outline-none placeholder:text-slate-400 bg-transparent font-medium"
            value={query}
            onChange={(e) => {
              const newQuery = e.target.value;
              setQuery(newQuery);
              if (onSearch) onSearch({ query: newQuery, location });
            }}
          />
        </div>

        {/* Location Input */}
        <div className="flex-1 flex items-center px-4 py-3 w-full relative group">
          <MapPin className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Location" 
            className="w-full pl-3 pr-4 py-1 text-slate-700 outline-none placeholder:text-slate-400 bg-transparent font-medium"
            value={location}
            onChange={(e) => {
              const newLocation = e.target.value;
              setLocation(newLocation);
              if (onSearch) onSearch({ query, location: newLocation });
            }}
          />
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearchClick}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 md:mt-0 flex-shrink-0"
        >
          <Search className="w-5 h-5" /> Search
        </button>
        
      </div>
    </div>
  );
};

export default SearchBar;
