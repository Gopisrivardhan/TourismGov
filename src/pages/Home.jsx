import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white">

            {/* NAVIGATION */}
            <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-6">
                <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-5 md:px-8 py-3 flex justify-between items-center shadow-2xl border border-white/20">
                    <div className="text-[#1A237E] text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                        <span className="hidden sm:block">TourismGov</span>
                        <span className="block sm:hidden">TourismGov</span>
                    </div>

                    <div className="hidden lg:flex gap-6 font-bold text-xs uppercase tracking-widest text-[#1A237E]">
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Cultural Events</a>
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Notifications</a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-4 py-2 md:px-6 md:py-2 text-[10px] md:text-xs rounded-full hover:bg-[#1A237E] shadow-md transition-all duration-300 hover:-translate-y-0.5 inline-block">
                            Login
                        </Link>
                        <Link to="/register" className="bg-[#1A237E] text-white font-bold uppercase tracking-widest px-4 py-2 md:px-6 md:py-2 text-[10px] md:text-xs rounded-full hover:bg-[#FF6D00] shadow-md transition-all duration-300 hover:-translate-y-0.5 inline-block">
                            Register
                        </Link>
                    </div>
                </nav>
            </div>

            {/* HEADER WITH VIDEO - Fixed Alignment & Sizing */}
            <header className="p-3 md:p-6 h-[85vh] min-h-[500px] max-h-[700px]">
                <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src="https://youtu.be/35npVaFGHMY?si=CL_MDgB2d2sWrH1v" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 via-[#1A237E]/40 to-transparent"></div>

                    {/* CHANGED: justify-center and pt-24 keeps it safely below the nav bar */}
                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24">

                        {/* CHANGED: Scaled down from 8rem to 6xl/7xl */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-white mb-4">
                            Incredible <br /> <span className="text-[#FF6D00]">India.</span>
                        </h1>

                        {/* CHANGED: Reduced text size from xl to base/lg */}
                        <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 max-w-2xl mb-8">
                            Experience vibrant heritage, book cultural events, and manage your journey through the official tourism portal.
                        </p>

                        {/* Search Bar - Scaled down */}
                        <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white/10 sm:bg-white/20 backdrop-blur-md rounded-3xl sm:rounded-full p-1.5 border border-white/20 shadow-xl gap-2 sm:gap-0">
                            <input
                                type="text"
                                placeholder="Search forts, festivals, states..."
                                className="flex-1 px-5 py-3 sm:px-6 sm:py-3 bg-white/20 sm:bg-transparent rounded-full sm:rounded-none border-none focus:outline-none text-sm md:text-base text-white placeholder-white/70 font-medium"
                            />
                            <button className="w-full sm:w-auto bg-white text-[#1A237E] px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#FF6D00] hover:text-white transition-colors">
                                Explore
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN DESTINATIONS GRID */}
            <main className="max-w-screen-2xl mx-auto px-4 md:px-6 py-16 lg:py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[#1A237E] leading-none">Featured<br />Destinations</h2>
                    <a href="#" className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest hover:text-[#FF6D00] transition-colors">
                        Explore Map <span className="text-lg md:text-xl">&rarr;</span>
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 lg:h-[500px]">

                    {/* Jaipur */}
                    <div className="lg:col-span-4 min-h-[300px] lg:min-h-0 relative rounded-[2rem] overflow-hidden group shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=800"
                            alt="Rajasthan"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent flex flex-col justify-end p-8">
                            <span className="bg-[#FF6D00] text-white self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Heritage</span>
                            <h3 className="text-3xl font-black text-white uppercase leading-none">Jaipur<br />Palaces</h3>
                        </div>
                    </div>

                    {/* Kerala & Camel Fair Stack */}
                    <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                        {/* Kerala Section */}
                        <div className="min-h-[200px] lg:min-h-0 flex-1 relative rounded-[2rem] overflow-hidden group shadow-xl">
                            <img
                                src="https://www.touracle.in/wp-content/uploads/2025/01/kerala.webp"
                                alt="Kerala"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Deep Green Gradient for Kerala */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004D40]/90 via-[#004D40]/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                                <h3 className="text-2xl font-black text-white uppercase leading-none">Kerala<br />Backwaters</h3>
                            </div>
                        </div>

                        {/* Pushkar Camel Fair Section */}
                        <div className="min-h-[200px] lg:min-h-0 flex-1 relative rounded-[2rem] overflow-hidden group shadow-xl">
                            {/* Working High-Quality Camel Image */}
                            <img
                                src="https://production-nuego-cms.blr1.digitaloceanspaces.com/static-contents/prod-v1/The_Spirit_of_Pushkar_Mela_shutterstock_566311246_750_X_450_px_b27b2ae0ab.webp"
                                alt="Pushkar Camel Fair"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Dark Pink/Blue Gradient Overlay for Text Legibility */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#880E4F]/95 via-[#880E4F]/40 to-transparent"></div>

                            {/* The Glow/Blur Effect */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FF6D00]/40 rounded-full blur-3xl z-0"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center text-white z-10">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">Upcoming Event</span>
                                <h3 className="text-2xl font-black uppercase leading-tight mb-4">Pushkar<br />Camel Fair</h3>

                                <button className="self-start bg-white text-[#D81B60] font-black uppercase tracking-widest text-[9px] px-5 py-2.5 rounded-full hover:bg-[#1A237E] hover:text-white transition-all duration-300 shadow-lg">
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Taj Mahal */}
                    <div className="lg:col-span-4 min-h-[300px] lg:min-h-0 relative rounded-t-[4rem] rounded-b-[2rem] md:rounded-t-[8rem] overflow-hidden group shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800"
                            alt="Taj Mahal"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/90 to-transparent flex flex-col justify-end p-8">
                            <span className="bg-white text-[#1A237E] self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Monument</span>
                            <h3 className="text-3xl font-black text-white uppercase leading-none">The Taj<br />Mahal</h3>
                        </div>
                    </div>

                </div>
            </main>

            {/* FOOTER */}
            <div className="px-4 md:px-6 pb-6">
                <footer className="max-w-screen-2xl mx-auto bg-[#1A237E] text-white rounded-[2rem] py-6 px-6 md:py-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
                    <div className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#FF6D00]"></span>
                        TourismGov
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6 font-bold text-[10px] md:text-xs uppercase tracking-widest opacity-80">
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Accessibility</a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;