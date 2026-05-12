import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Bell, LogOut, Menu, X } from 'lucide-react';
import { getUser, logout } from '../utils/auth';

const DashboardLayout = ({ children }) => {
    const user = getUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userRole = user?.role?.toUpperCase();

    const navigation = [
        { name: 'Dashboard', href: '/main-dashboard', icon: LayoutDashboard, show: true },
        { name: 'Reports', href: '/reports', icon: FileText, show: ['MANAGER', 'ADMIN', 'OFFICER', 'COMPLIANCE', 'AUDITOR'].includes(userRole) },
        { name: 'Notifications', href: '/notifications', icon: Bell, show: true },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Navigation */}
            <motion.div 
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#1A237E] text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                        <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                            TourismGov
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Profile */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-bold text-xl text-[#FF6D00]">
                                {user?.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold">{user?.name || 'User Profile'}</h3>
                                <span className="text-xs font-semibold text-white/50 uppercase tracking-widest">{user?.role || 'TOURIST'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => item.show && (
                            <Link 
                                key={item.name} 
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                    location.pathname === item.href 
                                    ? 'bg-[#FF6D00] text-white font-bold shadow-lg shadow-[#FF6D00]/20' 
                                    : 'text-white/60 hover:bg-white/5 hover:text-white font-medium'
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${location.pathname === item.href ? 'text-white' : 'text-white/50'}`} />
                                {item.name}
                            </Link>
                        ))}
                        
                    </nav>

                    {/* Footer / Logout */}
                    <div className="p-4 border-t border-white/10">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-400 font-bold transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            Secure Logout
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden h-20 bg-white border-b border-slate-200 flex items-center px-6">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-500 hover:text-indigo-600 transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-black tracking-tighter text-xl text-[#1A237E]">TourismGov</span>
                </header>

                <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
