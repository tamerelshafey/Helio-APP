import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookOpenIcon } from '../components/common/Icons';

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();
    const privacyPolicyUrl = "https://helioapp.tech-bokra.com/privacy";

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <BookOpenIcon className="w-8 h-8 text-cyan-500" />
                    سياسة الخصوصية
                </h1>
                <div className="w-full h-[70vh] border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <iframe
                        src={privacyPolicyUrl}
                        title="سياسة الخصوصية"
                        className="w-full h-full"
                        frameBorder="0"
                    />
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
