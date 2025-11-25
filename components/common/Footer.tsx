import React, { memo } from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Helio. جميع الحقوق محفوظة.</p>
        </footer>
    );
};

export default memo(Footer);