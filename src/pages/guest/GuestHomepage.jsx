import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import Services from './components/Services';
import ServicesInfo from './components/ServicesInfo';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import { useAuth } from '../../contexts/AuthContext';

/**
 * GuestHomepage represents the modern, responsive landing page.
 * It's structured cleanly and assembled with multiple reusable functional components.
 */
const GuestHomepage = () => {
  const { user } = useAuth();
  const [searchFilters, setSearchFilters] = useState({ query: '', location: '' });

  const handleSearch = (filters) => {
    setSearchFilters(filters);
  };

  const handleButtonClick = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
      <Services 
        searchQuery={searchFilters.query} 
        locationQuery={searchFilters.location} 
        isLoggedIn={!!user}
      />
      <ServicesInfo />
      <Reviews />
      <Footer />
    </div>
  );
};

export default GuestHomepage;
