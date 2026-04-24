import React from 'react';
import { Shield, Home, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Left section: Logo and Greeting */}
          <div className="flex items-center gap-6">
            <Link to="/home" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-indigo-600 outline outline-4 outline-indigo-50 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">GharSetu</span>
            </Link>
            <div className="hidden md:flex items-center pl-6 border-l border-slate-200">
              <span className="text-sm font-medium text-slate-500">Hi, <span className="text-slate-800 font-semibold">Guest</span> &mdash; Welcome!</span>
            </div>
          </div>

          {/* Right section: Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.name}
              </Link>
            ))}
            <Link to="/login" className="px-5 py-2.5 ml-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300">
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-slate-600 hover:text-indigo-600 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
