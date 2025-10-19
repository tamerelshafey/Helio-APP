import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon } from '../components/common/Icons';

const BlankPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center min-h-[60vh] flex flex-col justify-center items-center">
                <CubeIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    صفحة فارغة
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    هذه الصفحة جاهزة لإضافة محتوى جديد.
                </p>
            </div>
        </div>
    );
};

export default BlankPage;
