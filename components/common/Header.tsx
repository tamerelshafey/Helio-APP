import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useUIContext } from '../../context/UIContext';
import { SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon, ArrowUturnLeftIcon } from './Icons';
import GlobalSearchModal from './GlobalSearchModal';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuthContext();
    const { isDarkMode, toggleDarkMode } = useUIContext();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <header className="flex-shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800" dir="rtl">
                <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                       <Link to="/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-500 transition-colors">
                           <ArrowUturnLeftIcon className="w-5 h-5" />
                           <span>العودة للموقع الرئيسي</span>
                       </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSearchOpen(true)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <MagnifyingGlassIcon className="w-6 h-6" />
                        </button>
                        <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                            {isDarkMode ? <SunIcon className="w-6 h-6"/> : <MoonIcon className="w-6 h-6"/>}
                        </button>

                        <div className="relative">
                            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 rtl:space-x-reverse">
                                <img className="h-10 w-10 rounded-full object-cover" src={currentUser?.avatar} alt={currentUser?.name} />
                                <div className="hidden sm:block text-right">
                                    <div className="font-semibold text-gray-800 dark:text-white">{currentUser?.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.roles.join(', ')}</div>
                                </div>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 origin-top-left rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1">
                                        <button onClick={logout} className="w-full text-right flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">
                                            <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                                            <span>تسجيل الخروج</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;