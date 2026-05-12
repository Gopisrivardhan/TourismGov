import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, PieChart, Shield, 
  Calendar, Layers, CheckCircle, Search, 
  Filter, Bell, AlertTriangle, X, Hash, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assumes you use the AuthContext we discussed

// --- SCOPE CONFIGURATION (Matches Java Enums) ---
const SCOPES = [
  { id: 'SITE', label: 'Heritage Sites', icon: <Layers />, img: 'src/assets/HeritageSiteReport.png', color: 'bg-orange-500' },
  { id: 'EVENT', label: 'Cultural Events', icon: <Calendar />, img: 'src/assets/eventreport.png', color: 'bg-pink-600' },
  { id: 'PROGRAM', label: 'Gov Programs', icon: <PieChart />, img: 'src/assets/ProgramReport.png', color: 'bg-indigo-600' },
  { id: 'COMPLIANCE', label: 'Compliance Audit', icon: <Shield />, img: 'src/assets/ComplienceReport.jpg', color: 'bg-emerald-600' },
];

const ReportPage = () => {
  const { user } = useAuth(); // Get userId and Role from JWT session
  
  // UI States
  const [selectedScope, setSelectedScope] = useState('SITE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });
  
  // Data States
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScope, setFilterScope] = useState('ALL');
  const [filterDate, setFilterDate] = useState('');

  // 1. IDENTITY CHECK (Frontend Guard)
  const isAuthorized = user?.role !== 'TOURIST';

  // 2. SEARCH & FILTER LOGIC (Separated & Combined)
  const filteredHistory = useMemo(() => {
    return history.filter(report => {
      const matchesName = report.generatedByName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          report.reportId.toString().includes(searchQuery);
      const matchesScope = filterScope === 'ALL' || report.scope === filterScope;
      const matchesDate = !filterDate || report.generatedDate.startsWith(filterDate);
      return matchesName && matchesScope && matchesDate;
    });
  }, [history, searchQuery, filterScope, filterDate]);

  // 3. ALERT SYSTEM (3-Second Self-Destruct)
  const triggerAlert = (msg) => {
    setAlert({ show: true, message: msg });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  // 4. BACKEND SIMULATION (Swap with Axios calls)
  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate POST /api/reports/generate
    setTimeout(() => {
      const newReport = {
        reportId: Math.floor(Math.random() * 9000) + 1000,
        scope: selectedScope,
        generatedByName: user?.name || "Omkar Choramale",
        generatedDate: new Date().toISOString(),
        status: "Generated"
      };
      setHistory([newReport, ...history]);
      setIsGenerating(false);
      triggerAlert(`SUCCESS: Official ${selectedScope} Report compiled and archived.`);
    }, 2000);
  };

  const handleDownload = (id) => {
    triggerAlert(`INITIATING DOWNLOAD: Report #TR-${id} encrypted transfer...`);
    // Logic for window.open(`/api/reports/download/${id}`)
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] p-4 md:p-8 pt-28 relative selection:bg-[#FF6D00] selection:text-white">
      
      {/* --- SEAMLESS SYSTEM ALERT --- */}
      <AnimatePresence>
        {alert.show && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-10 right-10 z-[1000] flex items-center gap-4 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-emerald-400/30 backdrop-blur-xl"
          >
            <CheckCircle size={20} className="animate-pulse" />
            <p className="text-sm font-black tracking-tight">{alert.message}</p>
            <motion.div 
              initial={{ width: "100%" }} animate={{ width: "0%" }} transition={{ duration: 3, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-white/40 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {!isAuthorized ? (
          /* ACCESS DENIED VIEW */
          <div className="h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="bg-red-50 p-8 rounded-[3rem] border-2 border-dashed border-red-200">
              <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black uppercase tracking-tighter">Clearance Required</h2>
              <p className="text-slate-400 mt-2 font-bold max-w-sm">Tourists are forbidden from generating internal government intelligence.</p>
              <Link to="/dashboard" className="mt-8 inline-block bg-[#1A237E] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#FF6D00] transition-all">Back to Dashboard</Link>
            </div>
          </div>
        ) : (
          /* AUTHORIZED VIEW */
          <div className="space-y-12">
            
            {/* HEADER */}
            <header>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-4">
                Internal <br /><span className="text-[#FF6D00]">Intelligence.</span>
              </h1>
              <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em]">Official Government Reporting Protocol</p>
            </header>

            {/* SCOPE SELECTION GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SCOPES.map((scope) => (
                <motion.div 
                  key={scope.id}
                  whileHover={{ y: -8 }}
                  onClick={() => setSelectedScope(scope.id)}
                  className={`relative h-64 rounded-[3rem] overflow-hidden cursor-pointer border-4 transition-all duration-500 ${selectedScope === scope.id ? 'border-[#FF6D00] shadow-2xl scale-[1.02]' : 'border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                  <img src={scope.img} className="absolute inset-0 w-full h-full object-cover" alt={scope.label} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A237E] via-[#1A237E]/40 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <div className={`${scope.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-lg`}>{scope.icon}</div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{scope.label}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* COMPILE BUTTON */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center justify-center gap-4 transition-all ${isGenerating ? 'bg-slate-100 text-slate-400' : 'bg-[#1A237E] text-white hover:bg-[#FF6D00]'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" /> Compiling Service Data...
                </>
              ) : (
                <>Generate {selectedScope} Intelligence Brief</>
              )}
            </motion.button>

            {/* ARCHIVE & SEARCH SECTION */}
            <section className="bg-white rounded-[4rem] p-8 md:p-14 shadow-2xl border border-slate-50">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-12 gap-8">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Audit Archive</h2>
                  <div className="h-1.5 w-12 bg-[#FF6D00] rounded-full mt-2" />
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="text" placeholder="Search by ID or Name..." 
                      className="bg-slate-50 border border-slate-100 pl-12 pr-6 py-4 rounded-2xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-[#FF6D00]/10 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-[#1A237E] outline-none cursor-pointer"
                    value={filterScope}
                    onChange={(e) => setFilterScope(e.target.value)}
                  >
                    <option value="ALL">All Departments</option>
                    <option value="SITE">Heritage Sites</option>
                    <option value="EVENT">Events</option>
                    <option value="PROGRAM">Programs</option>
                    <option value="COMPLIANCE">Compliance</option>
                  </select>
                  <input 
                    type="date" 
                    className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-[10px] font-black uppercase text-[#1A237E] outline-none"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              </div>

              {/* RESULTS LIST */}
              <div className="space-y-4">
                <AnimatePresence mode='popLayout'>
                  {filteredHistory.length > 0 ? filteredHistory.map((report) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                      key={report.reportId}
                      className="group flex flex-col md:flex-row justify-between items-center bg-slate-50/50 p-6 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#1A237E]">
                           <Hash size={20} />
                        </div>
                        <div>
                          <h4 className="font-black text-sm uppercase">Report #TR-{report.reportId}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {report.scope} • {new Date(report.generatedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100">
                           {report.status}
                        </span>
                        <motion.button 
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => handleDownload(report.reportId)}
                          className="bg-[#1A237E] p-4 rounded-2xl text-white shadow-lg hover:bg-[#FF6D00] transition-all"
                        >
                          <Download size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-20 text-center text-slate-300 font-black uppercase tracking-widest text-xs border-2 border-dashed border-slate-100 rounded-[3rem]">
                       No Intelligence Logs Found
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;