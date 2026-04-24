import React from 'react';
import heroBannerImg from '../../../../assets/images/hero_banner.png';

const AboutHero = () => {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-10">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-2 border border-indigo-100">
            Our Story
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Us</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed pt-2">
            We are on a mission to revolutionize home services by connecting homeowners with vetted, reliable professionals. Delivering excellence, one home at a time.
          </p>
        </div>
        
        <div className="flex-1 relative w-full h-[300px] lg:h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
          <img 
            src={heroBannerImg} 
            alt="About GharSetu" 
            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-x-0 bottom-0 py-8 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-20"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
