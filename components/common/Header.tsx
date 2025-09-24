import React, { memo, useState } from 'react';
import { MagnifyingGlassIcon, BellIcon, SunIcon, MoonIcon } from './Icons';
import { useAuthContext } from '../../context/AuthContext';
import { useUIContext } from '../../context/UIContext';
import GlobalSearchModal from './GlobalSearchModal';

const Header: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useUIContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <>
      <header className="flex items-center justify-between p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200">
            أهلاً بعودتك، {currentUser?.name}!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 hidden sm:block">هنا ملخص نمو وتفاعل المجتمع.</p>
        </div>

        <div className="flex items-center space-x-2 rtl:space-x-reverse">
           <button 
            onClick={() => setIsSearchOpen(true)} 
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-slate-200/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 px-4 py-2 rounded-lg focus:outline-none transition-colors" 
            title="بحث شامل"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span className="hidden md:inline">بحث...</span>
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors" title="Toggle dark mode">
              {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
          <div className="relative">
              <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors">
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
              </button>
          </div>
        </div>
      </header>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default memo(Header);
