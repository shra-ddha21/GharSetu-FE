import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import Services from './components/Services';
import ServicesHero from './components/services/ServicesHero';

const ServicesPage = () => {
  const [searchFilters, setSearchFilters] = useState({ query: '', location: '' });

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main>
        {/* Modern Hero Section */}
        <ServicesHero />
        
        {/* Search Bar section from Home */}
        <div className="relative z-20">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        {/* List of Service Cards */}
        <div className="mt-8">
            <Services searchQuery={searchFilters.query} locationQuery={searchFilters.location} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServicesPage;
