import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback((message, type = 'info') => {
        const id = Date.now().toString() + Math.random().toString();
        setAlerts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, 3000);
    }, []);

    const removeAlert = (id) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {alerts.map((alert) => (
                        <Toast key={alert.id} alert={alert} onRemove={() => removeAlert(alert.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
};

const Toast = ({ alert, onRemove }) => {
    let style = { bg: 'bg-white', border: 'border-slate-200', text: 'text-slate-800', icon: Info, iconColor: 'text-blue-500' };
    
    if (alert.type === 'success') style = { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: CheckCircle, iconColor: 'text-emerald-500' };
    if (alert.type === 'error') style = { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: XCircle, iconColor: 'text-red-500' };
    if (alert.type === 'warning') style = { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertTriangle, iconColor: 'text-amber-500' };

    const Icon = style.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-4 p-4 rounded-2xl shadow-lg border ${style.bg} ${style.border} min-w-[300px]`}
        >
            <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 ${style.iconColor}`} />
                <p className={`font-semibold text-sm ${style.text}`}>{alert.message}</p>
            </div>
            <button onClick={onRemove} className="opacity-50 hover:opacity-100 transition-opacity p-1">
                <X className={`w-4 h-4 ${style.text}`} />
            </button>
        </motion.div>
    );
};
