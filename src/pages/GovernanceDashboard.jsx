import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ComplianceModal from './ComplianceModal';
import AuditModal from './AuditModal';
import UpdateComplianceModal from './UpdateComplianceModal'; // Add this import

const GovernanceDashboard = () => {
    // Tab State
    const [activeTab, setActiveTab] = useState('COMPLIANCE'); 
    
    // Modal States
    const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
    const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
    
    // State for the Update Modal
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedCompliance, setSelectedCompliance] = useState(null); // Tracks the record being edited

    // Mock Data States
    const [complianceRecords, setComplianceRecords] = useState([
        { complianceId: 1, referenceNumber: 'REF-2026-001', entityId: 101, type: 'SITE', result: 'COMPLIANT', date: '2026-05-10T10:00:00' },
        { complianceId: 2, referenceNumber: 'REF-2026-002', entityId: 405, type: 'EVENT', result: 'PENDING_REVIEW', date: '2026-05-09T14:30:00' },
        { complianceId: 3, referenceNumber: 'REF-2026-003', entityId: 202, type: 'PROGRAM', result: 'NON_COMPLIANT', date: '2026-05-08T09:15:00' },
    ]);

    const [audits, setAudits] = useState([
        { auditId: 1, officerId: 88, scope: 'Jaipur Fort Preservation', findings: 'All safety guidelines met.', date: '2026-05-01T11:00:00', status: 'COMPLETED' },
        { auditId: 2, officerId: 88, scope: 'Pushkar Fair Security', findings: 'Pending crowd control review.', date: '2026-05-11T08:00:00', status: 'IN_PROGRESS' },
    ]);

    // --- Create Handlers ---
    const handleCreateCompliance = async (formData) => {
        try {
            console.log("Submitting to backend:", formData);
            const mockSavedRecord = {
                complianceId: Math.floor(Math.random() * 10000), 
                referenceNumber: formData.referenceNumber,
                entityId: formData.entityId,
                type: formData.type,
                result: formData.result,
                date: new Date().toISOString()
            };
            setComplianceRecords([mockSavedRecord, ...complianceRecords]);
        } catch (error) {
            console.error("Submission failed", error);
        }
    };

    const handleCreateAudit = async (formData) => {
        try {
            console.log("Submitting Audit to backend:", formData);
            const mockSavedAudit = {
                auditId: Math.floor(Math.random() * 10000),
                officerId: 88, 
                scope: formData.scope,
                findings: formData.findings || 'No findings recorded yet.',
                status: formData.status,
                date: new Date().toISOString()
            };
            setAudits([mockSavedAudit, ...audits]);
        } catch (error) {
            console.error("Audit submission failed", error);
        }
    };

    // --- Update Handler ---
    const handleUpdateComplianceResult = async (recordId, newResult) => {
        try {
            // TODO: Call your Spring Boot PATCH API here
            // Example: await ComplianceAPI.updateResult(recordId, newResult);
            console.log(`Updating Record ${recordId} to ${newResult}`);

            // Update local state to reflect the change immediately
            setComplianceRecords(prevRecords => 
                prevRecords.map(record => 
                    record.complianceId === recordId 
                        ? { ...record, result: newResult, updatedAt: new Date().toISOString() } 
                        : record
                )
            );
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    // --- Open Update Modal Function ---
    const openUpdateModal = (record) => {
        setSelectedCompliance(record);
        setIsUpdateModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            COMPLIANT: 'bg-[#004D40]/10 text-[#004D40]',
            COMPLETED: 'bg-[#004D40]/10 text-[#004D40]',
            PENDING_REVIEW: 'bg-[#FF6D00]/10 text-[#FF6D00]',
            IN_PROGRESS: 'bg-[#FF6D00]/10 text-[#FF6D00]',
            NON_COMPLIANT: 'bg-[#880E4F]/10 text-[#880E4F]',
            CANCELLED: 'bg-gray-200 text-gray-700'
        };
        const colorClass = styles[status] || 'bg-gray-100 text-gray-600';
        
        return (
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white pb-20">

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

            <header className="pt-32 md:pt-40 pb-12 px-6 md:px-12 max-w-screen-2xl mx-auto">
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
                
                <div className="flex justify-end mb-6">
                    <button 
                        onClick={() => {
                            if (activeTab === 'COMPLIANCE') {
                                setIsComplianceModalOpen(true);
                            } else {
                                setIsAuditModalOpen(true);
                            }
                        }}
                        className="bg-[#FF6D00] text-white font-bold uppercase tracking-widest px-6 py-3 text-xs rounded-full hover:bg-[#1A237E] shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                        + New {activeTab === 'COMPLIANCE' ? 'Compliance Check' : 'Audit'}
                    </button>
                </div>

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
                                {activeTab === 'COMPLIANCE' && complianceRecords.map((record) => (
                                    <tr key={record.complianceId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6 font-bold">{record.referenceNumber}</td>
                                        <td className="p-6 font-medium">{record.type}</td>
                                        <td className="p-6 font-medium">#{record.entityId}</td>
                                        <td className="p-6">{getStatusBadge(record.result)}</td>
                                        <td className="p-6 text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</td>
                                        <td className="p-6 text-right">
                                            {/* ADD onClick TO THIS BUTTON */}
                                            <button 
                                                onClick={() => openUpdateModal(record)}
                                                className="text-[#1A237E] font-bold text-[10px] uppercase tracking-widest hover:text-[#FF6D00] transition-colors"
                                            >
                                                Update &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {activeTab === 'AUDITS' && audits.map((audit) => (
                                    <tr key={audit.auditId} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-6 font-bold">#{audit.auditId}</td>
                                        <td className="p-6 font-medium">{audit.scope}</td>
                                        <td className="p-6 text-sm text-gray-600 truncate max-w-xs">{audit.findings}</td>
                                        <td className="p-6">{getStatusBadge(audit.status)}</td>
                                        <td className="p-6 text-sm text-gray-500">{new Date(audit.date).toLocaleDateString()}</td>
                                        <td className="p-6 text-right">
                                            <button className="text-[#1A237E] font-bold text-[10px] uppercase tracking-widest hover:text-[#FF6D00] transition-colors">
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

            {/* Creation Modals */}
            <ComplianceModal 
                isOpen={isComplianceModalOpen} 
                onClose={() => setIsComplianceModalOpen(false)} 
                onSubmit={handleCreateCompliance}
            />

            <AuditModal 
                isOpen={isAuditModalOpen} 
                onClose={() => setIsAuditModalOpen(false)} 
                onSubmit={handleCreateAudit}
            />

            {/* Update Modal */}
            <UpdateComplianceModal 
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                onSubmit={handleUpdateComplianceResult}
                record={selectedCompliance}
            />
            
        </div>
    );
};

export default GovernanceDashboard;