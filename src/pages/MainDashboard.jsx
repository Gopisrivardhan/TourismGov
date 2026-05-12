import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboardService } from '../services/dashboardService';
import { getUser } from '../utils/auth';
import { Bell, Activity, LayoutDashboard, Calendar, MapPin, CheckCircle, FileSearch, Inbox, PieChart as PieChartIcon } from 'lucide-react';
import NotificationsPanel from '../components/NotificationsPanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './MainDashboard.css';

const roleConfigs = {
    TOURIST: {
        gradient: 'from-emerald-900/90 to-teal-900/80',
        textColor: 'from-emerald-400 to-teal-300',
        badgeColor: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-emerald-400',
        cardGradient: 'from-emerald-500 to-teal-500',
        cardBg: 'bg-emerald-50',
        cardIconColor: 'text-emerald-600',
        cardHoverBg: 'group-hover:bg-emerald-100',
        chartColors: ['#10b981', '#14b8a6']
    },
    OFFICER: {
        gradient: 'from-blue-900/90 to-cyan-900/80',
        textColor: 'from-blue-400 to-cyan-300',
        badgeColor: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]',
        image: 'https://images.unsplash.com/photo-1541888087616-56af7b56ff77?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-blue-400',
        cardGradient: 'from-blue-500 to-cyan-500',
        cardBg: 'bg-blue-50',
        cardIconColor: 'text-blue-600',
        cardHoverBg: 'group-hover:bg-blue-100',
        chartColors: ['#3b82f6', '#06b6d4']
    },
    MANAGER: {
        gradient: 'from-indigo-900/90 to-purple-900/80',
        textColor: 'from-orange-400 to-yellow-300',
        badgeColor: 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-orange-400',
        cardGradient: 'from-indigo-500 to-purple-500',
        cardBg: 'bg-indigo-50',
        cardIconColor: 'text-indigo-600',
        cardHoverBg: 'group-hover:bg-indigo-100',
        chartColors: ['#4f46e5', '#9333ea']
    },
    ADMIN: {
        gradient: 'from-slate-900/95 to-slate-800/90',
        textColor: 'from-white to-slate-300',
        badgeColor: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-white',
        cardGradient: 'from-slate-700 to-slate-900',
        cardBg: 'bg-slate-100',
        cardIconColor: 'text-slate-800',
        cardHoverBg: 'group-hover:bg-slate-200',
        chartColors: ['#1e293b', '#334155']
    },
    COMPLIANCE: {
        gradient: 'from-amber-900/90 to-orange-900/80',
        textColor: 'from-amber-300 to-yellow-200',
        badgeColor: 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)]',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-amber-400',
        cardGradient: 'from-amber-500 to-orange-500',
        cardBg: 'bg-amber-50',
        cardIconColor: 'text-amber-600',
        cardHoverBg: 'group-hover:bg-amber-100',
        chartColors: ['#f59e0b', '#f97316']
    },
    AUDITOR: {
        gradient: 'from-rose-900/90 to-red-900/80',
        textColor: 'from-rose-300 to-red-300',
        badgeColor: 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,1)]',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000',
        iconColor: 'text-rose-400',
        cardGradient: 'from-rose-500 to-red-500',
        cardBg: 'bg-rose-50',
        cardIconColor: 'text-rose-600',
        cardHoverBg: 'group-hover:bg-rose-100',
        chartColors: ['#f43f5e', '#ef4444']
    }
};

