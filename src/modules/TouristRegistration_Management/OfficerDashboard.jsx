import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const OfficerDashboard = () => {
    const navigate = useNavigate();
    
    const [adminUser, setAdminUser] = useState({ name: 'Officer', role: 'ADMIN' });
    const [tourists, setTourists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTourist, setSelectedTourist] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [verifyForm, setVerifyForm] = useState({ status: 'VERIFIED', remarks: '' });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setAdminUser({ name: user.name || 'Officer', role: user.role || 'ADMIN' });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const fetchTourists = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/tourismgov/v1/tourist/admin?page=${page}&size=10`);
            setTourists(data.content || []);
            setTotalPages(data.totalPages || 1);
        } catch { alert('Error fetching tourists'); } 
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTourists(); }, [page]);

    const handleRowClick = async (touristId) => {
        try {
            const { data } = await api.get(`/tourismgov/v1/tourist/${touristId}`);
            setSelectedTourist(data);
            setVerifyForm({ status: 'VERIFIED', remarks: '' });
        } catch { alert("Profile fetch failed"); }
    };

    const handleVerify = async (docId) => {
        if (!verifyForm.remarks.trim()) return alert("Remarks required");
        try {
            await api.patch(`/tourismgov/v1/touristdoc/${selectedTourist.touristId}/documents/${docId}/verify`, verifyForm);
            alert("Status Updated!");
            handleRowClick(selectedTourist.touristId); 
            fetchTourists(); 
        } catch { alert("Verification failed"); }
    };

    const handleViewDocument = async (documentId) => {
        try {
            const { data } = await api.get(`/tourismgov/v1/touristdoc/documents/${documentId}/view`);
            if (!data?.fileUri) return alert("Document link not available.");
            
            const url = (!data.fileUri.startsWith('http') && !data.fileUri.startsWith('file:///'))
                ? `http://localhost:8383/${data.fileUri.replace(/^\/+/, '')}` : data.fileUri;
            
            window.open(url, '_blank');
        } catch { alert("Error: 404 Not Found."); }
    };

    // --- NEW: Delete Tourist Logic ---
    const handleDeleteTourist = async (e, id) => {
        if (e) e.stopPropagation(); // Prevents the row click (modal) from opening
        
        if (window.confirm('Are you sure you want to permanently delete this tourist?')) {
            try {
                await api.delete(`/tourismgov/v1/tourist/${id}`);
                if (selectedTourist?.touristId === id) setSelectedTourist(null); // Close modal if open
                fetchTourists(); 
            } catch {
                alert('Delete failed. Please try again.');
            }
        }
    };

    const filteredTourists = tourists.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.touristId.toString().includes(searchQuery);
        const matchStatus = !statusFilter || (statusFilter === "ACTIVE" ? t.status === "ACTIVE" : t.status !== "ACTIVE");
        return matchSearch && matchStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            
            {/* --- ADMIN HEADER --- */}
            <div className="bg-[#1A237E] p-4 px-6 md:px-10 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
                <Link to="/admin" className="text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <span className="w-3 h-3 rounded-full bg-[#FF6D00]" /> TourismGov
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6D00]">{adminUser.role}</span>
                        <span className="text-sm font-black uppercase">{adminUser.name}</span>
                    </div>
                    <button onClick={handleLogout} className="bg-white/10 hover:bg-[#FF6D00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors">
                        Log Out
                    </button>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 pt-10 pb-20">
                
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/admin" className="inline-block text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#FF6D00] transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tighter">Officer Control</h1>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 p-2 rounded-full text-xs font-bold outline-none bg-gray-50 px-4 text-[#1A237E]">
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Search Name or ID..." 
                            className="border border-gray-200 p-2 rounded-full text-xs w-full md:w-64 outline-none px-4 bg-gray-50 text-[#1A237E] placeholder-gray-400"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 border-b uppercase tracking-widest bg-gray-50">
                                <th className="p-4">ID</th>
                                <th className="p-4">Tourist Name</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Actions</th> {/* NEW ACTIONS COLUMN */}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-10 text-center text-xs font-bold animate-pulse text-[#1A237E]">Loading Data...</td></tr>
                            ) : filteredTourists.length === 0 ? (
                                <tr><td colSpan="4" className="p-10 text-center text-xs font-bold text-gray-400">No tourists found.</td></tr>
                            ) : filteredTourists.map(t => (
                                <tr key={t.touristId} onClick={() => handleRowClick(t.touristId)} className="border-b hover:bg-[#F8F9FF] cursor-pointer transition-colors group">
                                    <td className="p-4 text-xs font-bold text-gray-500 group-hover:text-[#FF6D00] transition-colors">#{t.touristId}</td>
                                    <td className="p-4 text-sm font-bold text-[#1A237E]">{t.name}</td>
                                    <td className="p-4 text-center">
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {/* NEW DELETE BUTTON IN TABLE */}
                                        <button 
                                            onClick={(e) => handleDeleteTourist(e, t.touristId)}
                                            className="text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-white bg-red-50 hover:bg-red-500 px-4 py-2 rounded-full transition-colors shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                    <button disabled={page === 0} onClick={() => setPage(page - 1)} className="hover:text-[#FF6D00] disabled:text-gray-300 transition-colors">← Previous</button>
                    <span className="text-gray-400">Page {page + 1} / {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="hover:text-[#FF6D00] disabled:text-gray-300 transition-colors">Next →</button>
                </div>
            </main>

            {/* --- MODAL --- */}
            {selectedTourist && (
                <div className="fixed inset-0 bg-[#1A237E]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="font-black text-xl text-[#1A237E] uppercase tracking-tighter">{selectedTourist.name}</h2>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Profile Review</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* NEW DELETE BUTTON IN MODAL */}
                                <button 
                                    onClick={(e) => handleDeleteTourist(e, selectedTourist.touristId)}
                                    className="text-[9px] font-black uppercase text-red-500 hover:bg-red-50 px-3 py-1 rounded-full transition-colors tracking-widest"
                                >
                                    Delete Profile
                                </button>
                                <button onClick={() => setSelectedTourist(null)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-[#FF6D00] transition-colors text-gray-500 font-black">✕</button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8 text-xs">
                            <div className="grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-2xl bg-white shadow-sm">
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">ID</span> <span className="font-bold text-[#1A237E]">#{selectedTourist.touristId}</span></p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">Gender</span> <span className="font-bold text-[#1A237E]">{selectedTourist.gender}</span></p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">Phone</span> <span className="font-bold text-[#1A237E]">{selectedTourist.contactInfo}</span></p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">DOB</span> <span className="font-bold text-[#1A237E]">{selectedTourist.dob}</span></p>
                                <p className="col-span-2"><span className="text-gray-400 font-bold uppercase text-[9px] block">Address</span> <span className="font-bold text-[#1A237E]">{selectedTourist.address}</span></p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-black text-[10px] uppercase text-[#FF6D00] tracking-widest">Document Verifications</h3>
                                {!selectedTourist.documents?.length ? (
                                    <p className="text-gray-400 italic text-center py-4 bg-gray-50 rounded-xl">No files uploaded for review.</p>
                                ) : selectedTourist.documents.map(doc => (
                                    <div key={doc.documentId} className="border border-gray-100 p-5 rounded-2xl bg-[#F8F9FF] space-y-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-black text-[10px] uppercase text-[#1A237E]">{doc.docType.replace('_', ' ')}</p>
                                            <button onClick={() => handleViewDocument(doc.documentId)} className="text-[#FF6D00] text-[9px] font-black uppercase hover:underline tracking-widest">
                                                View Source ↗
                                            </button>
                                        </div>
                                        
                                        <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-100">
                                            <select 
                                                className="text-[9px] font-black uppercase p-2 rounded-full bg-gray-50 outline-none cursor-pointer text-[#1A237E]"
                                                onChange={(e) => setVerifyForm({...verifyForm, status: e.target.value})}
                                            >
                                                <option value="VERIFIED">Approve</option>
                                                <option value="REJECTED">Reject</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Officer Remarks..." 
                                                className="flex-1 text-[10px] px-3 outline-none font-medium text-[#1A237E] placeholder-gray-300"
                                                onChange={(e) => setVerifyForm({...verifyForm, remarks: e.target.value})}
                                            />
                                            <button 
                                                onClick={() => handleVerify(doc.documentId)}
                                                className="bg-[#1A237E] text-white px-6 py-2 rounded-full text-[9px] font-black uppercase hover:bg-[#FF6D00] transition-colors shadow-md"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficerDashboard;