import React from 'react';

const WorkShowcase = () => {
  
  // Infrastructure images via Unsplash
  const images = {
    img1: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop", // Modern Skyscraper
    img2: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1000&auto=format&fit=crop", // Suspension Bridge
    img3: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop", // Modern House Exterior
    img4: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop"  // Architectural Building
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">Quality Work</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 md:text-5xl">A Glimpse of Our Portfolio</h3>
        </div>
        
        {/* CSS Grid for Mobile and Desktop Masonry */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:auto-rows-[180px] gap-6">
          
          {/* Image 2 (Top Left) */}
          <div className="md:col-start-1 md:row-start-1 md:col-span-1 md:row-span-2 overflow-hidden rounded-2xl shadow-md relative group h-64 md:h-auto">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            <img 
              src={images.img2} 
              alt="Bridge Infrastructure" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>
          
          {/* Image 4 (Bottom Left) */}
          <div className="md:col-start-1 md:row-start-3 md:col-span-1 md:row-span-2 overflow-hidden rounded-2xl shadow-md relative group h-64 md:h-auto">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            <img 
              src={images.img4} 
              alt="Architectural Building" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>

          {/* Image 1 (Top Right) */}
          <div className="md:col-start-2 md:row-start-1 md:col-span-1 md:row-span-1 overflow-hidden rounded-2xl shadow-md relative group h-64 md:h-auto">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            <img 
              src={images.img1} 
              alt="Modern Skyscraper" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>

          {/* Image 3 (Bottom Right, Larger) */}
          <div className="md:col-start-2 md:row-start-2 md:col-span-1 md:row-span-3 overflow-hidden rounded-2xl shadow-md relative group h-[400px] md:h-auto">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
            <img 
              src={images.img3} 
              alt="Modern House Exterior" 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default WorkShowcase;
