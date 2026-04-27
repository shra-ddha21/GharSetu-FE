import React from 'react';
import { Award, Users, ShieldCheck } from 'lucide-react';

const statsData = [
  {
    icon: Award,
    title: '5+ Years',
    description: 'Industry experience delivering top-tier home services with certified excellence.',
    color: 'bg-emerald-50 text-emerald-600',
    hover: 'group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    icon: Users,
    title: '10,000+',
    description: 'Satisfied customers who continuously trust us with their everyday home needs.',
    color: 'bg-blue-50 text-blue-600',
    hover: 'group-hover:bg-blue-600 group-hover:text-white',
  },
  {
    icon: ShieldCheck,
    title: '100+ Services',
    description: 'Comprehensive, vetted solutions ranging from simple plumbing to full renovations.',
    color: 'bg-indigo-50 text-indigo-600',
    hover: 'group-hover:bg-indigo-600 group-hover:text-white',
  }
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col items-center text-center cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-colors duration-300 ${stat.color} ${stat.hover}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {stat.title}
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {stat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
