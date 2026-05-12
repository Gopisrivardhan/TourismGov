import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 

const Home = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // LOGIC: Check if user is logged in to update the Navbar UI
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white">

            {/* UPDATED: Passing isLoggedIn to Navbar so it shows Dashboard/Reports/Bell */}
            <Navbar isLoggedIn={isLoggedIn} />

            {/* HEADER WITH VIDEO */}
            <header className="p-3 md:p-6 h-[85vh] min-h-[500px] max-h-[700px]">
                <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    >
                        {/* NOTE: Replaced YouTube link with a direct MP4 link. 
                            YouTube links only work in <iframe>, not <video> tags. */}
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-taj-mahal-in-india-4067-large.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E]/95 via-[#1A237E]/40 to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.95] tracking-tighter text-white mb-4">
                            Incredible <br /> <span className="text-[#FF6D00]">India.</span>
                        </h1>

                        <p className="text-sm sm:text-base md:text-lg font-medium text-white/90 max-w-2xl mb-8">
                            Experience vibrant heritage, book cultural events, and manage your journey through the official tourism portal.
                        </p>

                        <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white/10 sm:bg-white/20 backdrop-blur-md rounded-3xl sm:rounded-full p-1.5 border border-white/20 shadow-xl gap-2 sm:gap-0">
                            <input
                                type="text"
                                placeholder="Search forts, festivals, states..."
                                className="flex-1 px-5 py-3 sm:px-6 sm:py-3 bg-transparent border-none focus:outline-none text-sm md:text-base text-white placeholder-white/70 font-medium"
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4 text-[#1A237E]">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">Featured<br />Destinations</h2>
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
                        <div className="min-h-[200px] lg:min-h-0 flex-1 relative rounded-[2rem] overflow-hidden group shadow-xl">
                            <img
                                src="https://www.touracle.in/wp-content/uploads/2025/01/kerala.webp"
                                alt="Kerala"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#004D40]/90 via-[#004D40]/20 to-transparent flex flex-col justify-end p-6 md:p-8">
                                <h3 className="text-2xl font-black text-white uppercase leading-none">Kerala<br />Backwaters</h3>
                            </div>
                        </div>

                        <div className="min-h-[200px] lg:min-h-0 flex-1 relative rounded-[2rem] overflow-hidden group shadow-xl">
                            <img
                                src="https://production-nuego-cms.blr1.digitaloceanspaces.com/static-contents/prod-v1/The_Spirit_of_Pushkar_Mela_shutterstock_566311246_750_X_450_px_b27b2ae0ab.webp"
                                alt="Pushkar Camel Fair"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#880E4F]/95 via-[#880E4F]/40 to-transparent"></div>
                            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-center text-white">
                                <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-1">Upcoming Event</span>
                                <h3 className="text-2xl font-black uppercase leading-tight mb-4">Pushkar<br />Camel Fair</h3>
                                <button className="self-start bg-white text-[#D81B60] font-black uppercase tracking-widest text-[9px] px-5 py-2.5 rounded-full hover:bg-[#1A237E] hover:text-white transition-all shadow-lg">
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

            <Footer />
            
        </div>
    );
};

export default Home;