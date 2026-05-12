import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TouristPrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetching public programs
        axios.get('http://localhost:8080/tourismgov/v1/programs')
            .then(res => {
                // Tourists should ideally only see ACTIVE or PLANNED programs
                const publicPrograms = res.data.filter(p => p.status === 'ACTIVE' || p.status === 'PLANNED');
                setPrograms(publicPrograms);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching programs:", err);
                setLoading(false);
                // Mock fallback for UI testing
                setPrograms([
                    { programId: 1, title: 'Incredible India Campaign 2026', description: 'A nationwide cultural heritage promotion.', startDate: '2026-06-01', status: 'ACTIVE' },
                    { programId: 2, title: 'Heritage Conservation Drive', description: 'Restoring monuments across Rajasthan.', startDate: '2026-08-15', status: 'PLANNED' }
                ]);
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white">
            {/* NAVIGATION BAR */}
            <nav className="p-4 md:p-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-5 md:px-8 py-3 flex justify-between items-center shadow-xl border border-[#1A237E]/10">
                    <Link to="/" className="text-[#1A237E] text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                        TourismGov
                    </Link>
                    <div className="font-bold text-xs uppercase tracking-widest text-[#1A237E]">
                        Government Initiatives
                    </div>
                </div>
            </nav>

            <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A237E] leading-none mb-4">
                        Tourism <br/><span className="text-[#FF6D00]">Programs</span>
                    </h1>
                    <p className="font-medium opacity-80 max-w-xl mx-auto">
                        Discover the national campaigns, conservation drives, and festivals sponsored by the Ministry of Tourism.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center font-bold text-[#FF6D00] uppercase tracking-widest">Loading Initiatives...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {programs.map((prog) => (
                            <div key={prog.programId} className="bg-white rounded-[2rem] p-8 shadow-xl border border-[#1A237E]/5 hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${prog.status === 'ACTIVE' ? 'bg-[#004D40]/10 text-[#004D40]' : 'bg-[#FF6D00]/10 text-[#FF6D00]'}`}>
                                        {prog.status}
                                    </span>
                                    <span className="font-bold text-xs uppercase tracking-widest opacity-50">Starts: {prog.startDate}</span>
                                </div>
                                <h3 className="text-3xl font-black uppercase leading-tight mb-4 text-[#1A237E]">{prog.title}</h3>
                                <p className="font-medium opacity-80 mb-6">{prog.description}</p>
                                <button className="w-full bg-[#1A237E]/5 text-[#1A237E] font-black uppercase tracking-widest text-xs px-6 py-4 rounded-full hover:bg-[#1A237E] hover:text-white transition-colors">
                                    Learn More
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TouristPrograms;