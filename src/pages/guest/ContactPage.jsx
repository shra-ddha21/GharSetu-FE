import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactHero from './components/contact/ContactHero';
import ContactContent from './components/contact/ContactContent';
import SocialSection from './components/contact/SocialSection';

/**
 * ContactPage represents the modern, responsive "Contact Us" page.
 * It strictly follows the guest homepage design system.
 */
const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <ContactHero />
        <ContactContent />
        <SocialSection />
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
