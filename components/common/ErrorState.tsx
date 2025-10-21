import React from 'react';
import { XCircleIcon } from './Icons';

interface ErrorStateProps {
    message: string;
    onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    return (
        <div className="text-center py-10 px-6" role="alert">
            <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-800 dark:text-white">حدث خطأ</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{message}</p>
            {onRetry && (
                <div className="mt-6">
                    <button
                        type="button"
                        onClick={onRetry}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorState;
