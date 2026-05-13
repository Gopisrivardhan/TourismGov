import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DocumentManager from './DocumentManager'; 
import { Loader2, Ticket, CalendarDays } from 'lucide-react'; // Added icons

const TouristDashboard = () => {
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); 

    // Bookings State
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    // --- FETCH PROFILE ---
    const fetchProfile = async () => {
        try {
            const response = await api.get('/tourismgov/v1/tourist/profile');
            setTouristData(response.data);
        } catch (error) {
            if(error.response?.status === 401) window.location.href = '/login';
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH BOOKINGS ---
    const fetchBookings = async () => {
        if (!touristData?.touristId) return;
        setLoadingBookings(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/tourismgov/v1/bookings/tourist/${touristData.touristId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Sort bookings so newest are first
            const sortedBookings = response.data.sort((a, b) => b.bookingId - a.bookingId);
            setBookings(sortedBookings);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    // Initial Load
    useEffect(() => { 
        fetchProfile(); 
    }, []);

    // Fetch bookings whenever the Bookings tab is clicked
    useEffect(() => {
        if (activeTab === 'booked' && touristData) {
            fetchBookings();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, touristData]);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
            <Loader2 size={48} className="text-[#FF6D00] animate-spin mb-4" />
            <p className="font-black uppercase text-xs tracking-widest text-[#1A237E]">Loading Profile...</p>
        </div>
    );
    
    if (!touristData) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold uppercase">Error loading profile.</div>;

    // Helper for Status Badge Colors
    const getStatusBadge = (status) => {
        switch(status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
            case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            case 'ATTENDED': return 'bg-[#1A237E]/10 text-[#1A237E] border-[#1A237E]/20';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
            
            {/* Using the Smart Global Navbar */}
            <Navbar />

            {/* Added pt-32 to clear the global navbar */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20 flex flex-col lg:flex-row gap-8">
                
                {/* --- SIDEBAR MENU --- */}
                <aside className="w-full lg:w-1/4">
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-[#1A237E]/5 sticky top-32">
                        <div className="mb-8 text-center">
                            <div className="w-20 h-20 mx-auto bg-[#1A237E] text-white rounded-full flex items-center justify-center text-3xl font-black mb-4 shadow-lg">
                                {touristData.name.charAt(0)}
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-[#1A237E] leading-tight">
                                {touristData.name}
                            </h3>
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block ${touristData.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {touristData.status || 'INACTIVE'}
                            </span>
                        </div>

                        {/* REMOVED NOTIFICATIONS TAB */}
                        <nav className="flex flex-col gap-2">
                            <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="My Profile" />
                            <MenuButton active={activeTab === 'booked'} onClick={() => setActiveTab('booked')} icon="🎫" label="My Bookings" />
                        </nav>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="w-full lg:w-3/4">
                    
                    {/* TAB 1: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                                Profile <span className="text-[#FF6D00]">Overview.</span>
                            </h1>
                            
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#1A237E]/5">
                                <h2 className="text-lg font-black uppercase mb-6 text-[#1A237E]">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailItem label="Full Name" value={touristData.name} />
                                    <DetailItem label="Email" value={touristData.email} />
                                    <DetailItem label="Phone" value={touristData.contactInfo} />
                                    <DetailItem label="Address" value={touristData.address} />
                                </div>
                            </div>

                            <DocumentManager 
                                title="Verification Documents"
                                documents={touristData.documents || []}
                                touristId={touristData.touristId}
                                onRefresh={fetchProfile}
                            />
                        </div>
                    )}

                    {/* TAB 2: BOOKINGS (NOW FULLY DYNAMIC) */}
                    {activeTab === 'booked' && (
                        <div className="space-y-8 animate-fade-in-up">
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                                My <span className="text-[#FF6D00]">Bookings.</span>
                            </h1>
                            
                            {loadingBookings ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="animate-spin text-[#FF6D00]" size={40} />
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-dashed border-[#1A237E]/20 text-center shadow-sm">
                                    <span className="text-5xl mb-4 block opacity-80">🎫</span>
                                    <h3 className="font-black text-xl uppercase text-[#1A237E] mb-2">No Bookings Found</h3>
                                    <p className="font-medium text-sm text-gray-500 max-w-md mx-auto">You haven't booked any tickets yet. Explore upcoming cultural events and heritage programs to secure your spot!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {bookings.map(booking => (
                                        <div key={booking.bookingId} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-[#1A237E]/5 flex flex-col justify-between hover:-translate-y-1 transition-transform group">
                                            <div>
                                                <div className="flex justify-between items-start mb-4 gap-2">
                                                    <span className="bg-[#1A237E]/5 text-[#1A237E] px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0">
                                                        ID: #{booking.bookingId}
                                                    </span>
                                                    <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusBadge(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                
                                                {/* If your backend sends eventTitle use it, otherwise show the ID */}
                                                <h3 className="font-black text-xl uppercase text-[#1A237E] mb-2 leading-tight group-hover:text-[#FF6D00] transition-colors line-clamp-2">
                                                    {booking.eventTitle || `Event #${booking.eventId}`}
                                                </h3>
                                            </div>
                                            
                                            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center">
                                                <div className="flex items-center gap-2 text-[#1A237E]">
                                                    <Ticket size={18} className="text-[#FF6D00]" />
                                                    <span className="font-black text-[11px] uppercase tracking-widest">
                                                        {booking.numberOfTickets} Ticket(s)
                                                    </span>
                                                </div>
                                                {/* If your backend sends bookingDate, show it */}
                                                {booking.bookingDate && (
                                                    <div className="flex items-center gap-1.5 text-gray-400">
                                                        <CalendarDays size={14} />
                                                        <span className="font-bold text-[9px] uppercase tracking-widest">
                                                            {new Date(booking.bookingDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
            <Footer />
        </div>
    );
};

// --- REUSABLE COMPONENTS ---

const MenuButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 w-full px-6 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${
            active ? 'bg-[#FF6D00] text-white shadow-lg scale-[1.02]' : 'bg-transparent text-[#1A237E] hover:bg-[#F8F9FF]'
        }`}
    >
        <span className={`text-lg ${active ? 'opacity-100' : 'opacity-70'}`}>{icon}</span>
        {label}
    </button>
);

const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-100 pb-3">
        <p className="text-[9px] font-black uppercase tracking-widest text-[#FF6D00] mb-1">{label}</p>
        <p className="text-sm font-bold text-[#1A237E]">{value || 'Not Provided'}</p>
    </div>
);

export default TouristDashboard;