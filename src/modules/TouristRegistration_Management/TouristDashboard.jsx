import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import DocumentManager from './DocumentManager'; 
import { jwtDecode } from 'jwt-decode';

const TouristDashboard = () => {
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isAdmin, setIsAdmin] = useState(false);

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
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userRoles = decodedToken.role || decodedToken.roles || decodedToken.authorities || '';
                
                if (userRoles.includes('ADMIN') || userRoles.includes('ROLE_ADMIN')) {
                    setIsAdmin(true);
                }
            } catch (error) {
                console.error("Token decoding failed", error);
            }
        }

        fetchProfile(); 
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-[#1A237E]">Loading...</div>;
    if (!touristData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading profile.</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
            <Navbar />

            {/* FULL WIDTH CONTAINER WITH SIDEBAR & MAIN CONTENT */}
            <div className="flex-1 flex w-full pt-[80px]"> {/* pt-[80px] ensures it clears the Navbar */}
                
                {/* --- STATIC VERTICAL LEFT SIDEBAR --- */}
                <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col py-10 px-4 min-h-[calc(100vh-80px)]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-4">Menu</h3>
                    <nav className="flex flex-col w-full gap-1">
                        <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="Profile" />
                        <MenuButton active={activeTab === 'booked'} onClick={() => setActiveTab('booked')} icon="🎫" label="Bookings" />
                        <MenuButton active={activeTab === 'notification'} onClick={() => setActiveTab('notification')} icon="🔔" label="Alerts" />
                    </nav>
                </aside>

                {/* --- RIGHT MAIN CONTENT --- */}
                <main className="flex-1 p-8 md:p-12 w-full max-w-6xl">
                    
                    {/* TAB 1: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-black uppercase tracking-tighter break-words">Hi, {touristData.name}</h1>
                                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block ${touristData.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {touristData.status || 'INACTIVE'}
                                    </span>
                                </div>
                                <div className="w-16 h-16 bg-[#1A237E] text-white rounded-full flex items-center justify-center text-3xl font-black shrink-0 ml-4 shadow-md">
                                    {touristData.name.charAt(0)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
                                    <h2 className="text-sm font-black uppercase mb-4 text-[#FF6D00]">Contact Info</h2>
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
                            <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">My Bookings</h1>
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                                <span className="text-5xl mb-4 block">🎫</span>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No Bookings Found</p>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: NOTIFICATIONS */}
                    {activeTab === 'notification' && (
                        <div className="animate-fadeIn">
                            <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">Notifications</h1>
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                                <span className="text-5xl mb-4 block">📭</span>
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

// Sidebar Menu Button
const MenuButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest justify-start w-full outline-none ${
            active 
            ? 'bg-[#FF6D00] text-white shadow-md' 
            : 'bg-transparent text-[#1A237E] hover:bg-[#F8F9FF] hover:translate-x-1'
        }`}
    >
        <span className="text-xl leading-none">{icon}</span>
        <span>{label}</span>
    </button>
);

// Detail Display Component
const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-3">
        <p className="text-[8px] font-black uppercase tracking-widest text-[#1A237E]/40 mb-1">{label}</p>
        <p className="text-[11px] font-bold text-[#1A237E] truncate">{value}</p>
    </div>
); 

export default TouristDashboard;