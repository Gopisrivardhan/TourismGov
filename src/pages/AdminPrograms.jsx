import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPrograms = () => {
    const navigate = useNavigate();
    
    // Auth & User State
    const [adminUser, setAdminUser] = useState({ name: '', role: '' });
    
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [budgetReport, setBudgetReport] = useState(null);
    const [resources, setResources] = useState([]); // For ProgramResourceController
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showResourceForm, setShowResourceForm] = useState(false);

    // Forms
    const initialFormState = { title: '', description: '', startDate: '', endDate: '', budget: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [resourceForm, setResourceForm] = useState({ type: 'FUNDS', quantity: '' });

    const BASE_URL = 'http://localhost:8383/tourismgov/v1';

    // 1. BULLETPROOF TOKEN CONFIGURATION
    // This automatically grabs the token you saved during Login and formats it for Spring Boot
    const getAxiosConfig = useCallback(() => {
        const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('user'))?.token;
        return { 
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            } 
        };
    }, []);

    // --- SECURITY CHECK & DATA FETCHING ---
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        
        // Route Protection
        if (!token || !storedUser || (storedUser.role !== 'ADMIN' && storedUser.role !== 'OFFICER')) {
            navigate('/login');
            return;
        }
        
        setAdminUser({ name: storedUser.name, role: storedUser.role });
        fetchPrograms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    // --- API: Fetch All Programs ---
    const fetchPrograms = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/programs`, getAxiosConfig());
            setPrograms(res.data);
            setError(null);
            
            // Auto-load the first program if data exists to make the dashboard dynamic
            if (res.data.length > 0 && !selectedProgram) {
                handleSelectProgram(res.data[0].programId);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch programs. Please check your token or server.');
        } finally {
            setLoading(false);
        }
    };

    // --- API: Fetch Single Program, Budget, AND Resources ---
    const handleSelectProgram = async (programId) => {
        try {
            const [progRes, budgetRes, resourceRes] = await Promise.all([
                axios.get(`${BASE_URL}/programs/${programId}`, getAxiosConfig()),
                axios.get(`${BASE_URL}/programs/${programId}/budget-report`, getAxiosConfig()),
                axios.get(`${BASE_URL}/programs/${programId}/resources`, getAxiosConfig())
            ]);
            setSelectedProgram(progRes.data);
            setBudgetReport(budgetRes.data);
            setResources(resourceRes.data);
            setIsFormOpen(false);
            setShowResourceForm(false);
        } catch (err) {
            setError('Failed to load comprehensive program details.');
        }
    };

    // --- API: Create or Update Program ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await axios.put(`${BASE_URL}/programs/${selectedProgram.programId}`, formData, getAxiosConfig());
            } else {
                await axios.post(`${BASE_URL}/programs`, formData, getAxiosConfig());
            }
            
            setFormData(initialFormState);
            setIsFormOpen(false);
            setIsEditing(false);
            fetchPrograms(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save program. Check dates and duplicates.');
        }
    };

    // --- API: Update Program Status ---
    const handleStatusChange = async (programId, newStatus) => {
        try {
            await axios.patch(`${BASE_URL}/programs/${programId}/status?status=${newStatus}`, null, getAxiosConfig());
            fetchPrograms();
            if (selectedProgram?.programId === programId) handleSelectProgram(programId);
        } catch (err) {
            alert(err.response?.data?.message || "Cannot change status.");
        }
    };

    // --- API: Delete Program ---
    const handleDelete = async (programId) => {
        if (!window.confirm('Are you sure you want to cancel and delete this program?')) return;
        try {
            await axios.delete(`${BASE_URL}/programs/${programId}`, getAxiosConfig());
            setSelectedProgram(null);
            fetchPrograms();
        } catch (err) {
            alert('Failed to delete program.');
        }
    };

    // --- API: Resource Management ---
    const handleAllocateResource = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/programs/${selectedProgram.programId}/resources`, resourceForm, getAxiosConfig());
            setResourceForm({ type: 'FUNDS', quantity: '' });
            setShowResourceForm(false);
            handleSelectProgram(selectedProgram.programId); // Refresh details
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to allocate resource.');
        }
    };

    const handleUpdateResourceStatus = async (resourceId, newStatus) => {
        try {
            await axios.patch(`${BASE_URL}/resources/${resourceId}/status?status=${newStatus}`, null, getAxiosConfig());
            handleSelectProgram(selectedProgram.programId);
        } catch (err) {
            alert('Failed to update resource status.');
        }
    };

    const handleDeleteResource = async (resourceId) => {
        try {
            await axios.delete(`${BASE_URL}/resources/${resourceId}`, getAxiosConfig());
            handleSelectProgram(selectedProgram.programId);
        } catch (err) {
            alert('Failed to delete resource.');
        }
    };

    // --- Handlers for UI ---
    const openCreateForm = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setIsFormOpen(true);
        setSelectedProgram(null);
    };

    const openEditForm = (program) => {
        setFormData({
            title: program.title, description: program.description,
            startDate: program.startDate, endDate: program.endDate, budget: program.budget
        });
        setIsEditing(true);
        setIsFormOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] font-sans selection:bg-[#FF6D00] selection:text-white flex flex-col">
            
            {/* MATCHING ADMIN TOP NAVIGATION */}
            <div className="bg-[#1A237E] p-4 px-6 md:px-10 flex justify-between items-center text-white shadow-lg sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="hover:text-[#FF6D00] transition-colors text-2xl font-bold" title="Back to Dashboard">
                        &larr;
                    </Link>
                    <div className="text-lg md:text-2xl font-black tracking-tighter flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                        TourismGov | Program Management
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF6D00]">{adminUser.role}</span>
                        <span className="text-sm font-black uppercase">{adminUser.name}</span>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-[#FF6D00] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </div>

            <main className="flex-1 max-w-screen-2xl w-full mx-auto p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* LEFT PANEL: PROGRAM LIST */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="flex justify-between items-end">
                        <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Programs</h2>
                        <button 
                            onClick={openCreateForm} 
                            className="bg-[#FF6D00] text-white font-black uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full shadow-lg hover:bg-[#1A237E] transition-all"
                        >
                            {isFormOpen && !isEditing ? 'Cancel Form' : '+ New Program'}
                        </button>
                    </div>

                    {/* EMPTY STATE */}
                    {!loading && programs.length === 0 && (
                        <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-[#1A237E]/20 text-center flex flex-col items-center justify-center py-16 shadow-sm">
                            <span className="text-2xl mb-4">📋</span>
                            <h3 className="font-black text-xl uppercase text-[#1A237E] mb-2">No Programs Found</h3>
                            <p className="font-medium text-sm opacity-60 mb-6">Initialize your first tourism program.</p>
                            <button onClick={openCreateForm} className="bg-[#1A237E] text-white px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#FF6D00] transition-colors">
                                Initialize First Program
                            </button>
                        </div>
                    )}

                    {/* LIST OF PROGRAMS */}
                    <div className="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2">
                        {programs.map(prog => (
                            <div 
                                key={prog.programId} 
                                onClick={() => handleSelectProgram(prog.programId)}
                                className={`p-6 rounded-[1.5rem] cursor-pointer transition-all border ${selectedProgram?.programId === prog.programId ? 'bg-[#1A237E] text-white shadow-xl scale-[1.02]' : 'bg-white shadow-sm hover:shadow-md border-[#1A237E]/10 hover:border-[#FF6D00]/50'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black uppercase text-lg leading-tight truncate pr-4">{prog.title}</h3>
                                </div>
                                <div className="flex justify-between items-center mt-4">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedProgram?.programId === prog.programId ? 'bg-white/20' : 'bg-[#FF6D00]/10 text-[#FF6D00]'}`}>
                                        {prog.status}
                                    </span>
                                    <span className={`font-bold text-[10px] uppercase tracking-widest ${selectedProgram?.programId === prog.programId ? 'opacity-80' : 'opacity-50'}`}>
                                        ${prog.budget?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL: DETAILS & FORMS */}
                <div className="lg:col-span-8">
                    
                    {error && (
                        <div className="mb-6 p-4 bg-[#D81B60]/10 border border-[#D81B60]/20 rounded-[1rem]">
                            <p className="text-[#D81B60] font-bold text-[10px] uppercase tracking-widest">Error: {error}</p>
                        </div>
                    )}

                    {/* CREATE / EDIT FORM */}
                    {isFormOpen ? (
                        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-[#1A237E]/10 animate-fade-in-up">
                            <h2 className="text-3xl font-black uppercase leading-none text-[#1A237E] mb-8">
                                {isEditing ? 'Edit Program' : 'Create New Program'}
                            </h2>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">Program Title</label>
                                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-6 py-4 bg-[#F8F9FF] rounded-full border-2 border-transparent focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-bold" />
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">Description</label>
                                    <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3"
                                        className="w-full px-6 py-4 bg-[#F8F9FF] rounded-[1.5rem] border-2 border-transparent focus:border-[#FF6D00] focus:bg-white outline-none transition-all font-medium" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">Start Date</label>
                                        <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})}
                                            className="w-full px-6 py-4 bg-[#F8F9FF] rounded-full border-2 border-transparent focus:border-[#FF6D00] outline-none font-bold text-gray-600" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">End Date</label>
                                        <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})}
                                            className="w-full px-6 py-4 bg-[#F8F9FF] rounded-full border-2 border-transparent focus:border-[#FF6D00] outline-none font-bold text-gray-600" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-4">Total Budget Allocation (USD)</label>
                                    <input type="number" required min="0" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})}
                                        className="w-full px-6 py-4 bg-[#F8F9FF] rounded-full border-2 border-transparent focus:border-[#FF6D00] outline-none font-bold" />
                                </div>

                                <div className="flex justify-end gap-4 mt-4">
                                    <button type="button" onClick={() => setIsFormOpen(false)} className="px-8 py-4 rounded-full font-black uppercase text-[10px] tracking-widest text-[#1A237E] hover:bg-gray-100 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-[#1A237E] text-white px-10 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#FF6D00] shadow-xl transition-all hover:-translate-y-1">
                                        {isEditing ? 'Save Changes' : 'Initialize Program'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : selectedProgram ? (
                        
                        /* DETAILS DASHBOARD */
                        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-[#1A237E]/10 animate-fade-in-up">
                            
                            {/* Header Panel */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#1A237E]/10 pb-8 mb-8 gap-4">
                                <div>
                                    <span className="bg-[#FF6D00] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Program ID: {selectedProgram.programId}</span>
                                    <h2 className="text-4xl font-black uppercase leading-none text-[#1A237E] mb-3">{selectedProgram.title}</h2>
                                    <p className="font-bold text-xs uppercase tracking-widest opacity-50">{selectedProgram.startDate} TO {selectedProgram.endDate}</p>
                                </div>
                                <div className="flex gap-2">
                                    <select 
                                        className={`px-4 py-3 rounded-full text-[10px] font-black uppercase tracking-widest outline-none border-2 cursor-pointer transition-colors ${selectedProgram.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-[#F8F9FF] border-[#1A237E]/10 text-[#1A237E]'}`}
                                        value={selectedProgram.status} 
                                        onChange={(e) => handleStatusChange(selectedProgram.programId, e.target.value)}
                                        disabled={selectedProgram.status === 'CANCELLED'}
                                    >
                                        <option value="PLANNED">Planned</option>
                                        <option value="ACTIVE">Active</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            {/* Budget Report Analysis */}
                            {budgetReport && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-[#1A237E] text-white p-6 rounded-[1.5rem] shadow-lg">
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Budget</p>
                                        <p className="text-3xl font-black">${budgetReport.totalBudget?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[#FFFDF7] border-2 border-[#1A237E]/10 p-6 rounded-[1.5rem]">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A237E] mb-1">Funds Expended</p>
                                        <p className="text-3xl font-black text-[#D81B60]">${budgetReport.amountSpent?.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-[#FFFDF7] border-2 border-[#FF6D00]/20 p-6 rounded-[1.5rem]">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF6D00] mb-1">Remaining</p>
                                        <p className="text-3xl font-black text-[#004D40]">${budgetReport.remainingBudget?.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* RESOURCES SECTION */}
                            <div className="mt-8 border-t border-[#1A237E]/10 pt-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-black uppercase text-[#1A237E]">Resources</h3>
                                    <button onClick={() => setShowResourceForm(!showResourceForm)} className="text-[#FF6D00] font-bold uppercase text-[10px] tracking-widest hover:text-[#1A237E]">
                                        {showResourceForm ? 'Cancel' : '+ Allocate Resource'}
                                    </button>
                                </div>

                                {showResourceForm && (
                                    <form onSubmit={handleAllocateResource} className="bg-[#F8F9FF] p-5 rounded-[1.5rem] border border-[#1A237E]/10 mb-6 flex gap-4 items-center">
                                        <select required className="flex-1 px-4 py-3 bg-white rounded-full border-none focus:ring-2 focus:ring-[#FF6D00] text-xs font-bold uppercase outline-none"
                                            value={resourceForm.type} onChange={e => setResourceForm({...resourceForm, type: e.target.value})}>
                                            <option value="FUNDS">Funds</option>
                                            <option value="STAFF">Staff</option>
                                            <option value="EQUIPMENT">Equipment</option>
                                            <option value="TRANSPORT">Transport</option>
                                        </select>
                                        <input type="number" placeholder="Quantity/Amount" required className="flex-1 px-4 py-3 bg-white rounded-full border-none focus:ring-2 focus:ring-[#FF6D00] text-sm outline-none"
                                            value={resourceForm.quantity} onChange={e => setResourceForm({...resourceForm, quantity: e.target.value})} />
                                        <button type="submit" className="bg-[#1A237E] text-white font-black uppercase text-[10px] px-6 py-3 rounded-full hover:bg-[#FF6D00]">Add</button>
                                    </form>
                                )}

                                <div className="space-y-3">
                                    {resources.length === 0 ? <p className="text-sm opacity-50 italic">No resources allocated yet.</p> : null}
                                    {resources.map(res => (
                                        <div key={res.resourceId} className="flex items-center justify-between p-4 bg-white border border-[#1A237E]/10 rounded-full shadow-sm hover:border-[#FF6D00]/30 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <span className="bg-[#1A237E] text-white w-10 h-10 flex items-center justify-center rounded-full text-[10px] font-black uppercase">{res.type.substring(0,3)}</span>
                                                <div>
                                                    <p className="font-black text-sm uppercase text-[#1A237E]">{res.type}</p>
                                                    <p className="font-bold text-[10px] uppercase opacity-50">Qty: {res.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-center">
                                                <select 
                                                    className="bg-transparent text-[9px] font-bold uppercase outline-none text-[#FF6D00] cursor-pointer"
                                                    value={res.status} onChange={(e) => handleUpdateResourceStatus(res.resourceId, e.target.value)}
                                                >
                                                    <option value="ALLOCATED">Allocated</option>
                                                    <option value="RELEASED">Released</option>
                                                    <option value="EXPENDED">Expended</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                                <button onClick={() => handleDeleteResource(res.resourceId)} className="text-[#D81B60] hover:text-red-800 text-lg leading-none font-bold" title="Delete Resource">&times;</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-8 mt-8 border-t border-[#1A237E]/10">
                                <button onClick={() => openEditForm(selectedProgram)} className="flex-1 bg-[#1A237E]/5 text-[#1A237E] py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#1A237E] hover:text-white transition-colors">
                                    Edit Details
                                </button>
                                <button onClick={() => handleDelete(selectedProgram.programId)} className="flex-1 bg-red-50 text-red-600 py-4 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-colors">
                                    Delete Program
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-[#1A237E]/20 rounded-[2rem] bg-white/50">
                            <span className="text-4xl mb-4 opacity-50">👆</span>
                            <p className="font-bold text-sm uppercase tracking-widest opacity-40">Select a program to view details</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminPrograms;