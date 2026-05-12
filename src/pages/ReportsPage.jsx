import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { reportService } from '../services/reportService';
import { getUser } from '../utils/auth';
import { FileText, Download, Loader2, Calendar, ShieldAlert, CheckCircle, Search, MapPin, Ticket, FolderKanban, ShieldCheck, PieChart as PieChartIcon } from 'lucide-react';
import { useAlert } from '../components/AlertProvider';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import './ReportsPage.css';

const ReportsPage = () => {
    const user = getUser();
    const { showAlert } = useAlert();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    
    // For Generation
    const [scope, setScope] = useState('SITE');
    
    // For History Searching
    const [searchDate, setSearchDate] = useState('');
    const [searchScope, setSearchScope] = useState('ALL');

    useEffect(() => {
        if (user && user.role !== 'TOURIST') {
            fetchHistory();
        }
    }, [user, searchDate, searchScope]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const queryScope = searchScope === 'ALL' ? null : searchScope;
            const data = await reportService.getReportHistory(user.userId, queryScope, searchDate || null);
            setReports(data || []);
        } catch (error) {
            console.error("Failed to fetch reports history", error);
            setReports([]); // Handle error gracefully
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        try {
            setGenerating(true);
            await reportService.generateReport({ scope, requesterId: user.userId });
            showAlert(`Successfully generated ${scope} report!`, 'success');
            await fetchHistory();
        } catch (error) {
            console.error("Failed to generate report", error);
            showAlert("Error generating report: " + (error?.response?.data?.message || error.message), 'error');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (id, scopeName) => {
        try {
            const data = await reportService.downloadReport(id);
            const blob = new Blob([data], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Report_${scopeName}_${id}.txt`;
            a.click();
            showAlert(`Report downloaded successfully!`, 'success');
        } catch (error) {
            console.error("Failed to download report", error);
            showAlert("Failed to download report.", 'error');
        }
    };

    if (!user || user.role === 'TOURIST') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">
                <div className="text-center space-y-4">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto" />
                    <h1 className="text-2xl font-bold">Access Denied</h1>
                    <p className="text-slate-500">You do not have permission to view government reports.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reports-container bg-transparent pt-0 px-0 min-h-0 pb-0">
            <main className="w-full max-w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                        <FileText className="w-10 h-10 text-indigo-600" />
                        Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Reports</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Generate and download official tourism and compliance data logs.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Generate Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="reports-panel generate-panel"
                    >
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">1</span>
                            Generate New
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <CategoryCard 
                                    selected={scope === 'SITE'} 
                                    onClick={() => setScope('SITE')} 
                                    title="Sites" 
                                    icon={MapPin} 
                                />
                                <CategoryCard 
                                    selected={scope === 'EVENT'} 
                                    onClick={() => setScope('EVENT')} 
                                    title="Events" 
                                    icon={Ticket} 
                                />
                                <CategoryCard 
                                    selected={scope === 'PROGRAM'} 
                                    onClick={() => setScope('PROGRAM')} 
                                    title="Programs" 
                                    icon={FolderKanban} 
                                />
                                <CategoryCard 
                                    selected={scope === 'COMPLIANCE'} 
                                    onClick={() => setScope('COMPLIANCE')} 
                                    title="Compliance" 
                                    icon={ShieldCheck} 
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70"
                            >
                                {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                                {generating ? 'Compiling Data...' : 'Generate Report'}
                            </button>
                        </div>
                    </motion.div>

                    {/* History Panel */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 reports-panel history-panel"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">2</span>
                                Report History
                            </h2>

                            <div className="flex flex-wrap items-center gap-3">
                                <select 
                                    value={searchScope}
                                    onChange={(e) => setSearchScope(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none"
                                >
                                    <option value="ALL">All Categories</option>
                                    <option value="SITE">Sites</option>
                                    <option value="EVENT">Events</option>
                                    <option value="PROGRAM">Programs</option>
                                    <option value="COMPLIANCE">Compliance</option>
                                </select>

                                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                    <Search className="w-4 h-4 text-slate-400 ml-2" />
                                    <input 
                                        type="date" 
                                        value={searchDate}
                                        onChange={(e) => setSearchDate(e.target.value)}
                                        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        {reports.length > 0 && (
                            <div className="mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center gap-8">
                                <div className="h-48 w-full md:w-1/2">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Sites', value: reports.filter(r => r.scope === 'SITE').length },
                                                    { name: 'Events', value: reports.filter(r => r.scope === 'EVENT').length },
                                                    { name: 'Programs', value: reports.filter(r => r.scope === 'PROGRAM').length },
                                                    { name: 'Compliance', value: reports.filter(r => r.scope === 'COMPLIANCE').length }
                                                ].filter(d => d.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                <Cell fill="#6366f1" />
                                                <Cell fill="#10b981" />
                                                <Cell fill="#f59e0b" />
                                                <Cell fill="#ef4444" />
                                            </Pie>
                                            <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="md:w-1/2 space-y-2">
                                    <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        <PieChartIcon className="w-5 h-5 text-indigo-500" />
                                        Distribution
                                    </h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">
                                        Based on your current history search criteria, you have generated a total of {reports.length} reports. Use the dropdowns above to filter specific operational scopes.
                                    </p>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p className="font-semibold animate-pulse">Loading secure records...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="text-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="font-medium">No reports found for this scope/date.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reports.map((report, i) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={report.reportId}
                                        className="history-item group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                                <FileText className="w-6 h-6 text-indigo-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">
                                                    {report.scope} Data Log
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(report.generatedDate).toLocaleString()}</span>
                                                    <span>•</span>
                                                    <span>By: {report.generatedByName}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => handleDownload(report.reportId, report.scope)}
                                            className="mt-4 sm:mt-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 font-bold text-sm rounded-xl transition-all shadow-sm group-hover:shadow-md"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

const CategoryCard = ({ selected, onClick, title, icon: Icon }) => (
    <div 
        onClick={onClick}
        className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${
            selected ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500 hover:border-indigo-200 hover:bg-slate-50'
        }`}
    >
        <Icon className={`w-8 h-8 ${selected ? 'text-indigo-600' : 'text-slate-400'}`} />
        <span className="font-bold text-xs uppercase tracking-wide">{title}</span>
    </div>
);

export default ReportsPage;
