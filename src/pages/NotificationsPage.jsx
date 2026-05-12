import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/notificationService';
import { getUser } from '../utils/auth';
import { Bell, CheckCircle, Info, AlertTriangle, AlertCircle, Loader2, InboxIcon } from 'lucide-react';

const NotificationsPage = () => {
    const user = getUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);

    useEffect(() => {
        if (user) fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getUnreadNotifications(user.userId);
            setNotifications(data || []);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            setMarking(id);
            await notificationService.markAsRead(id, user.userId);
            setNotifications(prev => prev.filter(n => n.notificationId !== id));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        } finally {
            setMarking(null);
        }
    };

    const handleMarkAll = async () => {
        try {
            setLoading(true);
            await notificationService.markAllAsRead(user.userId);
            setNotifications([]);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (category) => {
        switch (category) {
            case 'SYSTEM_CREATE': return <Info className="text-blue-500 w-5 h-5" />;
            case 'ALERT':         return <AlertTriangle className="text-amber-500 w-5 h-5" />;
            case 'ERROR':         return <AlertCircle className="text-red-500 w-5 h-5" />;
            default:              return <Bell className="text-indigo-500 w-5 h-5" />;
        }
    };

    const getCategoryBadge = (category) => {
        const map = {
            SYSTEM_CREATE: 'bg-blue-100 text-blue-700',
            ALERT: 'bg-amber-100 text-amber-700',
            ERROR: 'bg-red-100 text-red-700',
            SYSTEM: 'bg-indigo-100 text-indigo-700',
        };
        return map[category] || 'bg-slate-100 text-slate-600';
    };

    return (
        <div className="w-full">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Bell className="w-6 h-6 text-white" />
                            </div>
                            Notifications
                        </h1>
                        <p className="text-slate-500 mt-2 ml-15 font-medium pl-15">
                            {notifications.length > 0 ? `${notifications.length} unread message${notifications.length > 1 ? 's' : ''}` : 'All caught up!'}
                        </p>
                    </div>
                    {notifications.length > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 text-sm"
                        >
                            <CheckCircle className="w-4 h-4" /> Mark All Read
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-32">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-slate-500 font-semibold animate-pulse">Loading notifications...</p>
                    </div>
                </div>
            ) : notifications.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-2">All Caught Up!</h3>
                    <p className="text-slate-400 font-medium">No unread notifications right now.</p>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <div className="space-y-4">
                        {notifications.map((notif, i) => (
                            <motion.div
                                key={notif.notificationId}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 hover:shadow-lg hover:border-indigo-100 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {getIcon(notif.category)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-slate-800">{notif.subject}</h4>
                                                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{notif.message}</p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${getCategoryBadge(notif.category)}`}>
                                                {notif.category}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-[11px] text-slate-400 font-semibold">
                                                {notif.createdDate ? new Date(notif.createdDate).toLocaleString() : ''}
                                            </span>
                                            <button
                                                onClick={() => handleMarkAsRead(notif.notificationId)}
                                                disabled={marking === notif.notificationId}
                                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                {marking === notif.notificationId
                                                    ? <Loader2 className="w-3 h-3 animate-spin" />
                                                    : <CheckCircle className="w-3 h-3" />}
                                                Mark as read
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default NotificationsPage;