const MainDashboard = () => {
    const user = getUser();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            if (!user) return;
            try {
                const response = await dashboardService.getDashboardMetrics(user.role, user.userId);
                setData(response);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [user]);

    if (!user) {
        window.location.href = '/login';
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-bold text-slate-700 tracking-tight">Loading Workspace...</h2>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-500 font-bold">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }

    // Prepare chart data by filtering out percentage strings and keeping numeric values
    const chartData = Object.entries(data.metrics || {})
        .filter(([key, value]) => typeof value === 'number')
        .map(([key, value]) => ({
            name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // camelCase to Title Case
            value: value
        }));

    const getMetricIcon = (key) => {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('event')) return Calendar;
        if (keyLower.includes('site')) return MapPin;
        if (keyLower.includes('rate') || keyLower.includes('pct')) return CheckCircle;
        if (keyLower.includes('doc') || keyLower.includes('audit')) return FileSearch;
        if (keyLower.includes('pending') || keyLower.includes('inbox') || keyLower.includes('approval') || keyLower.includes('violation')) return Inbox;
        return Activity;
    };

    const currentRole = data?.role?.toUpperCase() || 'MANAGER';
    const theme = roleConfigs[currentRole] || roleConfigs.MANAGER;

    return (
        <div className="bg-transparent w-full">
            <main className="w-full">
                
                {/* Visual Banner Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 relative overflow-hidden rounded-[2rem] shadow-2xl"
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${theme.gradient} z-10 mix-blend-multiply`}></div>
                    <img src={theme.image} alt="Dashboard Cover" className="w-full h-48 md:h-64 object-cover" />
                    
                    <div className="absolute inset-0 z-20 p-8 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6 h-full">
                        <div className="mt-auto">
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-4">
                                <LayoutDashboard className={`w-10 h-10 ${theme.iconColor}`} />
                                Welcome back, <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme.textColor}`}>{data.userName}</span>
                            </h1>
                            <p className="text-white/80 mt-2 font-semibold text-lg uppercase tracking-wider flex items-center gap-2 drop-shadow ml-14">
                                <span className={`w-2 h-2 rounded-full ${theme.badgeColor} animate-pulse`}></span>
                                {data.role} WORKSPACE
                            </p>
                        </div>

                        {/* Interactive Notification Bell */}
                        <button 
                            onClick={() => setIsNotificationsOpen(true)}
                            className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-5 py-3 rounded-2xl flex items-center gap-3 font-bold shadow-xl hover:bg-white/30 transition-all active:scale-95"
                        >
                            <div className="relative">
                                <Bell className={`w-6 h-6 ${data.unreadNotifications > 0 ? 'text-yellow-300 animate-pulse' : 'text-white'}`} />
                                {data.unreadNotifications > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-transparent"></span>
                                )}
                            </div>
                            {data.unreadNotifications > 0 ? `${data.unreadNotifications} Unread` : 'Notifications'}
                        </button>
                    </div>
                </motion.div>

                {/* Dynamic Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {Object.entries(data.metrics || {}).map(([key, value], index) => {
                        const IconComponent = getMetricIcon(key);
                        return (
                            <motion.div 
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }} 
                                className="bg-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden group border border-slate-100"
                            >
                                <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${theme.cardGradient} rounded-full opacity-[0.03] group-hover:scale-150 group-hover:opacity-10 transition-all duration-700`}></div>
                                <div className="flex items-start justify-between relative z-10">
                                    <div className={`p-3 rounded-2xl ${theme.cardBg} mb-4 ${theme.cardHoverBg} transition-colors`}>
                                        <IconComponent className={`w-6 h-6 ${theme.cardIconColor}`} />
                                    </div>
                                </div>
                                <div className="relative z-10 mt-2">
                                    <h3 className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-1">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </h3>
                                    <p className="text-4xl font-black text-slate-800 tracking-tight">{value}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Data Chart Section */}
                {chartData.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100"
                    >
                        <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">
                            <PieChartIcon className={`w-6 h-6 ${theme.cardIconColor}`} />
                            Activity Graph
                        </h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                    <Tooltip 
                                        cursor={{ fill: '#f8fafc' }} 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                                    />
                                    <Bar dataKey="value" fill="url(#colorGradient)" radius={[8, 8, 8, 8]} />
                                    <defs>
                                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={theme.chartColors[0]} />
                                            <stop offset="100%" stopColor={theme.chartColors[1]} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Notifications Side Panel */}
                <NotificationsPanel 
                    isOpen={isNotificationsOpen} 
                    onClose={() => setIsNotificationsOpen(false)} 
                />

            </main>
        </div>
    );
};

export default MainDashboard;
