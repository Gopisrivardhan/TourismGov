import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TouristEvents = () => {
    const navigate = useNavigate();
    
    // Auth & User State
    const [touristUser, setTouristUser] = useState({ id: null, name: '', role: '' });
    
    // Data States
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(''); 
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const BASE_URL = 'http://localhost:8383/tourismgov/v1';

    const getAxiosConfig = useCallback(() => {
        const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
        return { 
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        };
    }, []);

    // --- UI Warning/Success Handlers ---
    const showWarning = (msg) => {
        setError(msg);
        setTimeout(() => setError(null), 5000); 
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // --- SECURITY CHECK & DATA FETCHING ---
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        // Ensure only Tourists can access this page
        if (!token || !storedUser || storedUser.role !== 'TOURIST') {
            navigate('/login');
            return;
        }
        
        // Assuming your auth payload saves the database ID as 'id' or 'userId'
        setTouristUser({ 
            id: storedUser.id || storedUser.userId, 
            name: storedUser.name, 
            role: storedUser.role 
        });
        
        fetchAvailableEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // API: Fetch All Events
    const fetchAvailableEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/events`, getAxiosConfig());
            // Filter out events that are CANCELLED or COMPLETED so tourists only see active ones
            const activeEvents = res.data.filter(evt => 
                evt.status !== 'CANCELLED' && evt.status !== 'COMPLETED'
            );
            setEvents(activeEvents);
            setError(null);
        } catch (err) {
            showWarning(err.response?.data?.message || 'Failed to fetch available events.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        setTicketCount(1); // Reset ticket counter for new selection
        setError(null);
        setSuccessMsg('');
        
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                document.getElementById('booking-panel')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    // --- API: Create Booking ---
    const handleBookEvent = async (e) => {
        e.preventDefault();
        if (isSubmitting || !selectedEvent || !touristUser.id) return; 

        setError(null);
        setSuccessMsg('');
        setIsSubmitting(true); 

        // Matches the standard BookingRequest DTO expectations
        const payload = {
            eventId: selectedEvent.eventId,
            touristId: touristUser.id,
            numberOfTickets: Number(ticketCount)
        };

        try {
            // Adjust this URL to exactly match your BookingController POST mapping path
            await axios.post(`${BASE_URL}/bookings`, payload, getAxiosConfig());
            
            showSuccess(`Successfully booked ${ticketCount} ticket(s) for ${selectedEvent.title}!`);
            setTicketCount(1);
            
            // Optional: Automatically deselect or refresh data
            // setSelectedEvent(null); 
        } catch (err) {
            showWarning(err.response?.data?.message || 'Failed to book event. Please try again.');
        } finally {
            setIsSubmitting(false); 
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex flex-col">
            
            {/* TOP NAVIGATION */}
            <div className="bg-[#1A237E] p-4 px-4 md:px-10 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <Link to="/tourist" className="hover:text-[#FF6D00] transition-colors text-xl md:text-2xl font-bold" title="Back to Dashboard">
                        &larr;
                    </Link>
                    <div className="text-base md:text-2xl font-black tracking-tighter flex items-center gap-2 truncate">
                        <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF6D00] shrink-0"></span>
                        <span className="truncate">TourismGov <span className="hidden sm:inline">| Explore Events</span></span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6 ml-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6D00]">{touristUser.role}</span>
                        <span className="text-sm font-black uppercase">{touristUser.name}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-[#FF6D00] px-4 py-2 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors whitespace-nowrap shrink-0"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <main className="flex-1 max-w-screen-2xl w-full mx-auto p-4 md:p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* LEFT PANEL: EVENTS LIST */}
                <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
                    <div className="flex justify-between items-end mb-2 lg:mb-0">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none">Upcoming Events</h2>
                    </div>

                    {!loading && events.length === 0 && (
                        <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 border-dashed border-[#1A237E]/20 text-center flex flex-col items-center justify-center py-12 md:py-16 shadow-sm">
                            <span className="text-2xl mb-4">🌍</span>
                            <h3 className="font-black text-lg md:text-xl uppercase text-[#1A237E] mb-2">No Events Available</h3>
                            <p className="font-medium text-xs md:text-sm opacity-60 mb-6 px-4">Check back later for exciting new tourism events.</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 md:gap-4 max-h-auto lg:max-h-[75vh] overflow-y-auto pr-1 lg:pr-2">
                        {events.map(evt => (
                            <div 
                                key={evt.eventId} 
                                onClick={() => handleSelectEvent(evt)}
                                className={`p-4 md:p-6 rounded-[1rem] md:rounded-[1.5rem] cursor-pointer transition-all border ${selectedEvent?.eventId === evt.eventId ? 'bg-[#1A237E] text-white shadow-xl scale-[1.02]' : 'bg-white shadow-sm hover:shadow-md border-[#1A237E]/10 hover:border-[#FF6D00]/50'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black uppercase text-base md:text-lg leading-tight line-clamp-2 pr-4">{evt.title}</h3>
                                </div>
                                <div className="flex flex-col mt-3 md:mt-4 gap-2">
                                    <span className={`font-bold text-[9px] md:text-[10px] uppercase tracking-widest ${selectedEvent?.eventId === evt.eventId ? 'text-white/80' : 'text-[#FF6D00]'}`}>
                                        📍 {evt.location}
                                    </span>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className={`px-2 py-1 md:px-3 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${selectedEvent?.eventId === evt.eventId ? 'bg-white/20' : 'bg-[#1A237E]/5 text-[#1A237E]'}`}>
                                            {evt.status}
                                        </span>
                                        <span className={`font-bold text-[9px] md:text-[10px] uppercase tracking-widest ${selectedEvent?.eventId === evt.eventId ? 'opacity-80' : 'opacity-50'}`}>
                                            🗓️ {evt.date?.replace('T', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL: DETAILS & BOOKING FORM */}
                <div id="booking-panel" className="lg:col-span-7 scroll-mt-24">
                    
                    {/* UI ALERTS */}
                    {successMsg && (
                        <div className="mb-4 md:mb-6 p-4 bg-green-50 border border-green-200 rounded-[1rem] flex items-center justify-between shadow-sm animate-fade-in-up">
                            <p className="text-green-700 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">✅ {successMsg}</p>
                            <button onClick={() => setSuccessMsg('')} className="text-green-700 hover:text-green-900">&times;</button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 md:mb-6 p-4 bg-[#D81B60]/10 border border-[#D81B60]/20 rounded-[1rem] flex items-center justify-between shadow-sm animate-fade-in-up">
                            <p className="text-[#D81B60] font-bold text-[9px] md:text-[10px] uppercase tracking-widest">⚠️ Warning: {error}</p>
                            <button onClick={() => setError(null)} className="text-[#D81B60] hover:text-red-900">&times;</button>
                        </div>
                    )}

                    {selectedEvent ? (
                        <div className="bg-white p-6 md:p-8 lg:p-10 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-[#1A237E]/10 animate-fade-in-up">
                            
                            {/* Header Panel */}
                            <div className="border-b border-[#1A237E]/10 pb-6 md:pb-8 mb-6 md:mb-8">
                                <span className="bg-[#FF6D00] text-white px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                                    Event Details
                                </span>
                                <h2 className="text-2xl md:text-4xl font-black uppercase leading-tight md:leading-none text-[#1A237E] mb-3">
                                    {selectedEvent.title}
                                </h2>
                                <div className="flex flex-col gap-2">
                                    <p className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">
                                        📅 DATE & TIME: {selectedEvent.date?.replace('T', ' ')}
                                    </p>
                                    <p className="font-bold text-[10px] md:text-xs uppercase tracking-widest text-[#FF6D00]">
                                        📍 LOCATION: {selectedEvent.location}
                                    </p>
                                </div>
                            </div>

                            {/* Booking Action Area */}
                            <div className="bg-[#F8F9FF] p-6 md:p-8 rounded-[1.5rem] border border-[#1A237E]/10">
                                <h3 className="text-lg md:text-xl font-black uppercase text-[#1A237E] mb-4">Secure Your Spot</h3>
                                <p className="text-sm font-medium text-gray-600 mb-6">Select the number of tickets you wish to book for this event. A booking confirmation will be generated for your tourist profile.</p>
                                
                                <form onSubmit={handleBookEvent} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                                    <div className="flex-1">
                                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">Number of Tickets</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="1" 
                                            max="10"
                                            value={ticketCount} 
                                            onChange={e => setTicketCount(e.target.value)}
                                            className="w-full px-5 py-3 md:px-6 md:py-4 bg-white rounded-full border-2 border-transparent focus:border-[#FF6D00] outline-none transition-all font-bold text-lg md:text-xl text-center" 
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className={`flex-1 sm:flex-[2] bg-[#1A237E] text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-black uppercase text-sm md:text-base tracking-widest shadow-xl transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF6D00] hover:-translate-y-1'}`}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Book Tickets Now'}
                                    </button>
                                </form>
                            </div>

                        </div>
                    ) : (
                        <div className="hidden lg:flex h-full min-h-[500px] flex-col items-center justify-center border-2 border-dashed border-[#1A237E]/20 rounded-[2rem] bg-white/50">
                            <span className="text-4xl mb-4 opacity-50">👆</span>
                            <p className="font-bold text-sm uppercase tracking-widest opacity-40">Select an event to view details and book</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TouristEvents;