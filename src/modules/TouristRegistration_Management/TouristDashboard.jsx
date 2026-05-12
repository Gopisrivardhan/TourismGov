import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Footer from '../../components/Footer';
import DocumentManager from './DocumentManager'; 
import Navbar from '../../components/Navbar'; // Make sure this path is correct for your folder structure!
import { jwtDecode } from 'jwt-decode';

const TouristDashboard = () => {
    const [touristData, setTouristData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isAdmin, setIsAdmin] = useState(false);

    // Edit State Management
    const [isEditing, setIsEditing] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        dob: '',
        gender: '',
        contactInfo: '',
        address: '',
        email: '' 
    });

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

    const handleEditClick = () => {
        setEditForm({
            name: touristData.name || '',
            dob: touristData.dob || '',
            gender: touristData.gender || 'MALE',
            contactInfo: touristData.contactInfo || '',
            address: touristData.address || '',
            email: touristData.email || '' 
        });
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            await api.put('/tourismgov/v1/tourist/update', editForm);
            await fetchProfile(); 
            setIsEditing(false);  
            alert("Profile updated successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase text-[#1A237E]">Loading...</div>;
    if (!touristData) return <div className="min-h-screen flex items-center justify-center text-red-500">Error loading profile.</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
            
            {/* INJECTED COMPONENT NAVBAR HERE */}
            <Navbar userName={touristData.name} />

            <div className="flex-1 flex w-full"> 
                
                <aside className="w-64 bg-white border-r border-gray-200 shrink-0 flex flex-col py-10 px-4 min-h-[calc(100vh-80px)]">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-4">Menu</h3>
                    <nav className="flex flex-col w-full gap-1">
                        <MenuButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon="👤" label="Profile" />
                        <MenuButton active={activeTab === 'booked'} onClick={() => setActiveTab('booked')} icon="🎫" label="Bookings" />
                        <MenuButton active={activeTab === 'notification'} onClick={() => setActiveTab('notification')} icon="🔔" label="Alerts" />
                    </nav>
                </aside>

                <main className="flex-1 p-8 md:p-12 w-full max-w-6xl">
                    
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
                                
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                    {!isEditing ? (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-sm font-black uppercase text-[#FF6D00]">Contact Info</h2>
                                                <button onClick={handleEditClick} className="text-[#1A237E] hover:text-[#FF6D00] transition-colors text-sm font-bold flex items-center gap-1">
                                                    ✏️ Edit
                                                </button>
                                            </div>
                                            <DetailItem label="Email" value={touristData.email} />
                                            <DetailItem label="Phone" value={touristData.contactInfo} />
                                            <DetailItem label="Date of Birth" value={touristData.dob} />
                                            <DetailItem label="Gender" value={touristData.gender} />
                                            <DetailItem label="Address" value={touristData.address} />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdate} className="space-y-3">
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-sm font-black uppercase text-[#FF6D00]">Edit Profile</h2>
                                                <button type="button" onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">
                                                    Cancel
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <EditInput label="Name" name="name" value={editForm.name} onChange={handleInputChange} />
                                                <EditInput label="Phone" type="tel" name="contactInfo" value={editForm.contactInfo} onChange={handleInputChange} />
                                            </div>

                                            <EditInput label="Email Address" type="email" name="email" value={editForm.email} onChange={handleInputChange} />

                                            <div className="grid grid-cols-2 gap-3">
                                                <EditInput label="Date of Birth" type="date" name="dob" value={editForm.dob} onChange={handleInputChange} />
                                                <div>
                                                    <label className="block text-[9px] font-bold uppercase tracking-widest text-[#1A237E]/60 mb-1">Gender</label>
                                                    <select name="gender" value={editForm.gender} onChange={handleInputChange} className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1A237E] outline-none focus:border-[#FF6D00]">
                                                        <option value="MALE">Male</option>
                                                        <option value="FEMALE">Female</option>
                                                        <option value="OTHER">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <EditInput label="Address" name="address" value={editForm.address} onChange={handleInputChange} />

                                            <button type="submit" disabled={updateLoading} className="w-full mt-4 bg-[#1A237E] text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl hover:bg-[#FF6D00] transition-colors disabled:opacity-50">
                                                {updateLoading ? "Saving..." : "Save Changes"}
                                            </button>
                                        </form>
                                    )}
                                </div>

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

                    {activeTab === 'booked' && (
                        <div className="animate-fadeIn">
                            <h1 className="text-2xl font-black uppercase tracking-tighter mb-6">My Bookings</h1>
                            <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
                                <span className="text-5xl mb-4 block">🎫</span>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">No Bookings Found</p>
                            </div>
                        </div>
                    )}

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

const DetailItem = ({ label, value }) => (
    <div className="border-b border-gray-50 pb-3">
        <p className="text-[8px] font-black uppercase tracking-widest text-[#1A237E]/40 mb-1">{label}</p>
        <p className="text-[11px] font-bold text-[#1A237E] truncate">{value}</p>
    </div>
); 

const EditInput = ({ label, type = "text", name, value, onChange }) => (
    <div>
        <label className="block text-[9px] font-bold uppercase tracking-widest text-[#1A237E]/60 mb-1">{label}</label>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange} 
            className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#1A237E] outline-none focus:border-[#FF6D00]"
            required 
        />
    </div>
);

export default TouristDashboard;