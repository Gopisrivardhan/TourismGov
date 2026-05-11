import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ComplianceAPI, AuditAPI } from './apiService';
import ComplianceModal from './ComplianceModal';
import AuditModal from './AuditModal';
import UpdateComplianceModal from './UpdateComplianceModal';
import ReviewAuditModal from './ReviewAuditModal';

const GovernanceDashboard = () => {
    // --- Tab & Modal States ---
    const [activeTab, setActiveTab] = useState('COMPLIANCE'); 
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const [selectedCompliance, setSelectedCompliance] = useState(null);
    const [selectedAudit, setSelectedAudit] = useState(null); 

    // --- Filter States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterType, setFilterType] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // --- REAL DATA STATES (Initialized Empty) ---
    const [complianceRecords, setComplianceRecords] = useState([]);
    const [audits, setAudits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- FETCH DATA FROM SPRING BOOT ON LOAD ---
    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch Compliance Records
                const compData = await ComplianceAPI.getAll();
                // Spring Boot Page<T> holds the list inside 'content'
                setComplianceRecords(compData.content || []); 

                // Fetch Audits
                const auditData = await AuditAPI.getAll();
                // Audits API returns a direct List array
                setAudits(auditData || []);
            } catch (error) {
                console.error("Failed to load dashboard data from backend:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    // --- Computed Metrics (for Compliance) ---
    const complianceMetrics = useMemo(() => {
        return {
            total: complianceRecords.length,
            compliant: complianceRecords.filter(r => r.result === 'COMPLIANT').length,
            partially: complianceRecords.filter(r => r.result === 'PARTIALLY_COMPLIANT').length,
            non: complianceRecords.filter(r => r.result === 'NON_COMPLIANT').length,
            review: complianceRecords.filter(r => r.result === 'PENDING_REVIEW').length,
        };
    }, [complianceRecords]);

    // --- Filter Logic ---
    const filteredComplianceRecords = useMemo(() => {
        return complianceRecords.filter(record => {
            const matchesSearch = record.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  record.entityId?.toString().includes(searchTerm);
            
            const matchesStatus = filterStatus === 'ALL' || record.result === filterStatus;
            const matchesType = filterType === 'ALL' || record.type === filterType;
            
            let matchesDate = true;
            // Handle dates if backend sends them as strings or null
            const recordDateStr = record.date || record.createdAt;
            if (recordDateStr) {
                const recordDate = new Date(recordDateStr).setHours(0, 0, 0, 0);
                if (startDate) matchesDate = matchesDate && recordDate >= new Date(startDate).setHours(0, 0, 0, 0);
                if (endDate) matchesDate = matchesDate && recordDate <= new Date(endDate).setHours(0, 0, 0, 0);
            }

            return matchesSearch && matchesStatus && matchesType && matchesDate;
        });
    }, [complianceRecords, searchTerm, filterStatus, filterType, startDate, endDate]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setFilterStatus('ALL');
        setFilterType('ALL');
        setStartDate('');
        setEndDate('');
    };

    // --- REAL AXIOS CREATION HANDLERS ---
    const handleCreateCompliance = async (formData) => {
        try {
            const newRecord = await ComplianceAPI.create(formData);
            // Instantly update UI with the real saved database record
            setComplianceRecords([newRecord, ...complianceRecords]);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error creating compliance record. Check console for details.");
        }
    };

    const handleCreateAudit = async (formData) => {
        try {
            const newAudit = await AuditAPI.create(formData);
            // Instantly update UI with the real saved database record
            setAudits([newAudit, ...audits]);
        } catch (error) {
            console.error("Audit submission failed", error);
            alert("Error creating audit. Check console for details.");
        }
    };

    // --- REAL AXIOS UPDATE HANDLERS ---
    const handleUpdateComplianceResult = async (recordId, newResult) => {
        try {
            const updatedRecord = await ComplianceAPI.updateResult(recordId, newResult);
            // Replace old object with the returned updated object from DB
            setComplianceRecords(prevRecords => 
                prevRecords.map(record => record.complianceId === recordId ? updatedRecord : record)
            );
        } catch (error) {
            console.error("Update failed", error);
            alert("Error updating compliance result.");
        }
    };

    const handleUpdateAudit = async (auditId, updateData) => {
        try {
            const updatedAudit = await AuditAPI.update(auditId, updateData);
            // Replace old object with the returned updated object from DB
            setAudits(prevAudits => 
                prevAudits.map(audit => audit.auditId === auditId ? updatedAudit : audit)
            );
        } catch (error) {
            console.error("Audit update failed", error);
            alert("Error updating audit.");
        }
    };

    // --- UI HELPERS ---
    const openUpdateModal = (record) => {
        setSelectedCompliance(record);
        setIsUpdateModalOpen(true);
    };

    const openReviewModal = (audit) => {
        setSelectedAudit(audit);
        setIsReviewModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            COMPLIANT: 'bg-[#004D40]/10 text-[#004D40]',
            COMPLETED: 'bg-[#004D40]/10 text-[#004D40]',
            PENDING_REVIEW: 'bg-[#FF6D00]/10 text-[#FF6D00]',
            PARTIALLY_COMPLIANT: 'bg-blue-100 text-blue-800',
            IN_PROGRESS: 'bg-[#FF6D00]/10 text-[#FF6D00]',
            NON_COMPLIANT: 'bg-[#880E4F]/10 text-[#880E4F]',
            CANCELLED: 'bg-gray-200 text-gray-700'
        };
        const colorClass = styles[status] || 'bg-gray-100 text-gray-600';
        return (
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
                {status ? status.replace('_', ' ') : 'UNKNOWN'}
            </span>
        );
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-[#1A237E] font-bold text-xl">Connecting to Backend...</div>;
    }

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white pb-20">
            {/* Navigation */}
            <div className="absolute top-0 left-0 w-full z-50 p-4 md:p-6">
                <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-full px-5 md:px-8 py-3 flex justify-between items-center shadow-2xl border border-white/20">
                    <div className="text-[#1A237E] text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                        <span className="hidden sm:block">TourismGov</span>
                        <span className="block sm:hidden">TourismGov</span>
                    </div>

                    <div className="hidden lg:flex gap-6 font-bold text-xs uppercase tracking-widest text-[#1A237E]">
                        <Link to="/" className="hover:text-[#FF6D00] transition-colors">Home</Link>
                        <a href="#" className="hover:text-[#FF6D00] transition-colors">Heritage Sites</a>
                        <a href="#" className="text-[#FF6D00] transition-colors">Governance</a>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="bg-[#1A237E] text-white font-bold uppercase tracking-widest px-4 py-2 md:px-6 md:py-2 text-[10px] md:text-xs rounded-full shadow-md cursor-pointer">
                            Officer Panel
                        </div>
                    </div>
                </nav>
            </div>

            {/* Header */}
            <header className="pt-32 md:pt-40 pb-8 px-6 md:px-12 max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <span className="text-[#FF6D00] font-bold uppercase tracking-widest text-xs mb-2 block">Administration</span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-[#1A237E] leading-none">
                            Governance <br /> & Oversight
                        </h1>
                    </div>
                    
                    <div className="flex bg-white shadow-xl rounded-full p-1.5 border border-[#1A237E]/10">
                        <button 
                            onClick={() => setActiveTab('COMPLIANCE')}
                            className={`px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'COMPLIANCE' ? 'bg-[#1A237E] text-white shadow-md' : 'text-[#1A237E] hover:bg-gray-50'}`}
                        >
                            Compliance Records
                        </button>
                        <button 
                            onClick={() => setActiveTab('AUDITS')}
                            className={`px-6 py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 ${activeTab === 'AUDITS' ? 'bg-[#FF6D00] text-white shadow-md' : 'text-[#1A237E] hover:bg-gray-50'}`}
                        >
                            Official Audits
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-screen-2xl mx-auto px-4 md:px-6">
                
                {/* ---------- METRICS CARDS ---------- */}
                {activeTab === 'COMPLIANCE' && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-[1rem] p-5 shadow-sm border border-gray-100 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#004D40] mb-2">Total Records</span>
                            <span className="text-3xl font-black text-[#1A237E]">{complianceMetrics.total}</span>
                        </div>
                        <div className="bg-[#f0fdf4] rounded-[1rem] p-5 shadow-sm border border-green-100 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-2">Compliant</span>
                            <span className="text-3xl font-black text-green-800">{complianceMetrics.compliant}</span>
                        </div>
                        <div className="bg-blue-50 rounded-[1rem] p-5 shadow-sm border border-blue-100 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 mb-2">Partially Compliant</span>
                            <span className="text-3xl font-black text-blue-800">{complianceMetrics.partially}</span>
                        </div>
                        <div className="bg-red-50 rounded-[1rem] p-5 shadow-sm border border-red-100 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-700 mb-2">Non Compliant</span>
                            <span className="text-3xl font-black text-red-800">{complianceMetrics.non}</span>
                        </div>
                        <div className="bg-yellow-50 rounded-[1rem] p-5 shadow-sm border border-yellow-100 flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-700 mb-2">Under Review</span>
                            <span className="text-3xl font-black text-yellow-800">{complianceMetrics.review}</span>
                        </div>
                    </div>
                )}

                {/* ---------- FILTER BAR ---------- */}
                <div className="flex flex-col lg:flex-row justify-between items-center bg-white rounded-[1.5rem] p-3 shadow-md border border-gray-100 mb-8 gap-4">
                    {activeTab === 'COMPLIANCE' ? (
                        <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative w-full lg:w-48">
                                <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                                <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20" />
                            </div>
                            
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full lg:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20">
                                <option value="ALL">All Status</option>
                                <option value="COMPLIANT">Compliant</option>
                                <option value="PARTIALLY_COMPLIANT">Partially Compliant</option>
                                <option value="NON_COMPLIANT">Non Compliant</option>
                                <option value="PENDING_REVIEW">Under Review</option>
                            </select>

                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full lg:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20">
                                <option value="ALL">All Types</option>
                                <option value="SITE">Site</option>
                                <option value="EVENT">Event</option>
                                <option value="PROGRAM">Program</option>
                            </select>

                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full lg:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full lg:w-auto px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#1A237E]/20" />

                            <button onClick={handleClearFilters} className="w-full lg:w-auto px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold uppercase tracking-widest text-[10px] rounded-xl transition-colors">Clear</button>
                        </div>
                    ) : (
                        <div className="flex-1">
                            <h2 className="text-lg font-black uppercase tracking-widest text-[#1A237E] ml-4">Official Audit Registry</h2>
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            if (activeTab === 'COMPLIANCE') setIsComplianceModalOpen(true);
                            else setIsAuditModalOpen(true);
                        }}
                        className="w-full lg:w-auto bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-6 py-3 text-xs rounded-xl hover:bg-[#1A237E] shadow-md transition-all duration-300"
                    >
                        + New {activeTab === 'COMPLIANCE' ? 'Check' : 'Audit'}
                    </button>
                </div>

                {/* ---------- DATA TABLE ---------- */}
                <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100">
                                    {activeTab === 'COMPLIANCE' ? (
                                        <>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Ref Number</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Entity Type</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Entity ID</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Status</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Date Logged</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60 text-right">Actions</th>
                                        </>
                                    ) : (
                                        <>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Audit ID</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Scope</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Findings</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Status</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60">Date</th>
                                            <th className="p-6 font-black uppercase tracking-widest text-xs text-[#1A237E]/60 text-right">Actions</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'COMPLIANCE' && filteredComplianceRecords.length === 0 && (
                                    <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-medium">No compliance records found.</td></tr>
                                )}
                                
                                {activeTab === 'COMPLIANCE' && filteredComplianceRecords.map((record) => (
                                    <tr key={record.complianceId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6 font-bold">{record.referenceNumber}</td>
                                        <td className="p-6 font-medium">{record.type}</td>
                                        <td className="p-6 font-medium">#{record.entityId}</td>
                                        <td className="p-6">{getStatusBadge(record.result)}</td>
                                        <td className="p-6 text-sm text-gray-500">
                                            {record.createdAt || record.date ? new Date(record.createdAt || record.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button onClick={() => openUpdateModal(record)} className="text-[#1A237E] font-bold text-[10px] uppercase tracking-widest hover:text-[#FF6D00] transition-colors">
                                                Update &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === 'AUDITS' && audits.length === 0 && (
                                    <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-medium">No official audits found.</td></tr>
                                )}

                                {activeTab === 'AUDITS' && audits.map((audit) => (
                                    <tr key={audit.auditId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6 font-bold">#{audit.auditId}</td>
                                        <td className="p-6 font-medium">{audit.scope}</td>
                                        <td className="p-6 text-sm text-gray-600 truncate max-w-xs">{audit.findings || '-'}</td>
                                        <td className="p-6">{getStatusBadge(audit.status)}</td>
                                        <td className="p-6 text-sm text-gray-500">
                                            {audit.date ? new Date(audit.date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <button onClick={() => openReviewModal(audit)} className="text-[#1A237E] font-bold text-[10px] uppercase tracking-widest hover:text-[#FF6D00] transition-colors">
                                                Review &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* MODALS */}
            <ComplianceModal isOpen={isComplianceModalOpen} onClose={() => setIsComplianceModalOpen(false)} onSubmit={handleCreateCompliance} />
            <AuditModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} onSubmit={handleCreateAudit} />
            <UpdateComplianceModal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} onSubmit={handleUpdateComplianceResult} record={selectedCompliance} />
            <ReviewAuditModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} onSubmit={handleUpdateAudit} audit={selectedAudit} />
            
        </div>
    );
};

export default GovernanceDashboard;