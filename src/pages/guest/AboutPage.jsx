import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutHero from './components/about/AboutHero';
import StatsSection from './components/about/StatsSection';
import WorkShowcase from './components/about/WorkShowcase';
import DetailedInfo from './components/about/DetailedInfo';

/**
 * AboutPage represents the modern "About Us" page.
 * It uses the same layout and design system as the GuestHomepage.
 */
const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Navbar />
      
      {/* Main Content Area with subtle fade-in animation */}
      <main className={`flex-1 flex flex-col transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <AboutHero />
        <StatsSection />
        <WorkShowcase />
        <DetailedInfo />
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
