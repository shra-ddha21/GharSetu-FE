import { useState, useEffect, useCallback } from 'react';
import {
  Wrench, Zap, PaintRoller, Hammer, Truck, Sparkles, HardHat, Layers,
  Scissors, Mountain, FileText, Compass, Layout, Sofa, Calculator,
  Droplets, Map, Drill, Bug, Camera, Waves, UtensilsCrossed, Grid,
  Settings, Package, Fence, Umbrella, ShoppingCart, Tractor, Sun,
  Building2, Boxes, Pipette, Shovel, Wind, Cpu, LayoutGrid, Brush,
  Blocks, Construction, TreePine, DoorOpen, Wrench as WrenchAlt,
  ChevronLeft, ChevronRight, SquareStack,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const servicesList = [
  { icon: HardHat,        title: 'General Labour',          description: 'Skilled daily wage workers for all types of general construction and site work.',          color: 'bg-slate-100 text-slate-600',    hover: 'group-hover:bg-slate-600 group-hover:text-white' },
  { icon: Building2,      title: 'Mason',                   description: 'Expert brick-laying and masonry work for walls, foundations, and structures.',             color: 'bg-orange-50 text-orange-600',   hover: 'group-hover:bg-orange-600 group-hover:text-white' },
  { icon: Layers,         title: 'Centering Labour',         description: 'Formwork and centering support for RCC slab and beam construction.',                      color: 'bg-amber-50 text-amber-600',     hover: 'group-hover:bg-amber-600 group-hover:text-white' },
  { icon: Wrench,         title: 'Plumber',                  description: 'Expert fixes for leaks, pipe installations, and all plumbing repairs.',                   color: 'bg-blue-50 text-blue-600',       hover: 'group-hover:bg-blue-600 group-hover:text-white' },
  { icon: Zap,            title: 'Electrician',              description: 'Safe and reliable electrical installations, wiring, and troubleshooting.',                 color: 'bg-yellow-50 text-yellow-600',   hover: 'group-hover:bg-yellow-600 group-hover:text-white' },
  { icon: PaintRoller,    title: 'Painter',                  description: 'Professional interior and exterior painting for a fresh, beautiful finish.',               color: 'bg-rose-50 text-rose-600',       hover: 'group-hover:bg-rose-600 group-hover:text-white' },
  { icon: Hammer,         title: 'Carpenter',                description: 'Custom woodworking, furniture repair, doors, windows, and cabinetry.',                    color: 'bg-wood-50 text-orange-700',     hover: 'group-hover:bg-orange-700 group-hover:text-white', colorClass: 'bg-orange-50 text-orange-700' },
  { icon: LayoutGrid,     title: 'Tile Fitting',             description: 'Precise floor, wall, and bathroom tile installation for any space.',                      color: 'bg-teal-50 text-teal-600',       hover: 'group-hover:bg-teal-600 group-hover:text-white' },
  { icon: Settings,       title: 'Fabricator',               description: 'Metal and steel fabrication for grills, gates, structures, and custom frames.',           color: 'bg-gray-100 text-gray-700',      hover: 'group-hover:bg-gray-700 group-hover:text-white' },
  { icon: Mountain,       title: 'Stone Work',               description: 'Natural stone cladding, stone masonry, and decorative stone work.',                       color: 'bg-stone-100 text-stone-600',    hover: 'group-hover:bg-stone-600 group-hover:text-white' },
  { icon: FileText,       title: 'Contractor',               description: 'End-to-end project management and contract execution for all construction needs.',         color: 'bg-indigo-50 text-indigo-600',   hover: 'group-hover:bg-indigo-600 group-hover:text-white' },
  { icon: Compass,        title: 'Architect',                description: 'Creative architectural design, planning, and building layout solutions.',                  color: 'bg-purple-50 text-purple-600',   hover: 'group-hover:bg-purple-600 group-hover:text-white' },
  { icon: Layout,         title: 'Structural Designer',      description: 'Structural analysis and engineering design for safe, durable buildings.',                  color: 'bg-cyan-50 text-cyan-600',       hover: 'group-hover:bg-cyan-600 group-hover:text-white' },
  { icon: Sofa,           title: 'Interior Designer',        description: 'Stunning interior design and decor planning to transform your living spaces.',             color: 'bg-pink-50 text-pink-600',       hover: 'group-hover:bg-pink-600 group-hover:text-white' },
  { icon: Calculator,     title: 'Estimation & Costing',     description: 'Detailed project cost estimation and material takeoffs for accurate budgeting.',           color: 'bg-green-50 text-green-600',     hover: 'group-hover:bg-green-600 group-hover:text-white' },
  { icon: Droplets,       title: 'Waterproofing',            description: 'Chemical and membrane-based waterproofing for roofs, bathrooms, and basements.',          color: 'bg-sky-50 text-sky-600',         hover: 'group-hover:bg-sky-600 group-hover:text-white' },
  { icon: Map,            title: 'Survey',                   description: 'Land measurement, topographic surveys, and boundary demarcation services.',                color: 'bg-lime-50 text-lime-600',       hover: 'group-hover:bg-lime-600 group-hover:text-white' },
  { icon: Drill,          title: 'Core Cutting',             description: 'Precision drilling through concrete slabs and walls for pipes and conduits.',              color: 'bg-red-50 text-red-600',         hover: 'group-hover:bg-red-600 group-hover:text-white' },
  { icon: Bug,            title: 'Pest Control',             description: 'Effective pest elimination and prevention for homes and commercial properties.',           color: 'bg-emerald-50 text-emerald-600', hover: 'group-hover:bg-emerald-600 group-hover:text-white' },
  { icon: Camera,         title: 'CCTV Services',            description: 'CCTV camera installation, configuration, and surveillance system setup.',                  color: 'bg-slate-100 text-slate-700',    hover: 'group-hover:bg-slate-700 group-hover:text-white' },
  { icon: Waves,          title: 'Borewell Service',         description: 'Borewell drilling, pump installation, and water source solutions.',                        color: 'bg-blue-100 text-blue-700',      hover: 'group-hover:bg-blue-700 group-hover:text-white' },
  { icon: UtensilsCrossed,title: 'Kitchen Services',         description: 'Modular kitchen design, installation, and full kitchen renovation services.',              color: 'bg-orange-50 text-orange-500',   hover: 'group-hover:bg-orange-500 group-hover:text-white' },
  { icon: Grid,           title: 'Ceiling',                  description: 'False ceiling, POP, gypsum board, and decorative ceiling installation.',                  color: 'bg-violet-50 text-violet-600',   hover: 'group-hover:bg-violet-600 group-hover:text-white' },
  { icon: WrenchAlt,      title: 'Repairing Services',       description: 'Comprehensive repair work for homes including appliances, furniture, and fixtures.',        color: 'bg-amber-50 text-amber-700',     hover: 'group-hover:bg-amber-700 group-hover:text-white' },
  { icon: Package,        title: 'Equipment Rent',           description: 'Construction equipment and tool rental for short or long-term project needs.',             color: 'bg-gray-50 text-gray-600',       hover: 'group-hover:bg-gray-600 group-hover:text-white' },
  { icon: Fence,          title: 'Railing Work',             description: 'Stainless steel, iron, and glass railing fabrication and installation.',                  color: 'bg-zinc-100 text-zinc-600',      hover: 'group-hover:bg-zinc-600 group-hover:text-white' },
  { icon: Umbrella,       title: 'Roofing',                  description: 'Roof construction, waterproofing, shingle fitting, and roof repair services.',             color: 'bg-sky-100 text-sky-700',        hover: 'group-hover:bg-sky-700 group-hover:text-white' },
  { icon: Sofa,           title: 'Furniture',                description: 'Custom furniture making, assembly, and premium furniture repair services.',                color: 'bg-brown-50 text-amber-800',     hover: 'group-hover:bg-amber-800 group-hover:text-white', colorClass: 'bg-amber-50 text-amber-800' },
  { icon: Tractor,        title: 'Earthmovers',              description: 'JCB, excavator, and earthmoving machinery for site levelling and excavation.',            color: 'bg-yellow-100 text-yellow-700',  hover: 'group-hover:bg-yellow-700 group-hover:text-white' },
  { icon: Sun,            title: 'Solar Services',           description: 'Solar panel installation, maintenance, and renewable energy solutions.',                   color: 'bg-yellow-50 text-yellow-500',   hover: 'group-hover:bg-yellow-500 group-hover:text-white' },
  { icon: Boxes,          title: 'Cement',                   description: 'Bulk cement supply from trusted brands for your construction projects.',                   color: 'bg-stone-50 text-stone-500',     hover: 'group-hover:bg-stone-500 group-hover:text-white' },
  { icon: Settings,       title: 'Steel',                    description: 'TMT bars, structural steel, and all steel materials for construction.',                   color: 'bg-slate-200 text-slate-700',    hover: 'group-hover:bg-slate-700 group-hover:text-white' },
  { icon: SquareStack,    title: 'Bricks',                   description: 'High-quality clay and fly-ash bricks for residential and commercial construction.',        color: 'bg-red-100 text-red-700',        hover: 'group-hover:bg-red-700 group-hover:text-white' },
  { icon: Wrench,         title: 'Plumbing',                 description: 'Complete plumbing supplies, pipes, fittings, and installation services.',                  color: 'bg-cyan-100 text-cyan-700',      hover: 'group-hover:bg-cyan-700 group-hover:text-white' },
  { icon: Mountain,       title: 'Aggregate',                description: 'Crushed stone, gravel, and aggregate supply for concrete and construction.',               color: 'bg-neutral-100 text-neutral-600',hover: 'group-hover:bg-neutral-600 group-hover:text-white' },
  { icon: Shovel,         title: 'Sand',                     description: 'River sand, M-sand, and construction sand supply for masonry and concrete.',               color: 'bg-sand-50 text-yellow-600',     hover: 'group-hover:bg-yellow-600 group-hover:text-white', colorClass: 'bg-yellow-50 text-yellow-600' },
  { icon: Zap,            title: 'Electrical',               description: 'Electrical wiring, panels, conduits, and all electrical supply materials.',               color: 'bg-amber-100 text-amber-700',    hover: 'group-hover:bg-amber-700 group-hover:text-white' },
  { icon: Cpu,            title: 'Hardware',                 description: 'Nuts, bolts, screws, anchors, and all hardware accessories for construction.',             color: 'bg-gray-200 text-gray-700',      hover: 'group-hover:bg-gray-700 group-hover:text-white' },
  { icon: LayoutGrid,     title: 'Tile/Paving Block',        description: 'Ceramic, vitrified, and paving block tiles for floors, walls, and outdoor areas.',        color: 'bg-teal-100 text-teal-700',      hover: 'group-hover:bg-teal-700 group-hover:text-white' },
  { icon: Brush,          title: 'Paint',                    description: 'Interior and exterior paint, primers, textures, and waterproof coatings.',                 color: 'bg-rose-100 text-rose-700',      hover: 'group-hover:bg-rose-700 group-hover:text-white' },
  { icon: Scissors,       title: 'Fabrication',              description: 'Metal fabrication for gates, grills, structural frames, and custom ironwork.',             color: 'bg-zinc-200 text-zinc-700',      hover: 'group-hover:bg-zinc-700 group-hover:text-white' },
  { icon: Blocks,         title: 'Concrete Articles',        description: 'Precast concrete products, hume pipes, blocks, and ready-made concrete items.',           color: 'bg-slate-100 text-slate-600',    hover: 'group-hover:bg-slate-600 group-hover:text-white' },
  { icon: Truck,          title: 'Murum & Construction Waste', description: 'Murum filling, debris removal, and construction waste management services.',            color: 'bg-orange-100 text-orange-700',  hover: 'group-hover:bg-orange-700 group-hover:text-white' },
  { icon: Layout,         title: 'Plywood/Laminate',         description: 'Premium plywood, laminates, and veneers for furniture and interior work.',                color: 'bg-amber-50 text-amber-600',     hover: 'group-hover:bg-amber-600 group-hover:text-white' },
  { icon: Droplets,       title: 'Chemical/Adhesive',        description: 'Construction chemicals, bonding agents, sealants, and adhesives.',                        color: 'bg-purple-100 text-purple-700',  hover: 'group-hover:bg-purple-700 group-hover:text-white' },
  { icon: Sparkles,       title: 'Home Decor',               description: 'Decorative accessories, furnishings, and styling to beautify your home.',                  color: 'bg-pink-100 text-pink-700',      hover: 'group-hover:bg-pink-700 group-hover:text-white' },
  { icon: TreePine,       title: 'Nursery',                  description: 'Plants, trees, garden supplies, and landscaping for outdoor green spaces.',                color: 'bg-green-100 text-green-700',    hover: 'group-hover:bg-green-700 group-hover:text-white' },
  { icon: DoorOpen,       title: 'Doors & Windows',          description: 'Wooden, UPVC, and aluminium doors and windows supply and installation.',                  color: 'bg-indigo-100 text-indigo-700',  hover: 'group-hover:bg-indigo-700 group-hover:text-white' },
  { icon: Construction,   title: 'Tools & Machinery',        description: 'Power tools, hand tools, and construction machinery for professional use.',               color: 'bg-red-100 text-red-600',        hover: 'group-hover:bg-red-600 group-hover:text-white' },
];

const CARDS_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(servicesList.length / CARDS_PER_PAGE);

const Services = ({ searchQuery = '', isLoggedIn = false }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goToPage = useCallback((nextPage, dir = 'next') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage(nextPage);
      setAnimating(false);
    }, 350);
  }, [animating]);

  const handleNext = useCallback(() => {
    goToPage((currentPage + 1) % TOTAL_PAGES, 'next');
  }, [currentPage, goToPage]);

  const handlePrev = useCallback(() => {
    goToPage((currentPage - 1 + TOTAL_PAGES) % TOTAL_PAGES, 'prev');
  }, [currentPage, goToPage]);

  // Auto-slide every 5s
  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const handleBookNow = (serviceTitle) => {
    if (!isLoggedIn) {
      toast('Please login to book a service', { icon: '🔑' });
      navigate('/login');
    } else {
      navigate('/user/book', { state: { service: serviceTitle } });
    }
  };

  const filteredServices = servicesList.filter(service => {
    const sQuery = (searchQuery || '').toLowerCase();
    return (
      service.title.toLowerCase().includes(sQuery) ||
      service.description.toLowerCase().includes(sQuery)
    );
  });

  // If search is active, show all matching results without pagination
  const isSearching = searchQuery && searchQuery.trim().length > 0;
  const displayedServices = isSearching
    ? filteredServices
    : servicesList.slice(currentPage * CARDS_PER_PAGE, (currentPage + 1) * CARDS_PER_PAGE);

  return (
    <section id="services" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-widest text-indigo-600 uppercase mb-3">What We Offer</h2>
          <h3 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Our Essential Services</h3>
          <p className="mt-4 text-lg text-slate-600">
            {isSearching && filteredServices.length === 0
              ? 'No services found matching your search. Please try different terms.'
              : 'We connect you with skilled professionals across 48+ services for every construction and home need.'}
          </p>
        </div>

        {/* Grid with slide animation */}
        <div className="relative">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-350"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating
                ? `translateX(${direction === 'next' ? '-40px' : '40px'})`
                : 'translateX(0)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {displayedServices.map((service, index) => {
              const Icon = service.icon;
              const colorClass = service.colorClass || service.color;
              return (
                <div
                  key={`${currentPage}-${index}`}
                  onClick={() => handleBookNow(service.title)}
                  className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 cursor-pointer flex flex-col"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorClass} ${service.hover}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h4>
                  <p className="text-slate-600 leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex justify-end">
                    <div className="flex items-center text-indigo-600 font-bold text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      Book Now →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation — only when not searching */}
        {!isSearching && (
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
              aria-label="Previous services"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i, i > currentPage ? 'next' : 'prev')}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentPage
                      ? 'w-6 h-2.5 bg-indigo-600'
                      : 'w-2.5 h-2.5 bg-slate-300 hover:bg-indigo-300'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-300"
              aria-label="Next services"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}



      </div>
    </section>
  );
};

export default Services;
