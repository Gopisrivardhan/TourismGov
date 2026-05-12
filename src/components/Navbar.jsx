import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userName, role = "TOURIST" }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="bg-[#1A237E] p-4 px-6 md:px-10 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                TourismGov
            </Link>

            {/* Central Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-white/70">
                <Link to="/" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Home</Link>
                <Link to="/programs" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Programs</Link>
                <Link to="/events" className="hover:text-white hover:border-b-2 border-[#FF6D00] pb-1 transition-all">Events</Link>
            </nav>

            {/* User & Logout */}
            <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6D00]">
                        {role}
                    </span>
                    <span className="text-sm font-black uppercase">
                        {userName || "User"}
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
    );
};

export default Navbar;