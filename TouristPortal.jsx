import React from 'react';

const TouristPortal = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white">
      
      {/* 1. FLOATING NAVIGATION */}
      <div className="absolute top-0 left-0 w-full z-50 p-6">
        <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 flex justify-between items-center shadow-2xl border border-white/20">
          <div className="text-[#1A237E] text-3xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#FF6D00]"></span>
            TourismGov
          </div>
          <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest text-[#1A237E]">
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Cultural Events</a>
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Notifications</a>
          </div>
          <button className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-[#1A237E] shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            Tourist Login
          </button>
        </nav>
      </div>

      {/* 2. MEDIA-HEAVY HERO SECTION (Video Background) */}
      <header className="p-4 md:p-6 h-screen min-h-[800px]">
        <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl">
          
          {/* Background Video Element */}
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          >
            {/* Using a generic nature/travel placeholder video */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-timelapse-of-a-beautiful-sunset-over-a-city-4145-large.mp4" type="video/mp4" />
          </video>

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 via-[#1A237E]/40 to-transparent"></div>

          {/* Hero Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-10 md:p-20">
            <h1 className="text-6xl md:text-[8rem] font-black uppercase leading-[0.85] tracking-tighter text-white mb-6">
              Incredible <br /> <span className="text-[#FF6D00]">India.</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/90 max-w-2xl mb-12">
              Experience vibrant heritage, book cultural events, and manage your journey through the official tourism portal.
            </p>

            {/* Glassmorphism Search Bar */}
            <div className="flex w-full max-w-3xl bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30 shadow-2xl">
              <input 
                type="text" 
                placeholder="Search forts, festivals, states..." 
                className="flex-1 px-8 py-4 bg-transparent border-none focus:outline-none text-xl text-white placeholder-white/70 font-medium"
              />
              <button className="bg-white text-[#1A237E] px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#FF6D00] hover:text-white transition-colors">
                Explore
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. EDITORIAL IMAGE GRID (Pill & Arch Masks) */}
      <main className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#1A237E]">Featured<br/>Destinations</h2>
          <a href="#" className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest hover:text-[#FF6D00] transition-colors">
            Explore Map <span className="text-2xl">&rarr;</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-auto md:h-[600px]">
          
          {/* Large Vertical Pill Image (Rajasthan) */}
          <div className="col-span-1 md:col-span-4 relative rounded-[4rem] overflow-hidden group shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800" 
              alt="Rajasthan" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent flex flex-col justify-end p-10">
              <span className="bg-[#FF6D00] text-white self-start px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Heritage</span>
              <h3 className="text-4xl font-black text-white uppercase leading-none">Jaipur<br/>Palaces</h3>
            </div>
          </div>

          {/* Center Column - Split Images */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-8">
            {/* Top Square (Kerala) */}
            <div className="flex-1 relative rounded-[3rem] overflow-hidden group shadow-xl">
              <img 
                src="https://www.keralatourism.org/_next/image/?url=http%3A%2F%2F127.0.0.1%2Fktadmin%2Fimg%2Fpages%2Flarge-desktop%2Fyakshagana-pavakkoothu-unveiled-1742477263_75d8d7e4a69b31eaecf1.webp&w=1920&q=75" 
                alt="Kerala" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00695C]/90 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-3xl font-black text-white uppercase leading-none">Kerala<br/>Backwaters</h3>
              </div>
            </div>
            {/* Bottom Color Block Info Card */}
            <div className="flex-1 bg-[#D81B60] rounded-[3rem] p-8 flex flex-col justify-center text-white shadow-xl relative overflow-hidden">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
               <span className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Upcoming Event</span>
               <h3 className="text-3xl font-black uppercase leading-tight mb-4">Pushkar Camel Fair</h3>
               <button className="self-start mt-4 bg-white text-[#D81B60] font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#1A237E] hover:text-white transition-colors">
                 Book Now
               </button>
            </div>
          </div>

          {/* Large Arch Image (Taj Mahal) */}
          <div className="col-span-1 md:col-span-4 relative rounded-t-[10rem] rounded-b-[2rem] overflow-hidden group shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800" 
              alt="Taj Mahal" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent flex flex-col justify-end p-10">
              <span className="bg-white text-[#1A237E] self-start px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Monument</span>
              <h3 className="text-4xl font-black text-white uppercase leading-none">The Taj<br/>Mahal</h3>
            </div>
          </div>

        </div>
      </main>

      {/* 4. FOOTER (Pill Shaped) */}
      <div className="px-6 pb-6">
        <footer className="max-w-screen-2xl mx-auto bg-[#1A237E] text-white rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl">
          <div className="text-5xl md:text-7xl font-black uppercase tracking-tighter flex items-center gap-4">
            <span className="w-8 h-8 rounded-full bg-[#FF6D00]"></span>
            TourismGov
          </div>
          <div className="flex gap-6 font-bold text-sm uppercase tracking-widest opacity-80">
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#FF6D00] transition-colors">Accessibility</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TouristPortal; 