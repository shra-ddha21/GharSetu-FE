import React from 'react';
import { Home, MessageCircle, Share2, Globe, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer w-max">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">GharSetu</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted partner for finding reliable, verified home services. We bridge the gap between quality professionals and your home needs.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {[MessageCircle, Share2, Globe, Mail].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/home' },
                { name: 'About', path: '/about' },
                { name: 'Services', path: '/services' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-600"></span> {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Legal & Policy</h4>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm font-medium flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-indigo-600"></span> {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">Subscribe</h4>
            <p className="text-sm text-slate-400 mb-4">Join our newsletter to get latest updates and offers.</p>
            <div className="flex rounded-xl overflow-hidden focus-within:ring-2 ring-indigo-500 bg-slate-900">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full px-4 py-3 bg-transparent outline-none text-white placeholder:text-slate-600 text-sm"
              />
              <button className="bg-indigo-600 px-4 hover:bg-indigo-700 transition-colors text-white flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} GharSetu. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">English (US)</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
