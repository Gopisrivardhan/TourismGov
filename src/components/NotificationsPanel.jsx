import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationService } from '../services/notificationService';
import { getUser } from '../utils/auth';
import { Bell, X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAlert } from './AlertProvider';
import './NotificationsPanel.css';

const NotificationsPanel = ({ isOpen, onClose }) => {
    const { showAlert } = useAlert();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUser();

    useEffect(() => {
        if (isOpen && user) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getUnreadNotifications(user.userId);
            setNotifications(data || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id, user.userId);
            setNotifications(prev => prev.filter(n => n.notificationId !== id));
            showAlert('Notification marked as read', 'success');
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead(user.userId);
            setNotifications([]);
            showAlert('All notifications marked as read', 'success');
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getIcon = (category) => {
        switch(category) {
            case 'SYSTEM_CREATE': return <Info className="text-blue-500 w-6 h-6" />;
            case 'ALERT': return <AlertTriangle className="text-amber-500 w-6 h-6" />;
            case 'ERROR': return <AlertCircle className="text-red-500 w-6 h-6" />;
            default: return <Bell className="text-indigo-500 w-6 h-6" />;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="notifications-backdrop"
                    />
                    
                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                        className="notifications-panel"
                    >
                        <div className="notifications-header">
                            <div className="flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-full">
                                    <Bell className="text-indigo-600 w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Notifications</h2>
                                {notifications.length > 0 && (
                                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="text-slate-500 w-5 h-5" />
                            </button>
                        </div>

                        <div className="notifications-body space-y-4">
                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                                    <CheckCircle className="w-12 h-12 text-slate-300" />
                                    <p className="text-sm font-medium">You're all caught up!</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {notifications.map((notif) => (
                                        <motion.div
                                            key={notif.notificationId}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="notification-item group"
                                        >
                                            <div className="flex gap-4">
                                                <div className="mt-1">{getIcon(notif.category)}</div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-800 text-sm">{notif.subject}</h4>
                                                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">{notif.message}</p>
                                                    <div className="flex justify-between items-center mt-3">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                            {new Date(notif.createdDate).toLocaleDateString()}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleMarkAsRead(notif.notificationId)}
                                                            className="text-indigo-600 text-xs font-semibold hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <button 
                                    onClick={handleMarkAllAsRead}
                                    className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors text-sm"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationsPanel;
