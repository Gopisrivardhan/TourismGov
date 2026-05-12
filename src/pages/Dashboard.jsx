import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, MapPin, Calendar, Users, 
  Wallet, ShieldCheck, CheckCircle2, Clock, 
  Bell, TrendingUp, AlertCircle, ChevronRight, X 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell 
} from 'recharts';

// --- VISUALIZATION DATA ---
const TREND_DATA = [
  { name: 'Mon', val: 400 }, { name: 'Tue', val: 300 },
  { name: 'Wed', val: 700 }, { name: 'Thu', val: 500 },
  { name: 'Fri', val: 900 }, { name: 'Sat', val: 1100 },
];

const Dashboard = ({ userRole = "ADMIN", dashboardData }) => {
  const [alert, setAlert] = useState({ show: false, msg: "" });
  
  // Simulation of the DTO from your Java Service
  const metrics = dashboardData?.metrics || {
    totalHeritageSites: 42,
    siteActivityPct: "85.5%",
    activeEvents: 12,
    totalBudget: "₹4.5Cr",
    pendingApprovals: 14,
    tripCompletionRate: "78%"
  };

  // 3-Second Emerald Alert Trigger
  const triggerAlert = (msg) => {
    setAlert({ show: true, msg });
    setTimeout(() => setAlert({ show: false, msg: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] pt-28 px-6 pb-20 selection:bg-[#FF6D00]">
      
      {/* --- SEAMLESS SYSTEM ALERT (Top Right) --- */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed top-10 right-10 z-[1000] flex items-center gap-4 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(5,150,105,0.3)] border border-white/20 backdrop-blur-md"
          >
            <CheckCircle2 size={20} className="text-emerald-100" />
            <span className="text-sm font-black tracking-tight">{alert.msg}</span>
            <button onClick={() => setAlert({show:false})} className="ml-2 hover:bg-white/10 rounded-full p-1"><X size={14}/></button>
            <motion.div 
              initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 3 }}
              className="absolute bottom-0 left-0 h-1 bg-white/40"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-[#FF6D00] text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg shadow-orange-500/20">Live System</span>
              <span className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em]">{userRole} AUTHENTICATED</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#1A237E] uppercase tracking-tighter leading-none">
              Operational <br /><span className="text-[#FF6D00]">Intelligence.</span>
            </h1>
          </motion.div>

          <div className="flex gap-3">
             <button onClick={() => triggerAlert("Data Sync Successful")} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1A237E] hover:bg-slate-50 transition-all active:scale-95">Refresh Metrics</button>
             <button onClick={() => triggerAlert("Exporting Executive Summary...")} className="bg-[#1A237E] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-[#FF6D00] transition-all active:scale-95">Export PDF</button>
          </div>
        </header>

        {/* --- DYNAMIC STATS GRID (Java Step 4 & 5 Mapping) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Common Metrics */}
          <StatCard label="Heritage Sites" value={metrics.totalHeritageSites} icon={<MapPin />} color="bg-indigo-600" />
          <StatCard label="Site Activity" value={metrics.siteActivityPct} icon={<TrendingUp />} color="bg-orange-500" />
          <StatCard label="Live Events" value={metrics.activeEvents} icon={<Calendar />} color="bg-pink-600" />

          {/* Role-Specific Metric Logic */}
          {userRole === 'TOURIST' && <StatCard label="Trip Success" value={metrics.tripCompletionRate} icon={<CheckCircle2 />} color="bg-teal-600" />}
          {userRole === 'ADMIN' && <StatCard label="Total Budget" value={metrics.totalBudget} icon={<Wallet />} color="bg-emerald-700" />}
          {userRole === 'OFFICER' && <StatCard label="Pending Tasks" value={metrics.pendingApprovals} icon={<Clock />} color="bg-red-600" />}
          {userRole === 'COMPLIANCE' && <StatCard label="Policy Alerts" value={metrics.policyViolations || 2} icon={<ShieldCheck />} color="bg-rose-700" />}
        </div>

        {/* --- VISUALIZATION COMMAND CENTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Chart: Ecosystem Trends */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 bg-white p-10 rounded-[3.5rem] shadow-2xl border border-slate-50 relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-[#1A237E]">Ecosystem Growth</h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Rolling 7-Day Visitor Flux</p>
               </div>
               <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 leading-none">+18.4%</span>
                  <p className="text-[8px] font-bold opacity-40 uppercase">Vs last week</p>
               </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <defs>
                    <linearGradient id="colorO" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF6D00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF6D00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#FF6D00" strokeWidth={5} fillOpacity={1} fill="url(#colorO)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Side Info: Role-Based Intelligence */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
             className="lg:col-span-4 bg-[#1A237E] rounded-[3.5rem] p-10 text-white shadow-2xl flex flex-col justify-between"
          >
            <div>
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6"><TrendingUp size={24} className="text-[#FF6D00]"/></div>
               <h3 className="text-2xl font-black uppercase leading-tight mb-4">Strategic <br />Briefing</h3>
               <p className="text-white/40 text-xs font-medium leading-relaxed">
                 Aggregate data verified across {metrics.totalHeritageSites} sites. System reliability at 99.9%.
               </p>
            </div>

            <div className="space-y-4 mt-8">
               <IntelligenceRow label="Active Programs" val={metrics.activePrograms || 8} />
               <IntelligenceRow label="Total Bookings" val={metrics.totalBookings || "840"} />
               <button onClick={() => triggerAlert("Accessing Real-time Database...")} className="w-full flex items-center justify-between group mt-4 pt-4 border-t border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6D00]">Full Audit Logs</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const StatCard = ({ label, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white p-7 rounded-[2.8rem] shadow-xl border border-slate-50 flex items-center gap-6"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</span>
      <span className="text-3xl font-black text-[#1A237E] tracking-tighter">{value}</span>
    </div>
  </motion.div>
);

const IntelligenceRow = ({ label, val }) => (
  <div className="flex justify-between items-center py-2 border-b border-white/5">
    <span className="text-[9px] font-black uppercase opacity-40">{label}</span>
    <span className="text-sm font-black tracking-tight">{val}</span>
  </div>
);

export default Dashboard;