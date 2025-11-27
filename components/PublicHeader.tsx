import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAppLinks } from '../api/generalApi';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from './common/Icons';

const PublicHeader: React.FC = () => {
    const { data: appLinks } = useQuery({ queryKey: ['appLinks'], queryFn: getAppLinks });
    const googlePlayUrl = appLinks?.googlePlayUrl || '#';
    
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

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
    
    const dropdownButtonClasses = (isOpen: boolean) => 
        `inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 focus:outline-none`;

    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 shadow-sm" dir="rtl">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider">Helio APP</h1>
                        </Link>
                         <div className="hidden md:block">
                            <div className="mr-10 flex items-baseline space-x-4 rtl:space-x-reverse rtl:mr-10 rtl:ml-0">
                                <NavLink to="/" className={navLinkClasses}>الرئيسية</NavLink>
                                <div className="relative pb-2" onMouseEnter={() => setIsAboutOpen(true)} onMouseLeave={() => setIsAboutOpen(false)}>
                                    <button className={dropdownButtonClasses(isAboutOpen)}>
                                        <span>حول</span><ChevronDownIcon className={`w-4 h-4 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 transition-transform duration-200 ${isAboutOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="p-1"><NavLink to="/about" className={dropdownNavLinkClasses}>حول التطبيق</NavLink><NavLink to="/about-city" className={dropdownNavLinkClasses}>عن المدينة</NavLink><NavLink to="/about-company" className={dropdownNavLinkClasses}>عن الشركة</NavLink></div>
                                    </div>
                                </div>
                                <NavLink to="/faq" className={navLinkClasses}>الأسئلة الشائعة</NavLink>
                                 <div className="relative pb-2" onMouseEnter={() => setIsLegalOpen(true)} onMouseLeave={() => setIsLegalOpen(false)}>
                                    <button className={dropdownButtonClasses(isLegalOpen)}>
                                        <span>قانوني</span><ChevronDownIcon className={`w-4 h-4 transition-transform ${isLegalOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 transition-transform duration-200 ${isLegalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                        <div className="p-1"><NavLink to="/privacy-policy" className={dropdownNavLinkClasses}>سياسة الخصوصية</NavLink><NavLink to="/terms-of-use" className={dropdownNavLinkClasses}>شروط الاستخدام</NavLink></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="hidden md:inline-block bg-cyan-500 text-white font-semibold rounded-lg px-4 py-2 text-sm transition-transform hover:scale-105 hover:bg-cyan-600">حمّل التطبيق</a>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pt-2 pb-4 space-y-1 animate-fade-in-up">
                        <NavLink to="/" className={navLinkClasses}>الرئيسية</NavLink>
                        <NavLink to="/about" className={navLinkClasses}>حول التطبيق</NavLink>
                        <NavLink to="/about-city" className={navLinkClasses}>عن المدينة</NavLink>
                        <NavLink to="/about-company" className={navLinkClasses}>عن الشركة</NavLink>
                        <NavLink to="/faq" className={navLinkClasses}>الأسئلة الشائعة</NavLink>
                        <NavLink to="/privacy-policy" className={navLinkClasses}>سياسة الخصوصية</NavLink>
                        <NavLink to="/terms-of-use" className={navLinkClasses}>شروط الاستخدام</NavLink>
                        <div className="pt-4"><a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-cyan-500 text-white font-semibold rounded-lg px-4 py-2.5 text-sm">حمّل التطبيق</a></div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default PublicHeader;