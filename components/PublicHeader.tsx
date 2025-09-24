import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const PublicHeader: React.FC = () => {

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'text-cyan-500'
                : 'text-gray-600 hover:text-gray-900'
        }`;

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm" dir="rtl">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio APP</h1>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <NavLink to="/about" className={navLinkClasses}>حول التطبيق</NavLink>
                                <NavLink to="/faq" className={navLinkClasses}>الأسئلة الشائعة</NavLink>
                                <NavLink to="/privacy-policy" className={navLinkClasses}>سياسة الخصوصية</NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors text-sm">
                            دخول لوحة التحكم
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default PublicHeader;