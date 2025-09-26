import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CubeIcon } from '../components/common/Icons';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg text-center max-w-4xl mx-auto">
                <div className="flex justify-center items-center mb-6">
                     <div className="p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                        <CubeIcon className="w-12 h-12 text-cyan-500" />
                     </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                    حول تطبيق Helio
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    تطبيق "هيليو" هو بوابتك الرقمية الشاملة لمدينة هليوبوليس الجديدة. تم تصميم التطبيق ليكون الرفيق اليومي لكل ساكن، حيث يهدف إلى تسهيل الوصول إلى كافة الخدمات والمعلومات الحيوية داخل المدينة، وتعزيز التواصل بين السكان وإدارة المدينة.
                </p>
                <div className="grid md:grid-cols-2 gap-8 text-right">
                    <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">رؤيتنا</h2>
                        <p>أن نكون المنصة الرائدة التي تساهم في بناء مجتمع مترابط وذكي في هليوبوليس الجديدة، حيث يتمتع السكان بحياة أسهل وأكثر راحة من خلال التكنولوجيا.</p>
                    </div>
                     <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-3 text-cyan-600 dark:text-cyan-400">مهمتنا</h2>
                        <p>توفير منصة موحدة تجمع كافة الخدمات، الأخبار، والعقارات، وتسهل التواصل الفعال بين السكان، مقدمي الخدمات، وإدارة المدينة لتعزيز جودة الحياة للجميع.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
