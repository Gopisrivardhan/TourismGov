import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="absolute top-0 left-0 w-full z-50 p-6">
    <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 flex justify-between items-center shadow-2xl border border-white/20">
      
      {/* LOGO */}
      <Link to="/" className="text-[#1A237E] text-3xl font-black tracking-tighter flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#FF6D00]"></span>
        TourismGov
      </Link>

      {/* NAV LINKS */}
      <div className="hidden lg:flex gap-8 font-bold text-sm uppercase tracking-widest text-[#1A237E]">
        <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
        <a href="#" className="hover:text-[#FF6D00] transition-colors">Cultural Events</a>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex items-center gap-4">
        <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-11 py-3 rounded-full hover:bg-[#1A237E] transition-all text-xs">
          Login
        </Link>
        <Link to="/register" className="bg-[#1A237E] text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#FF6D00] transition-all text-xs">
          Register
        </Link>
      </div>
      
    </nav>
  </div>
);

export default Navbar;