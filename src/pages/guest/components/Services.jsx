import React from 'react';
import { Sparkles, Wrench, Zap, PaintRoller, Hammer, Truck } from 'lucide-react';

const servicesList = [
  {
    icon: Sparkles,
    title: 'Deep Cleaning',
    description: 'Comprehensive house cleaning services for a sparkling home environment.',
    color: 'bg-emerald-50 text-emerald-600',
    hover: 'group-hover:bg-emerald-600 group-hover:text-white',
  },
  {
    icon: Wrench,
    title: 'Plumbing',
    description: 'Expert fixes for leaks, installations, and general plumbing repairs.',
    color: 'bg-blue-50 text-blue-600',
    hover: 'group-hover:bg-blue-600 group-hover:text-white',
  },
  {
    icon: Zap,
    title: 'Electrical',
    description: 'Safe and reliable electrical installations and troubleshooting.',
    color: 'bg-amber-50 text-amber-600',
    hover: 'group-hover:bg-amber-600 group-hover:text-white',
  },
  {
    icon: PaintRoller,
    title: 'Painting',
    description: 'Professional interior and exterior painting for a fresh new look.',
    color: 'bg-rose-50 text-rose-600',
    hover: 'group-hover:bg-rose-600 group-hover:text-white',
  },
  {
    icon: Hammer,
    title: 'Carpentry',
    description: 'Custom woodworking, furniture repair, and cabinetry solutions.',
    color: 'bg-orange-50 text-orange-600',
    hover: 'group-hover:bg-orange-600 group-hover:text-white',
  },
  {
    icon: Truck,
    title: 'Moving Services',
    description: 'Hassle-free relocation and packing services you can trust.',
    color: 'bg-indigo-50 text-indigo-600',
    hover: 'group-hover:bg-indigo-600 group-hover:text-white',
  }
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">What We Offer</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Our Essential Services</h3>
          <p className="mt-4 text-lg text-slate-600">
            We provide top-tier home services with vetted professionals to ensure quality, safety, and peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${service.color} ${service.hover}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {service.title}
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-4 group-hover:translate-x-0 duration-300">
                  Book Now →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
