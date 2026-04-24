import React from 'react';

const DetailedInfo = () => {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl leading-tight">
                Detailed Information about <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Our Mission</span>
              </h2>
              <div className="w-20 h-1.5 bg-indigo-600 rounded-full"></div>
            </div>
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                GharSetu was founded with a singular driving vision: to make discovering and booking reliable home service professionals as effortless as calling a friend. Our platform curates a vast network of vetted experts across dozens of categories.
              </p>
              <p>
                We intensely understand the anxiety of letting a stranger into your home. That&apos;s precisely why every professional on our platform undergoes rigorous, multi-tiered background checks and continuous performance peer-reviews, ensuring you receive nothing but excellence and complete peace of mind.
              </p>
            </div>
            
            <button className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-indigo-600 shadow-xl shadow-slate-900/10 hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300">
              Join Our Network
            </button>
          </div>
          
          {/* Right Image/Illustration Column */}
          <div className="flex-1 w-full relative group">
            {/* Decorative Background Element */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 group-hover:scale-110 transition-transform duration-700"></div>
             
             <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
               <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
               <img 
                 src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" 
                 alt="Our Mission in Action" 
                 className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-700 ease-out relative z-0" 
               />
             </div>
             
             {/* Floating Info Badge */}
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-20 group-hover:-translate-y-2 transition-transform duration-300">
               <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                 ✓
               </div>
               <div>
                  <p className="font-bold text-slate-900">100% Guaranteed</p>
                  <p className="text-sm text-slate-500">Satisfaction on every job.</p>
               </div>
             </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default DetailedInfo;
