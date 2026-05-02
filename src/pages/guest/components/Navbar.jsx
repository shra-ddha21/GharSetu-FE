import React, { useState, useRef, useEffect } from 'react';
import { Shield, Home, Menu, LogOut, User, ChevronDown, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Left section: Logo and Greeting */}
          <div className="flex items-center gap-6">
            <Link to="/home" className="flex items-center gap-2 cursor-pointer group">
              <div className="w-10 h-10 bg-indigo-600 outline outline-4 outline-indigo-50 rounded-xl flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">GharSetu</span>
            </Link>
          </div>

          {/* Center section: Navigation Links (Desktop) */}
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
            
            {user ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm transform group-hover:scale-105 transition-transform">
                    {user?.name ? user.name[0].toUpperCase() : (user?.businessName ? user.businessName[0].toUpperCase() : 'U')}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link 
                      to={`/${user.role}/dashboard`} 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { setIsDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 ml-2 bg-slate-900 hover:bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all duration-300">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              className="text-slate-600 hover:text-indigo-600 transition-colors mobile-toggle p-2 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        ref={mobileMenuRef}
        className={`md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-xl transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
      >
        <div className="px-4 space-y-1">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-50">
            {user ? (
              <div className="space-y-1">
                <Link 
                  to={`/${user.role}/dashboard`}
                  className="flex items-center gap-3 px-4 py-3 text-base font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  <User className="w-5 h-5" />
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="block w-full px-4 py-4 bg-indigo-600 text-white text-center font-bold rounded-2xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
