import React, { memo } from 'react';
import { BellIcon, SunIcon, MoonIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode, currentUser } = useAppContext();
  
  return (
    <header className="flex items-center justify-between p-6 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">أهلاً بعودتك، {currentUser?.name || 'مدير هليوبوليس الجديدة'}!</h2>
        <p className="text-gray-500 dark:text-gray-400">هنا ملخص نمو وتفاعل المجتمع.</p>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
  );
};

export default memo(Header);