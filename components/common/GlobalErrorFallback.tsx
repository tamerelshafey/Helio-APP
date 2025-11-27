import React from 'react';
import { XCircleIcon, ArrowUturnLeftIcon } from './Icons';

interface GlobalErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 text-center" dir="rtl">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full animate-fade-in-up">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                    <XCircleIcon className="h-10 w-10 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">عذراً، حدث خطأ غير متوقع!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                    واجه التطبيق مشكلة تقنية. لقد تم تسجيل الخطأ، يرجى المحاولة مرة أخرى.
                </p>
                
                <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-lg mb-6 text-left dir-ltr overflow-auto max-h-32">
                    <code className="text-xs text-red-500 font-mono">
                        {error.message}
                    </code>
                </div>

                <button
                    onClick={resetErrorBoundary}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    <span>إعادة تحميل الصفحة</span>
                </button>
            </div>
        </div>
    );
};

export default GlobalErrorFallback;