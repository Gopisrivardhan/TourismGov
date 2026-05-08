import React from 'react';
import { Link } from 'react-router-dom';

const TouristLogin = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION (Matching the Home Page Aesthetic) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#FF6D00]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl"></div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(26,35,126,0.2)] border border-white p-8 md:p-12 relative z-10">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-10">
          <div className="text-[#1A237E] text-2xl font-black tracking-tighter flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
            TourismGov
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter text-[#1A237E]">Welcome Back</h2>
          <p className="text-[#1A237E]/60 font-bold text-xs uppercase tracking-widest mt-2">Enter your details to travel</p>
        </div>

        {/* FORM */}
        <form className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-2 ml-4">
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full px-8 py-4 bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E] placeholder-[#1A237E]/30"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#1A237E] mb-2 ml-4">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-8 py-4 bg-[#F8F9FF] border-2 border-transparent rounded-full focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium text-[#1A237E] placeholder-[#1A237E]/30"
            />
          </div>

          <div className="flex justify-end px-4">
            <a href="#" className="text-xs font-bold uppercase tracking-widest text-[#FF6D00] hover:text-[#1A237E] transition-colors">
              Forgot Password?
            </a>
          </div>

          <button className="w-1/3 block mx-auto bg-[#1A237E] text-white font-black uppercase tracking-[0.2em] py-3 rounded-full hover:bg-[#FF6D00] shadow-xl transition-all duration-300 hover:-translate-y-1">
            Sign In
          </button>
        </form>

        {/* FOOTER OF CARD */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm font-bold text-[#1A237E]/50 uppercase tracking-widest">
            Don't have an account? 
            <Link to="/register" className="ml-2 text-[#FF6D00] hover:text-[#1A237E] transition-colors hover:underline">Register</Link>
          </p>
        </div>
      </div>

      {/* FLOATING DECORATIVE ELEMENT (Matching the Arch/Pill theme) */}
      <div className="hidden lg:block absolute bottom-20 right-20 w-32 h-64 border-t-[60px] border-r-[60px] border-[#FF6D00]/10 rounded-tr-[10rem]"></div>
      <div className="hidden lg:block absolute top-20 left-20 w-32 h-64 border-b-[60px] border-l-[60px] border-[#1A237E]/10 rounded-bl-[10rem]"></div>
    </div>
  );
};

export default TouristLogin;