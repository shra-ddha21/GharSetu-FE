import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, isLoading, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={`group relative w-full flex justify-center items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl overflow-hidden shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-indigo-600/20 ${className}`}
    >
      <div className="absolute inset-0 w-1/4 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700"></div>
      <span className="relative z-10 flex items-center gap-2">
        {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
        {children}
      </span>
    </button>
  );
};

export default Button;
