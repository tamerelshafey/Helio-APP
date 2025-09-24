import React, { memo } from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="mt-6 p-4 bg-white rounded-lg shadow-md text-center text-sm text-gray-500">
            <div className="flex justify-center items-center space-x-6 rtl:space-x-reverse">
                <a href="#" className="hover:text-cyan-400 transition-colors">الدعم الفني</a>
                <span>&bull;</span>
                <a href="#" className="hover:text-cyan-400 transition-colors">التوثيق</a>
            </div>
            <p className="mt-2">© {new Date().getFullYear()} Helio. جميع الحقوق محفوظة.</p>
        </footer>
    );
};

export default memo(Footer);