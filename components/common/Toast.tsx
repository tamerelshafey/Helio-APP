import React, { useEffect } from 'react';
import { useStore } from '../../store';
import { CheckCircleIcon, XCircleIcon } from './Icons';
import type { ToastMessage } from '../../types';

const Toast: React.FC<{ message: ToastMessage; onDismiss: (id: number) => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(message.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    const icon = {
        success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
        error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    }[message.type];

    return (
        <div 
            className="flex items-center bg-white dark:bg-slate-800 shadow-lg rounded-lg p-4 w-full max-w-sm pointer-events-auto ring-1 ring-black ring-opacity-5"
            style={{ animation: 'toast-in 0.5s forwards' }}
        >
            <div className="flex-shrink-0">{icon}</div>
            <div className="mr-3 flex-1 text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{message.message}</p>
            </div>
            <button
                onClick={() => onDismiss(message.id)}
                className="mr-4 flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                <span className="sr-only">إغلاق</span>
                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const toasts = useStore((state) => state.toasts);
    const dismissToast = useStore((state) => state.dismissToast);

    if (!toasts.length) return null;

    return (
        <>
        <style>{`
            @keyframes toast-in {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `}</style>
        <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-4" dir="rtl">
            {toasts.map((toast) => (
                <Toast key={toast.id} message={toast} onDismiss={dismissToast} />
            ))}
        </div>
        </>
    );
};

export default ToastContainer;