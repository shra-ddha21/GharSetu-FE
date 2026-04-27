import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesInfo = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Text */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase">Why Choose Us</h2>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
              Premium Services <br/> For A Better Life
            </h3>
          </div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Our platform connects you with the most reliable and skilled professionals in your area. Every service provider is strictly vetted to guarantee a safe, seamless, and high-quality experience. We handle the hard work so you can relax.
          </p>
          
          <ul className="space-y-4 mt-6">
            {['100% Satisfaction Guarantee', 'Verified Professionals', 'Transparent Pricing', '24/7 Customer Support'].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-700 font-medium text-lg">{feature}</span>
              </li>
            ))}
          </ul>
          
          <Link to="/about" className="inline-block mt-4 px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
            Read Our Story
          </Link>
        </div>

        {/* Right Side: Overlapping Circular Design Elements */}
        <div className="flex-1 relative w-full h-[500px] flex items-center justify-center">
          {/* Decorative background circle */}
          <div className="absolute inset-0 bg-indigo-50 rounded-full transform scale-90 -z-10"></div>
          
          {/* Main big circle */}
          <div className="relative w-72 h-72 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl z-10 animate-[bounce_6s_infinite]">
            <div className="text-center text-white px-6">
              <span className="block text-5xl font-black mb-2">5+</span>
              <span className="text-lg font-medium opacity-90">Years Experience</span>
            </div>
          </div>

          {/* Overlapping small circle 1 */}
          <div className="absolute top-12 left-8 w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center p-6 text-center z-20 border border-slate-100">
            <div>
              <span className="block text-3xl font-extrabold text-slate-900 mb-1">10k+</span>
              <span className="text-sm font-semibold text-slate-500">Happy Users</span>
            </div>
          </div>

          {/* Overlapping small circle 2 */}
          <div className="absolute bottom-12 right-8 w-52 h-52 rounded-full bg-white shadow-xl flex items-center justify-center p-6 text-center border-4 border-indigo-50 z-20">
            <div>
              <span className="block text-3xl font-extrabold text-emerald-500 mb-1">99%</span>
              <span className="text-sm font-semibold text-slate-500">Positive Ratings</span>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ServicesInfo;
