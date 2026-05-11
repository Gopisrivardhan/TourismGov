import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // CreateEventRequest payload shape based on standard PDF schema
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        status: 'SCHEDULED',
        siteId: 1 
    });

    const fetchEvents = () => {
        setLoading(true);
        axios.get('http://localhost:8383/tourismgov/v1/events')
            .then(res => { setEvents(res.data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle Create via EventController POST
    const handleCreate = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8383/tourismgov/v1/events', formData)
            .then(res => {
                setShowForm(false);
                fetchEvents();
                setFormData({ title: '', location: '', date: '', status: 'SCHEDULED', siteId: 1 });
            })
            .catch(err => alert('Failed to create event'));
    };

    // Handle Delete via EventController DELETE
    const handleDelete = (eventId) => {
        if(window.confirm('Are you sure you want to delete this event?')) {
            axios.delete(`http://localhost:8383/tourismgov/v1/events/${eventId}`)
                .then(res => fetchEvents())
                .catch(err => alert('Failed to delete event'));
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFDF7] text-[#1A237E] selection:bg-[#FF6D00] selection:text-white">
            {/* ADMIN TOP BAR */}
            <div className="bg-[#1A237E] p-4 flex justify-between items-center text-white">
                <div className="text-xl font-black tracking-tighter flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF6D00]"></span>
                    TourismGov | Admin Portal
                </div>
                <Link to="/" className="text-xs font-bold uppercase tracking-widest hover:text-[#FF6D00]">Back to Site</Link>
            </div>

            <main className="max-w-screen-2xl mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                        Manage <br/>Events
                    </h1>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-[#FF6D00] text-white font-black uppercase tracking-widest text-xs px-6 py-3 rounded-full shadow-lg hover:bg-[#1A237E] transition-colors"
                    >
                        {showForm ? 'Cancel Form' : '+ Add New Event'}
                    </button>
                </div>

                {/* ADD EVENT FORM */}
                {showForm && (
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-[#1A237E]/10 mb-10">
                        <h2 className="text-2xl font-black uppercase mb-6">Create Event Form</h2>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" placeholder="Event Title" required
                                className="px-6 py-4 bg-[#FFFDF7] rounded-full border border-[#1A237E]/20 focus:outline-none focus:border-[#FF6D00] font-medium"
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            
                            <input type="text" placeholder="Location" required
                                className="px-6 py-4 bg-[#FFFDF7] rounded-full border border-[#1A237E]/20 focus:outline-none focus:border-[#FF6D00] font-medium"
                                value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            
                            <input type="date" required
                                className="px-6 py-4 bg-[#FFFDF7] rounded-full border border-[#1A237E]/20 focus:outline-none focus:border-[#FF6D00] font-medium text-gray-500"
                                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />

                            <select 
                                className="px-6 py-4 bg-[#FFFDF7] rounded-full border border-[#1A237E]/20 focus:outline-none focus:border-[#FF6D00] font-medium uppercase text-xs"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>

                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button type="submit" className="bg-[#1A237E] text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-full shadow-lg hover:bg-[#FF6D00] transition-colors">
                                    Save Event to Database
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* EVENTS LIST / GRID */}
                {loading ? <p className="font-bold uppercase tracking-widest">Loading...</p> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {events.map(event => (
                            <div key={event.id || event.eventId} className="bg-white rounded-[2rem] p-6 shadow-md border border-[#1A237E]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-black uppercase text-[#1A237E]">{event.title}</h3>
                                        <span className="bg-[#FF6D00]/10 text-[#FF6D00] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {event.status || 'ACTIVE'}
                                        </span>
                                    </div>
                                    <p className="font-bold text-[10px] uppercase tracking-widest opacity-60">ID: {event.id || event.eventId} | Location: {event.location}</p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button 
                                        onClick={() => handleDelete(event.id || event.eventId)}
                                        className="w-full sm:w-auto bg-[#D81B60]/10 text-[#D81B60] font-bold uppercase tracking-widest text-[10px] px-5 py-2.5 rounded-full hover:bg-[#D81B60] hover:text-white transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminEvents;