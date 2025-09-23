import React, { memo } from 'react';
import { SunIcon, MoonIcon } from './Icons';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();
  
  return (
    <header className="flex items-center justify-between p-4 sm:p-6 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-200">أهلاً بعودتك، مدير هليوبوليس الجديدة!</h2>
        <p className="text-gray-500 dark:text-gray-400 hidden sm:block">هنا ملخص نمو وتفاعل المجتمع.</p>
      </div>

      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-slate-800 focus:outline-none transition-colors" title="Toggle dark mode">
            {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

export default memo(Header);