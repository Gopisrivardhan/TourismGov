import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Calendar, Users, Wallet, ShieldCheck, 
  Clock, TrendingUp, Loader2, FileSearch 
} from 'lucide-react';
import { dashboardApi, notificationApi } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [latestNotif, setLatestNotif] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // 1. Fetch Aggregated Metrics (DashboardServiceImpl.java)
        const response = await dashboardApi.getStats();
        setData(response.data);

        // 2. Fetch Latest Unread Notification for the Navbar Bell dropdown
        const notifRes = await notificationApi.getUnread();
        if (notifRes.data && notifRes.data.length > 0) {
          setLatestNotif(notifRes.data[0]); // Take the most recent one
        }
      } catch (err) {
        console.error("Dashboard Synchronization Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF7]">
      <Loader2 size={48} className="text-[#FF6D00] animate-spin mb-4" />
      <p className="font-black uppercase text-xs tracking-widest text-[#1A237E]">Synchronizing Role-Based Intelligence...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans flex flex-col">
      {/* Pass real-time data to your glassy Navbar 
        unreadNotifications comes from DashboardDTO
      */}
      <Navbar 
        unreadNotifications={data?.unreadNotifications || 0} 
        latestNotification={latestNotif} 
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-20">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#FF6D00] text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
              Live System Status
            </span>
            <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">
              {data?.role} CLEARANCE LEVEL
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
            Operational <br /><span className="text-[#FF6D00]">Intelligence.</span>
          </h1>
          <p className="mt-4 font-bold opacity-60 text-lg">System initialized for {data?.userName}.</p>
        </header>

        {/* --- METRICS GRID --- 
            Directly iterates over the LinkedHashMap from DashboardServiceImpl
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data?.metrics && Object.entries(data.metrics).map(([key, value]) => (
            <StatCard 
              key={key}
              label={key.replace(/([A-Z])/g, ' $1').trim()} 
              value={value} 
              icon={getIconForMetric(key)} 
              color={getColorForMetric(key, data.role)} 
            />
          ))}
        </div>

        {/* Strategic Actions section removed to keep dashboard clean as requested */}
      </main>

      <Footer />
    </div>
  );
};

// --- LOGIC HELPERS ---

const getIconForMetric = (key) => {
  const k = key.toLowerCase();
  if (k.includes('site')) return <MapPin />;
  if (k.includes('event')) return <Calendar />;
  if (k.includes('budget')) return <Wallet />;
  if (k.includes('user')) return <Users />;
  if (k.includes('compliance') || k.includes('violation')) return <ShieldCheck />;
  if (k.includes('audit')) return <FileSearch />;
  if (k.includes('pending') || k.includes('upcoming')) return <Clock />;
  return <TrendingUp />;
};

const getColorForMetric = (key, role) => {
  const k = key.toLowerCase();
  if (k.includes('violation') || k.includes('fail')) return 'bg-rose-600 shadow-rose-500/20';
  if (k.includes('budget')) return 'bg-emerald-600 shadow-emerald-500/20';
  if (role === 'ADMIN' || role === 'MANAGER') return 'bg-[#1A237E] shadow-indigo-500/20';
  return 'bg-[#FF6D00] shadow-orange-500/20';
};

const StatCard = ({ label, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white p-8 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white flex items-center gap-8"
  >
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl ${color}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <span className="text-3xl font-black text-[#1A237E] tracking-tighter leading-none">{value}</span>
    </div>
  </motion.div>
);

export default Dashboard;