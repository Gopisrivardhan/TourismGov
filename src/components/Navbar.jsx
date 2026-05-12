import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { Bell, FileText } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const user = getUser();

    // Check for token when the Navbar loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // Handle user logout
    const handleLogout = () => {
        // 1. Remove the token from storage
        localStorage.removeItem('token');
        
        // 2. Update the state
        setIsLoggedIn(false);
        
        // 3. Redirect to the homepage or login page
        navigate('/');
    };

    return (
        <div className="absolute top-0 left-0 w-full z-50 p-6">
            <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 flex justify-between items-center shadow-xl border border-white/20">
                
                {/* LOGO */}
                <Link to="/" className="text-[#1A237E] text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-2">
                    <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FF6D00]"></span>
                    TourismGov
                </Link>

                {/* MIDDLE LINKS */}
                <div className="hidden lg:flex gap-8 font-bold text-sm uppercase tracking-widest text-[#1A237E]">
                    <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
                    <a href="#" className="hover:text-[#FF6D00] transition-colors">Cultural Events</a>
                </div>

                {/* DYNAMIC RIGHT-SIDE BUTTONS */}
                <div className="flex items-center gap-3 md:gap-4">
                    {isLoggedIn ? (
                        // --- SHOW WHEN LOGGED IN ---
                        <>
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
                            
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-50 text-red-500 font-bold uppercase tracking-widest px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-red-500 hover:text-white transition-all text-[10px] md:text-xs"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // --- SHOW WHEN LOGGED OUT ---
                        <>
                            <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#1A237E] transition-all text-[10px] md:text-xs">
                                Login
                            </Link>
                            <Link to="/register" className="hidden sm:block bg-[#1A237E] text-white font-bold uppercase tracking-widest px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#FF6D00] transition-all text-[10px] md:text-xs">
                                Register
                            </Link>
                        </>
                    )}
                </div>
                
            </nav>
        </div>
    );
};

export default Navbar;