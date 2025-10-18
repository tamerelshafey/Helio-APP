import React, { memo, useState, useEffect, useRef } from 'react';
import { BellIcon, SunIcon, MoonIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, MagnifyingGlassIcon, EyeIcon } from '../Icons';
import { useUIContext } from '../../context/UIContext';
import { useAuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import GlobalSearchModal from './GlobalSearchModal';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useUIContext();
  const { currentUser, logout } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  return (
    <>
      <header className="flex items-center justify-between p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div>
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-2 rounded-lg focus:outline-none transition-colors" 
            title="بحث شامل"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span className="hidden md:inline">بحث...</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Link to="/home" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors" title="عرض الموقع الرئيسي">
              <EyeIcon className="w-6 h-6" />
          </Link>
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors" title="Toggle dark mode">
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
          <div className="relative">
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors">
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
              </button>
          </div>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="block rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-900 focus:ring-cyan-500">
              <img className="w-10 h-10 rounded-full object-cover" src={currentUser.avatar} alt={currentUser.name} />
            </button>
            
            <div className={`origin-top-left absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out transform ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} role="menu" aria-orientation="vertical">
                <div className="py-1" role="none">
                  <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white" role="none">{currentUser.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate" role="none">{currentUser.email}</p>
                  </div>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">
                    <Cog6ToothIcon className="w-5 h-5"/>
                    <span>الإعدادات</span>
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-right flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-700" role="menuitem">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            
          </div>
        </div>
      </header>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default memo(Header);