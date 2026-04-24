import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import Services from './components/Services';
import ServicesInfo from './components/ServicesInfo';
import Reviews from './components/Reviews';
import Footer from './components/Footer';

/**
 * GuestHomepage represents the modern, responsive landing page.
 * It's structured cleanly and assembled with multiple reusable functional components.
 */
const GuestHomepage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
      <SearchBar />
      <Services />
      <ServicesInfo />
      <Reviews />
      <Footer />
    </div>
  );
};

export default GuestHomepage;
