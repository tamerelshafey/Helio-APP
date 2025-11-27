import React from 'react';
import { XCircleIcon, ArrowPathIcon } from './Icons';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title = 'حدث خطأ', message, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-12 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <XCircleIcon className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm mb-6">{message}</p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    <span>إعادة المحاولة</span>
                </button>
            )}
        </div>
    );
};

export default ErrorState;