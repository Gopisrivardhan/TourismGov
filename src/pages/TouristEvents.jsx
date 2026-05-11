import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TouristEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Fetch events from EventController
    useEffect(() => {
        axios.get('http://localhost:8383/tourismgov/v1/events')
            .then(res => {
                setEvents(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching events:", err);
                setLoading(false);
                // Fallback mock data for UI testing if backend is down
                setEvents([
                    { id: 1, title: 'Pushkar Camel Fair', location: 'Rajasthan', date: '2026-11-15', status: 'ACTIVE' },
                    { id: 2, title: 'Diwali Light Festival', location: 'Ayodhya', date: '2026-10-24', status: 'ACTIVE' }
                ]);
            });
    }, []);

    // Handle booking via BookingController
    const handleBookEvent = (eventId) => {
        // Assuming a logged-in tourist ID of 1 for demonstration
        const bookingRequest = { touristId: 1, date: new Date().toISOString().split('T')[0] }; 

        axios.post(`http://localhost:8383/tourismgov/v1/events/${eventId}/bookings`, bookingRequest)
            .then(res => {
                setMessage({ type: 'success', text: 'Event booked successfully!' });
                setTimeout(() => setMessage(null), 3000);
            })
            .catch(err => {
                setMessage({ type: 'error', text: 'Booking failed. Please try again.' });
                setTimeout(() => setMessage(null), 3000);
            });
    };

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
                        Cultural Events
                    </div>
                </div>
            </nav>

            <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-10">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#1A237E] leading-none mb-4">
                        Discover <br/><span className="text-[#FF6D00]">Heritage Events</span>
                    </h1>
                    <p className="font-medium opacity-80 max-w-xl mx-auto">Immerse yourself in the rich culture. Browse and book upcoming festivals and heritage tours.</p>
                </div>

                {message && (
                    <div className={`mb-8 p-4 rounded-full text-center font-bold text-xs uppercase tracking-widest text-white shadow-lg ${message.type === 'success' ? 'bg-[#004D40]' : 'bg-[#D81B60]'}`}>
                        {message.text}
                    </div>
                )}

                {loading ? (
                    <div className="text-center font-bold text-[#FF6D00] uppercase tracking-widest">Loading Events...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div key={event.id || event.eventId} className="bg-white rounded-[2rem] p-6 shadow-xl border border-[#1A237E]/5 flex flex-col group hover:-translate-y-2 transition-transform duration-300">
                                <div className="h-48 rounded-[1.5rem] bg-[#1A237E]/10 mb-6 overflow-hidden relative">
                                    {/* Placeholder image/gradient matching theme */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#1A237E] to-[#FF6D00]/80 mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-white text-[#1A237E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{event.status}</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-black uppercase leading-tight mb-2 text-[#1A237E]">{event.title}</h3>
                                <p className="font-bold text-xs uppercase tracking-widest text-[#FF6D00] mb-4">📍 {event.location} | 📅 {event.date}</p>
                                
                                <button 
                                    onClick={() => handleBookEvent(event.id || event.eventId)}
                                    className="mt-auto w-full bg-[#1A237E] text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-[#FF6D00] transition-colors shadow-lg"
                                >
                                    Book Event
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default TouristEvents;