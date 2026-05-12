import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const OfficerDashboard = () => {
    const [tourists, setTourists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTourist, setSelectedTourist] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [verifyForm, setVerifyForm] = useState({ status: 'VERIFIED', remarks: '' });

    const fetchTourists = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/tourismgov/v1/tourist/admin?page=${page}&size=10`);
            setTourists(response.data.content || []);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) { console.error('Fetch error', error); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchTourists(); }, [page]);

    const handleRowClick = async (touristId) => {
        try {
            const response = await api.get(`/tourismgov/v1/tourist/${touristId}`);
            setSelectedTourist(response.data);
            setVerifyForm({ status: 'VERIFIED', remarks: '' });
        } catch (error) { alert("Profile fetch failed"); }
    };

    const handleVerify = async (docId) => {
        if (!verifyForm.remarks.trim()) return alert("Remarks required");
        try {
            await api.patch(
                `/tourismgov/v1/touristdoc/${selectedTourist.touristId}/documents/${docId}/verify`,
                { status: verifyForm.status, remarks: verifyForm.remarks }
            );
            alert("Status Updated!");
            handleRowClick(selectedTourist.touristId); 
            fetchTourists(); 
        } catch (error) { alert("Verification failed"); }
    };

    // FIXED VIEW LOGIC
    const handleViewDocument = async (documentId) => {
        try {
            // If your API gives 404, check if your backend URL requires the Tourist ID in the path
            // Alternative: const response = await api.get(`/tourismgov/v1/touristdoc/${selectedTourist.touristId}/documents/${documentId}/view`);
            const response = await api.get(`/tourismgov/v1/touristdoc/documents/${documentId}/view`);
            
            let fileUrl = response.data?.fileUri;
            
            if (fileUrl) {
                // If it's a raw local path, we convert it to a serve-able URL
                if (fileUrl.startsWith('file:///')) {
                    // Prepend the backend server address if necessary
                    // fileUrl = `http://localhost:8383/tourismgov/v1/touristdoc/uploads/${fileUrl.split('uploads/')[1]}`;
                    window.open(fileUrl, '_blank'); 
                } else if (!fileUrl.startsWith('http')) {
                    const baseUrl = 'http://localhost:8383';
                    window.open(`${baseUrl}/${fileUrl.replace(/^\/+/, '')}`, '_blank');
                } else {
                    window.open(fileUrl, '_blank');
                }
            } else {
                alert("Document link not available.");
            }
        } catch (error) {
            console.error("View Error:", error);
            alert("Error: 404 Not Found. Check if the document exists or path is correct.");
        }
    };

    const filteredTourists = tourists.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.touristId.toString().includes(searchQuery);
        const matchesStatus = statusFilter === "" || (statusFilter === "ACTIVE" ? t.status === "ACTIVE" : t.status !== "ACTIVE");
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 max-w-5xl mx-auto w-full p-6 pt-32 pb-20">
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm">
                    <h1 className="text-2xl font-black text-[#1A237E] uppercase tracking-tighter">Officer Control</h1>
                    <div className="flex gap-2 w-full md:w-auto">
                        <select onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded-full text-xs font-bold outline-none bg-gray-50 px-4">
                            <option value="">All Status</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            className="border p-2 rounded-full text-xs w-full md:w-64 outline-none px-4 bg-gray-50"
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
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="3" className="p-10 text-center text-xs font-bold animate-pulse">Loading...</td></tr>
                            ) : filteredTourists.map(t => (
                                <tr key={t.touristId} onClick={() => handleRowClick(t.touristId)} className="border-b hover:bg-blue-50/50 cursor-pointer transition-colors">
                                    <td className="p-4 text-xs font-bold text-gray-500">#{t.touristId}</td>
                                    <td className="p-4 text-sm font-bold text-[#1A237E]">{t.name}</td>
                                    <td className="p-4 text-center">
                                        <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${t.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest px-2">
                    <button disabled={page === 0} onClick={() => setPage(page - 1)} className="hover:text-blue-600 disabled:text-gray-300 transition-colors">← Previous</button>
                    <span className="text-gray-400">Page {page + 1} / {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="hover:text-blue-600 disabled:text-gray-300 transition-colors">Next →</button>
                </div>
            </main>

            {selectedTourist && (
                <div className="fixed inset-0 bg-[#1A237E]/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="font-black text-xl text-[#1A237E] uppercase tracking-tighter">{selectedTourist.name}</h2>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Profile Review</p>
                            </div>
                            <button onClick={() => setSelectedTourist(null)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:text-red-500 transition-colors">✕</button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-8 text-xs">
                            <div className="grid grid-cols-2 gap-4 border border-gray-100 p-6 rounded-2xl bg-white shadow-sm">
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">ID</span> #{selectedTourist.touristId}</p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">Gender</span> {selectedTourist.gender}</p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">Phone</span> {selectedTourist.contactInfo}</p>
                                <p><span className="text-gray-400 font-bold uppercase text-[9px] block">DOB</span> {selectedTourist.dob}</p>
                                <p className="col-span-2"><span className="text-gray-400 font-bold uppercase text-[9px] block">Address</span> {selectedTourist.address}</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-black text-[10px] uppercase text-blue-600 tracking-widest">Document Verifications</h3>
                                {selectedTourist.documents.length === 0 ? (
                                    <p className="text-gray-400 italic text-center py-4">No files uploaded for review.</p>
                                ) : selectedTourist.documents.map(doc => (
                                    <div key={doc.documentId} className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <p className="font-black text-[10px] uppercase text-[#1A237E]">{doc.docType.replace('_', ' ')}</p>
                                            <button 
                                                onClick={() => handleViewDocument(doc.documentId)} 
                                                className="text-[#FF6D00] text-[9px] font-black uppercase hover:underline tracking-widest"
                                            >
                                                View Source ↗
                                            </button>
                                        </div>
                                        
                                        <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-50">
                                            <select 
                                                className="text-[9px] font-black uppercase p-2 rounded-full bg-gray-50 outline-none border-none cursor-pointer"
                                                onChange={(e) => setVerifyForm({...verifyForm, status: e.target.value})}
                                            >
                                                <option value="VERIFIED">Approve</option>
                                                <option value="REJECTED">Reject</option>
                                            </select>
                                            <input 
                                                type="text" 
                                                placeholder="Officer Remarks..." 
                                                className="flex-1 text-[10px] p-2 outline-none"
                                                onChange={(e) => setVerifyForm({...verifyForm, remarks: e.target.value})}
                                            />
                                            <button 
                                                onClick={() => handleVerify(doc.documentId)}
                                                className="bg-[#1A237E] text-white px-5 py-2 rounded-full text-[9px] font-black uppercase hover:bg-[#FF6D00] transition-colors"
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
            <Footer />
        </div>
    );
};

export default OfficerDashboard;