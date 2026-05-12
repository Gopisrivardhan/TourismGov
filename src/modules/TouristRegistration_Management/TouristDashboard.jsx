import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DocumentManager from './DocumentManager'; // Ensure correct path
import { jwtDecode } from 'jwt-decode';

const TouristDashboard = () => {
    // ALL STATE MUST BE INSIDE THE COMPONENT
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // NEW STATE MOVED INSIDE

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

    useEffect(() => {
        // 1. Get the token from local storage
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                // 2. Decode it to find the role
                const decodedToken = jwtDecode(token);
                const userRoles = decodedToken.role || decodedToken.roles || decodedToken.authorities || '';
                
                // 3. If they are an admin, update the state
                if (userRoles.includes('ADMIN') || userRoles.includes('ROLE_ADMIN')) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Token decoding failed", error);
            }
        }

        // 4. Fetch the profile data
        fetchProfile(); 
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-[#1A237E]">Loading...</div>;
    if (!touristData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading profile.</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-20 flex gap-6">
                
                {/* --- COMPACT LEFT SIDEBAR --- */}
                <aside className={`bg-white rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 flex flex-col items-center py-6 h-fit sticky top-32 ${isMenuOpen ? 'w-56 px-4' : 'w-20 px-2'}`}>
                    
                    {/* Hamburger Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-3xl text-[#1A237E] hover:text-[#FF6D00] transition-colors mb-6 focus:outline-none"
                        title="Toggle Menu"
                    >
                        ☰
                    </button>

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-4 w-full">
                        <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="Profile" isOpen={isMenuOpen} />
                        <MenuButton active={activeTab === 'booked'} onClick={() => setActiveTab('booked')} icon="🎫" label="Bookings" isOpen={isMenuOpen} />
                        <MenuButton active={activeTab === 'notification'} onClick={() => setActiveTab('notification')} icon="🔔" label="Alerts" isOpen={isMenuOpen} />
                    </nav>
                </aside>

                {/* --- RIGHT MAIN CONTENT --- */}
                <main className="flex-1">
                    
                    {/* TAB 1: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter">Hi, {touristData.name}</h1>
                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block ${touristData.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {touristData.status || 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="w-16 h-16 bg-[#1A237E] text-white rounded-full flex items-center justify-center text-3xl font-black">
                                    {touristData.name.charAt(0)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                                    <h2 className="text-sm font-black uppercase mb-4">Contact Info</h2>
                                    <DetailItem label="Email" value={touristData.email} />
                                    <DetailItem label="Phone" value={touristData.contactInfo} />
                                    <DetailItem label="Address" value={touristData.address} />
                                </div>

                                {/* ONLY SHOW THIS IF THE USER IS NOT AN ADMIN */}
                                {!isAdmin && (
                                    <DocumentManager 
                                        title="Verification Docs"
                                        documents={touristData.documents}
                                        touristId={touristData.touristId}
                                        onRefresh={fetchProfile}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB 2: BOOKINGS */}
                    {activeTab === 'booked' && (
                        <div className="animate-fadeIn">
                            <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">My Bookings</h1>
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
                                <span className="text-4xl mb-2 block">🎫</span>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No Bookings Found</p>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: NOTIFICATIONS */}
                    {activeTab === 'notification' && (
                        <div className="animate-fadeIn">
                            <h1 className="text-2xl font-black uppercase tracking-tighter mb-4">Notifications</h1>
                            <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
                                <span className="text-4xl mb-2 block">📭</span>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No Alerts</p>
                            </div>
                        </div>
                    )}

                </main>
            </div>
            <Footer />
        </div>
    );
};

// Simplified Sidebar Menu Button
const MenuButton = ({ active, onClick, icon, label, isOpen }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 p-3 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${
            active ? 'bg-[#FF6D00] text-white shadow-sm' : 'bg-transparent text-[#1A237E] hover:bg-[#F8F9FF]'
        } ${isOpen ? 'justify-start w-full px-5' : 'justify-center mx-auto w-12 h-12'}`}
        title={label}
    >
        <span className="text-xl leading-none">{icon}</span>
        {isOpen && <span>{label}</span>}
    </button>
);

const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-[#1A237E]/40 mb-0.5">{label}</p>
        <p className="text-[11px] font-bold text-[#1A237E]">{value}</p>
    </div>
); 

export default TouristDashboard;