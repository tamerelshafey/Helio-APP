import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicPagesContent } = useAppContext();
    const content = publicPagesContent.about;

    return (
        <div className="animate-fade-in py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center">
                    <div className="flex justify-center items-center mb-6">
                         <div className="p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                            <CubeIcon className="w-12 h-12 text-cyan-500" />
                         </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        {content.title}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                        {content.intro}
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-right">
                        <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">{content.vision.title}</h2>
                            <p>{content.vision.text}</p>
                        </div>
                         <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">{content.mission.title}</h2>
                            <p>{content.mission.text}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
