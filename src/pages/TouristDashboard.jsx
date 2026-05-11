import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DocumentManager from './DocumentManager'; // IMPORT THE NEW COMPONENT

const TouristDashboard = () => {
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); 

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

    useEffect(() => { fetchProfile(); }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-[#1A237E]">Loading...</div>;
    if (!touristData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading profile.</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20 flex flex-col lg:flex-row gap-8">
                
                {/* --- SIDEBAR MENU --- */}
                <aside className="w-full lg:w-1/4">
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white sticky top-32">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 mx-auto bg-[#1A237E] text-white rounded-full flex items-center justify-center text-2xl font-black mb-3">
                                {touristData.name.charAt(0)}
                            </div>
                            <h3 className="font-black uppercase tracking-tight">{touristData.name}</h3>
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full mt-2 inline-block ${touristData.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {touristData.status || 'INACTIVE'}
                            </span>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="My Profile" />
                            <MenuButton active={activeTab === 'booked'} onClick={() => setActiveTab('booked')} icon="🎫" label="My Bookings" />
                            <MenuButton active={activeTab === 'notification'} onClick={() => setActiveTab('notification')} icon="🔔" label="Notifications" />
                        </nav>
                    </div>
                </aside>

                {/* --- MAIN CONTENT --- */}
                <main className="w-full lg:w-3/4">
                    
                    {/* TAB 1: PROFILE */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">Profile <span className="text-[#FF6D00]">Overview.</span></h1>
                            
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white">
                                <h2 className="text-lg font-black uppercase mb-6">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DetailItem label="Full Name" value={touristData.name} />
                                    <DetailItem label="Email" value={touristData.email} />
                                    <DetailItem label="Phone" value={touristData.contactInfo} />
                                    <DetailItem label="Address" value={touristData.address} />
                                </div>
                            </div>

                            {/* REUSABLE DOCUMENT MANAGER */}
                            <DocumentManager 
                                title="Verification Documents"
                                documents={touristData.documents}
                                touristId={touristData.touristId}
                                onRefresh={fetchProfile}
                            />
                        </div>
                    )}

                    {/* TAB 2: BOOKINGS */}
                    {activeTab === 'booked' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">My <span className="text-[#FF6D00]">Bookings.</span></h1>
                            
                            {/* Example of reusing the DocumentManager in Bookings */}
                            <DocumentManager 
                                title="Booking Tickets & Receipts"
                                documents={touristData.documents.filter(doc => doc.docType === 'TICKET')} // Example filter
                                touristId={touristData.touristId}
                                onRefresh={fetchProfile}
                            />
                        </div>
                    )}

                    {/* TAB 3: NOTIFICATIONS */}
                    {activeTab === 'notification' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h1 className="text-3xl font-black uppercase tracking-tighter mb-6">System <span className="text-[#FF6D00]">Notifications.</span></h1>
                            
                            {/* Example of reusing the DocumentManager in Notifications */}
                            <DocumentManager 
                                title="Requested Compliance Forms"
                                documents={touristData.documents.filter(doc => doc.docType === 'COMPLIANCE')} // Example filter
                                touristId={touristData.touristId}
                                onRefresh={fetchProfile}
                            />
                        </div>
                    )}

                </main>
            </div>
            <Footer />
        </div>
    );
};

const MenuButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 w-full px-6 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${
            active ? 'bg-[#FF6D00] text-white shadow-md' : 'bg-transparent text-[#1A237E] hover:bg-[#F8F9FF]'
        }`}
    >
        <span className="text-base">{icon}</span>
        {label}
    </button>
);

const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-2">
        <p className="text-[9px] font-black uppercase text-[#1A237E]/40 mb-0.5">{label}</p>
        <p className="text-xs font-bold text-[#1A237E]">{value}</p>
    </div>
);

export default TouristDashboard;