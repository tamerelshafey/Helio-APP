import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    message: string;
    children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, children }) => {
    return (
        <div className="text-center py-16 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-200 dark:bg-slate-700">
                {icon}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{message}</p>
            {children && <div className="mt-6">{children}</div>}
        </div>
    );
};

export default EmptyState;
