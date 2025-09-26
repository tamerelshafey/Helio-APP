import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDownIcon } from './common/Icons';

const PublicHeader: React.FC = () => {
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'text-cyan-600 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900/50'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700'
        }`;
    
    const dropdownNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block w-full text-right px-4 py-2 text-sm transition-colors rounded-md ${
            isActive 
                ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-300' 
                : 'text-gray-700 dark:text-gray-300'
        } hover:bg-slate-100 dark:hover:bg-slate-700`;

    const dropdownButtonClasses = `inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 focus:outline-none`;

    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm" dir="rtl">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio APP</h1>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <div 
                                    className="relative"
                                    onMouseEnter={() => setIsAboutOpen(true)}
                                    onMouseLeave={() => setIsAboutOpen(false)}
                                >
                                    <button className={dropdownButtonClasses}>
                                        <span>حول</span>
                                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div 
                                        className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out transform ${
                                            isAboutOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                                        }`}
                                    >
                                        <div className="p-1">
                                            <NavLink to="/about" className={dropdownNavLinkClasses}>حول التطبيق</NavLink>
                                            <NavLink to="/about-city" className={dropdownNavLinkClasses}>عن المدينة</NavLink>
                                            <NavLink to="/about-company" className={dropdownNavLinkClasses}>عن الشركة</NavLink>
                                        </div>
                                    </div>
                                </div>
                                
                                <NavLink to="/faq" className={navLinkClasses}>الأسئلة الشائعة</NavLink>
                                <NavLink to="/privacy-policy" className={navLinkClasses}>سياسة الخصوصية</NavLink>
                                <NavLink to="/terms-of-use" className={navLinkClasses}>شروط الاستخدام</NavLink>
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
