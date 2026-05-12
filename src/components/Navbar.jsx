import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Ensure you have lucide-react installed: npm install lucide-react
import { Bell, LayoutDashboard, FileText, User, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("");

    // --- OLD LOGIC PRESERVED ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role'); // Added to handle Report visibility
        if (token) {
            setIsLoggedIn(true);
            setRole(userRole || "TOURIST");
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    // --- OLD LOGIC PRESERVED ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/');
    };

    // Helper to check if user can see Intelligence Reports (Module 7 logic)
    const canSeeReports = isLoggedIn && role !== 'TOURIST';

    return (
        <div className="absolute top-0 left-0 w-full z-50 p-6">
            <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-8 py-4 flex justify-between items-center shadow-xl border border-white/20">
                
                {/* LOGO */}
                <Link to="/" className="text-[#1A237E] text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-2">
                    <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FF6D00]"></span>
                    TourismGov
                </Link>

                {/* MIDDLE LINKS - Preserved + Functionality Added */}
                <div className="hidden lg:flex gap-8 font-bold text-[11px] uppercase tracking-widest text-[#1A237E]">
                    <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
                    <a href="#" className="hover:text-[#FF6D00] transition-colors">Cultural Events</a>
                    
                    {/* ADDED: Reports link (Module 7) */}
                    {canSeeReports && (
                        <Link to="/reports" className={`flex items-center gap-2 transition-colors ${location.pathname === '/reports' ? 'text-[#FF6D00]' : 'hover:text-[#FF6D00]'}`}>
                            <FileText size={14} /> Reports
                        </Link>
                    )}
                </div>

                {/* DYNAMIC RIGHT-SIDE BUTTONS */}
                <div className="flex items-center gap-3 md:gap-5">
                    {isLoggedIn ? (
                        <>
                            {/* ADDED: Notification Icon (Module 8) */}
                            <div className="relative cursor-pointer group p-2 hover:bg-slate-100 rounded-full transition-all">
                                <Bell size={20} className="text-[#1A237E] group-hover:text-[#FF6D00]" />
                                <span className="absolute top-1 right-1 bg-[#FF6D00] text-white text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                                    3
                                </span>
                            </div>

                            {/* DASHBOARD & PROFILE */}
                            <Link to="/dashboard" className="flex items-center gap-2 bg-[#F8F9FF] px-4 py-2 rounded-full border border-[#1A237E]/10 hover:border-[#FF6D00] transition-all">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase text-[#1A237E]">Dashboard</p>
                                    <p className="text-[9px] font-bold text-[#FF6D00] uppercase tracking-widest">{role}</p>
                                </div>
                                <div className="w-8 h-8 bg-[#1A237E] rounded-full text-white flex items-center justify-center font-bold text-xs shadow-lg">
                                    <User size={14} />
                                </div>
                            </Link>
                            
                            <button 
                                onClick={handleLogout} 
                                className="bg-red-50 text-red-500 font-black uppercase tracking-widest px-5 py-2 md:px-6 md:py-2.5 rounded-full hover:bg-red-500 hover:text-white transition-all text-[9px]"
                            >
                                <LogOut size={14} className="inline mr-1" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#1A237E] transition-all text-[10px] md:text-xs shadow-lg shadow-orange-500/20">
                                Login
                            </Link>
                            <Link to="/register" className="hidden sm:block bg-[#1A237E] text-white font-bold uppercase tracking-widest px-5 py-2 md:px-6 md:py-3 rounded-full hover:bg-[#FF6D00] transition-all text-[10px] md:text-xs shadow-lg shadow-indigo-500/20">
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