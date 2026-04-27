import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBannerImg from '../../../assets/images/hero_banner.png';

const Hero = () => {
  return (
    <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Section: Text & CTA */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold tracking-wide uppercase mb-2 border border-indigo-100">
            <Star className="w-4 h-4 fill-indigo-500 text-indigo-500" /> Top Rated Platform
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Elevate Your <br className="hidden lg:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Home Experience</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Discover a seamless way to book verified professionals for all your home service needs. Reliable, fast, and secure.
          </p>
        </div>
        
        <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/services" className="group relative px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl overflow-hidden shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700"></div>
            <span className="flex items-center gap-2 relative z-10">
              Explore Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link to="/about" className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-all duration-300">
            Learn Our Story
          </Link>
        </div>
      </div>

      {/* Bottom Section: Hero Banner */}
      <div className="relative w-full h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
        <img 
          src={heroBannerImg} 
          alt="Modern Home Architecture" 
          className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-out"
        />
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent z-20">
          <div className="flex items-center gap-4 text-white">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold text-sm">Join 10,000+ satisfied customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
