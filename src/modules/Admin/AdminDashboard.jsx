import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    const [adminUser, setAdminUser] = useState({ name: 'Loading...', role: 'ADMIN' });
    const [loadingStats, setLoadingStats] = useState(true);
    const [stats, setStats] = useState({
        activePrograms: 0,
        upcomingEvents: 0,
        heritageSites: 0,
        pendingApprovals: 0
    });

    const BASE_URL = 'http://localhost:8383/tourismgov/v1';

    useEffect(() => {
        const fetchDashboardData = async () => {
            // 1. Get stored auth data
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const token = storedUser?.token || localStorage.getItem('token');
            const userId = storedUser?.userId;

            if (!token) {
                navigate('/login');
                return;
            }

            const axiosConfig = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                // 2. Fetch the specific User's details
                if (userId) {
                    const userResponse = await axios.get(`${BASE_URL}/users/${userId}`, axiosConfig);
                    setAdminUser({
                        name: userResponse.data.name || 'Administrator',
                        role: userResponse.data.role || 'ADMIN'
                    });
                }

                // 3. Fetch Real Stats
                const programsPromise = axios.get(`${BASE_URL}/programs`, axiosConfig).catch(() => ({ data: [] }));
                const eventsPromise = axios.get(`${BASE_URL}/events`, axiosConfig).catch(() => ({ data: [] }));
                const sitesPromise = axios.get(`${BASE_URL}/sites`, axiosConfig).catch(() => ({ data: [] }));
                const auditsPromise = axios.get(`${BASE_URL}/compliance/pending`, axiosConfig).catch(() => ({ data: [] }));

                const [programsRes, eventsRes, sitesRes, auditsRes] = await Promise.all([
                    programsPromise, 
                    eventsPromise, 
                    sitesPromise,
                    auditsPromise
                ]);

                const activeProgramsCount = programsRes.data.filter(p => p.status === 'ACTIVE' || p.status === 'PLANNED').length;
                
                setStats({
                    activePrograms: activeProgramsCount || programsRes.data.length || 0,
                    upcomingEvents: eventsRes.data.length || 0,
                    heritageSites: sitesRes.data.length || 0,
                    pendingApprovals: auditsRes.data.length || 0
                });

            } catch (error) {
                console.error("Dashboard Aggregation Error:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex flex-col">
            
            {/* TOP NAVIGATION HEADER */}
            <div className="bg-[#1A237E] p-4 px-6 md:px-10 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
                
                {/* Logo */}
                <div className="text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                    TourismGov
                </div>

                {/* NEW: Central Navigation Links */}
                <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-white/70">
                    <Link to="/admin/programs" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Programs</Link>
                    <Link to="/admin/sites" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Heritage Sites</Link>
                    <Link to="/admin/events" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Events</Link>
                    <Link to="/tourist-details" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Tourist Details</Link>
                </nav>

                {/* User & Logout */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6D00]">
                            {adminUser.role}
                        </span>
                        <span className="text-sm font-black uppercase">
                            {adminUser.name}
                        </span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-[#FF6D00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <main className="flex-1 max-w-screen-2xl w-full mx-auto p-6 md:p-10">
                
                {/* WELCOME SECTION & KPI STRIP */}
                <div className="mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2 text-[#1A237E]">
                        System <span className="text-[#FF6D00]">Overview</span>
                    </h1>
                    <p className="font-bold text-xs uppercase tracking-widest opacity-60 mb-8">Monitor system analytics and regulatory compliance.</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-[#1A237E]/5 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <span className="text-3xl mb-2">🏛️</span>
                            <p className="text-4xl font-black text-[#1A237E] leading-none mb-1">
                                {loadingStats ? '...' : stats.heritageSites}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Heritage Sites</p>
                        </div>
                        <div className="bg-[#1A237E] text-white p-6 rounded-[2rem] shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <span className="text-3xl mb-2">📅</span>
                            <p className="text-4xl font-black text-[#FF6D00] leading-none mb-1">
                                {loadingStats ? '...' : stats.upcomingEvents}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Upcoming Events</p>
                        </div>
                        <div className="bg-white p-6 rounded-[2rem] shadow-lg border border-[#1A237E]/5 flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <span className="text-3xl mb-2">📋</span>
                            <p className="text-4xl font-black text-[#1A237E] leading-none mb-1">
                                {loadingStats ? '...' : stats.activePrograms}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Active Programs</p>
                        </div>
                        <div className="bg-[#FF6D00] text-white p-6 rounded-[2rem] shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-transform">
                            <span className="text-3xl mb-2">⚠️</span>
                            <p className="text-4xl font-black leading-none mb-1">
                                {loadingStats ? '...' : stats.pendingApprovals}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-90">Pending Audits</p>
                        </div>
                    </div>
                </div>

                {/* COMPLIANCE & QUICK ACTIONS */}
                <h2 className="text-2xl font-black uppercase tracking-tighter text-[#1A237E] mb-6">Security & Auditing</h2>
                
                <div className="grid grid-cols-1 gap-6 md:gap-8">
                    {/* ROUTE TO: Compliance (Now spans full width as primary action) */}
                    <Link to="/admin/compliance" className="group block bg-white rounded-[2rem] p-8 shadow-xl border border-[#1A237E]/5 hover:border-[#D81B60]/50 hover:shadow-2xl transition-all duration-300">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#D81B60]/10 text-[#D81B60] rounded-full flex items-center justify-center text-2xl group-hover:bg-[#D81B60] group-hover:text-white transition-colors shrink-0">
                                    🛡️
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase leading-tight mb-1 text-[#1A237E]">Compliance Console</h3>
                                    <p className="font-medium text-sm opacity-70 max-w-2xl">Monitor government policies, generate regulatory reports, track system audit logs, and approve pending security clearances.</p>
                                </div>
                            </div>
                            <span className="bg-[#1A237E] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-[#D81B60] transition-colors whitespace-nowrap shadow-md">
                                Enter Console
                            </span>
                        </div>
                    </Link>
                </div>

            </main>
        </div>
    );
};

export default AdminDashboard;