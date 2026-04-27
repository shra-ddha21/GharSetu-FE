import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

const ServicesHero = () => {
  return (
    <section className="relative pt-20 pb-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[60%] bg-purple-50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-bold tracking-wide uppercase border border-indigo-100 animate-bounce">
            <Briefcase className="w-4 h-4" /> Professional Network
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
            Our Premium <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Home Services</span>
          </h1>
          
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore our curated list of essential home services, delivered by verified professionals who prioritize your satisfaction and safety above all else.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-indigo-100 flex items-center justify-center overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Expert" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                +500
              </div>
            </div>
            <p className="text-sm font-bold text-slate-500">Trusted by 500+ Experts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
