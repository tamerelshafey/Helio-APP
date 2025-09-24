import React from 'react';

const PropertyMap: React.FC = () => {
  // A simplified SVG map placeholder
  return (
    <div className="relative h-64 w-full bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden">
        <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <path d="M 0,50 C 30,10 60,10 100,50 S 150,90 200,50 L 200,100 L 0,100 Z" className="fill-slate-300 dark:fill-slate-700" />
            <path d="M 0,60 C 20,40 40,80 80,60 S 140,40 200,70 L 200,100 L 0,100 Z" className="fill-slate-400 dark:fill-slate-600" />
            
            {/* Property dots */}
            <circle cx="50" cy="45" r="3" fill="#f43f5e" className="animate-pulse" />
            <circle cx="80" cy="60" r="3" fill="#f43f5e" />
            <circle cx="120" cy="55" r="3" fill="#fbbf24" />
            <circle cx="150" cy="70" r="3" fill="#f43f5e" className="animate-pulse delay-150" />
            <circle cx="95" cy="30" r="3" fill="#22d3ee" />
            <circle cx="20" cy="75" r="3" fill="#f43f5e" className="animate-pulse delay-300" />
             <circle cx="180" cy="65" r="3" fill="#a78bfa" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
        <div className="absolute bottom-2 left-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-2 rounded-md text-xs">
            <p className="font-bold">50+ خدمة متاحة</p>
            <p>تغطي كافة أنحاء المدينة</p>
        </div>
    </div>
  );
};

export default PropertyMap;
