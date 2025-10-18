import React, { memo } from 'react';
// FIX: Import Link for client-side routing.
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="mt-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse">
                {/* FIX: Changed anchor tags to Link components for client-side routing. */}
                <Link to="/settings" className="hover:text-cyan-400 transition-colors">إعدادات الحساب</Link>
                <span>&bull;</span>
                <Link to="#" className="hover:text-cyan-400 transition-colors">الدعم الفني</Link>
                <span>&bull;</span>
                <Link to="#" className="hover:text-cyan-400 transition-colors">التوثيق</Link>
            </div>
            <p className="mt-2">© {new Date().getFullYear()} Helio. جميع الحقوق محفوظة.</p>
        </footer>
    );
};

export default memo(Footer);
