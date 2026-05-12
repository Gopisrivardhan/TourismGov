import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Info } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { Bell, FileText } from 'lucide-react';

const Navbar = ({ unreadNotifications = 0, latestNotification = null, userName = "User", userRole = "Tourist" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");
    const [showLatest, setShowLatest] = useState(false);
    const user = getUser();

    // --- Identity Sync: Matches DashboardServiceImpl logic ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedRole = localStorage.getItem('role'); 
        if (token) {
            setIsLoggedIn(true);
            setRole(storedRole || userRole || "TOURIST");
        } else {
            setIsLoggedIn(false);
        }
    }, [location, userRole]);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        navigate('/');
        window.location.reload(); 
    };

    /**
     * Staff Access: Matches roles from com.tourismgov.report.enums.Role
     */
    const isStaff = isLoggedIn && (
        role === 'ADMIN' || 
        role === 'MANAGER' || 
        role === 'OFFICER' || 
        role === 'COMPLIANCE' || 
        role === 'AUDITOR'
    );

    /**
     * GLASSY SWITCH EFFECT
     * Applies a frosted glass background to the active navigation pill
     */
    const getLinkClass = (path) => 
        `relative px-5 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group ${
            location.pathname === path 
            ? 'bg-white/30 backdrop-blur-md shadow-lg border border-white/40 text-[#FF6D00] font-black scale-105' 
            : 'text-[#1A237E] hover:bg-white/10 hover:backdrop-blur-sm'
        }`;

    return (
        <div className="absolute top-0 left-0 w-full z-50 p-6">
            <nav className="max-w-[98%] mx-auto bg-white/85 backdrop-blur-2xl rounded-full px-8 py-3 flex justify-between items-center shadow-2xl border border-white/40">
                
                {/* --- BRAND LOGO --- */}
                <Link to="/" className="text-[#1A237E] text-2xl font-black tracking-tighter flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-[#FF6D00]"></span>
                    TourismGov
                </Link>

                {/* --- CENTER NAVIGATION: GLASSY COMMAND BAR --- */}
                <div className="hidden lg:flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-[#1A237E]">
                    {!isLoggedIn ? (
                        <>
                            <Link to="/sites" className={getLinkClass('/sites')}>Heritage Sites</Link>
                            <Link to="/events" className={getLinkClass('/events')}>Events</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
                            
                            {/* Intelligence module for Staff */}
                            {isStaff && (
                                <Link to="/reports" className={getLinkClass('/reports')}>Reports</Link>
                            )}

                            {/* Full Notifications Page Link */}
                            <Link to="/notifications" className={getLinkClass('/notifications')}>
                                Notifications
                            </Link>
                            
                            <Link to="/sites" className={getLinkClass('/sites')}>Heritage Sites</Link>
                            <Link to="/events" className={getLinkClass('/events')}>Events</Link>
                            
                            {/* Programs button placed next to Events as requested */}
                            <Link to="/programs" className={getLinkClass('/programs')}>Programs</Link>
                        </>
                    )}
                </div>

                {/* --- RIGHT ACTIONS --- */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            {/* BELL ICON: Toggle Latest Alert Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowLatest(!showLatest)}
                                    className="relative p-2.5 bg-[#F8F9FF] rounded-full hover:bg-[#FF6D00]/10 transition-all shadow-inner border border-slate-100"
                                >
                                    <Bell size={18} className={unreadNotifications > 0 ? "text-[#FF6D00]" : "text-[#1A237E]"} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#FF6D00] text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                            {unreadNotifications}
                                        </span>
                                    )}
                                </button>

                                {/* QUICK VIEW DROPDOWN */}
                                {showLatest && (
                                    <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-5 z-[60]">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A237E] mb-3">Latest Alert</h4>
                                        {latestNotification ? (
                                            <div className="bg-[#F8F9FF]/50 p-4 rounded-2xl border border-white">
                                                <p className="text-[11px] font-bold text-[#1A237E] mb-1">{latestNotification.subject}</p>
                                                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                                                    {latestNotification.message}
                                                </p>
                                                <Link to="/notifications" onClick={() => setShowLatest(false)} className="block mt-3 text-[9px] font-black uppercase text-[#FF6D00] hover:underline">
                                                    View All
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <Info size={20} className="mx-auto text-slate-200 mb-2" />
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">No New Alerts</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* USER PROFILE: Displays Name and Role side-by-side */}
                            <div className="flex items-center gap-3 bg-[#F8F9FF] pl-5 pr-1.5 py-1.5 rounded-full border border-slate-100 shadow-sm">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase text-[#1A237E] leading-none">
                                        {userName || localStorage.getItem('name') || "User"}
                                    </p>
                                    <p className="text-[8px] font-bold text-[#FF6D00] uppercase tracking-[0.2em]">
                                        {role || "Tourist"}
                                    </p>
                                </div>
                                <div className="w-9 h-9 bg-[#1A237E] rounded-full text-white flex items-center justify-center shadow-lg">
                                    <User size={16} />
                                </div>
                            </div>
                            {user && user.role !== 'TOURIST' && (
                                <Link to="/reports" className="hidden lg:flex items-center gap-2 px-3 py-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors font-bold text-xs uppercase">
                                    <FileText className="w-4 h-4" /> Reports
                                </Link>
                            )}

                            <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                                <Bell className="w-5 h-5" />
                            </Link>

                            <Link to={user?.role === 'TOURIST' ? "/dashboard" : "/main-dashboard"} className="hidden sm:flex items-center gap-2 bg-[#F8F9FF] px-4 py-2 rounded-full border border-[#1A237E]/10 hover:border-[#FF6D00] transition-all">
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-[#1A237E]">Dashboard</p>
                                    <p className="text-[9px] font-bold text-[#FF6D00] uppercase tracking-widest">{user?.name || 'Profile'}</p>
                                </div>
                                <div className="w-8 h-8 bg-[#1A237E] rounded-full text-white flex items-center justify-center font-bold text-xs">
                                    {user?.name ? user.name.charAt(0) : 'U'}
                                </div>
                            </Link>
                            
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-7 py-3 rounded-full text-[10px] shadow-lg shadow-orange-500/20">Login</Link>
                            <Link to="/register" className="bg-[#1A237E] text-white font-bold uppercase tracking-widest px-7 py-3 rounded-full text-[10px] shadow-lg">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;