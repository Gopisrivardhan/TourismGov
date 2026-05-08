import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <div className="absolute top-0 left-0 w-full z-50 p-6">
    <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 flex justify-between items-center shadow-2xl border border-white/20">
      <Link to="/" className="text-[#1A237E] text-3xl font-black tracking-tighter flex items-center gap-2">
        <span className="w-4 h-4 rounded-full bg-[#FF6D00]"></span>
        TourismGov
      </Link>
      <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-[#1A237E]">
        <a href="#" className="hover:text-[#FF6D00]">Heritage Sites</a>
        <a href="#" className="hover:text-[#FF6D00]">Cultural Events</a>
      </div>
      <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#1A237E] transition-all">
        Tourist Login
      </Link>
    </nav>
  </div>
);

export default Navbar;