import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChevronDownIcon, QuestionMarkCircleIcon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';

interface FaqItemProps {
    question: string;
    answer: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => {
    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center p-4 text-right bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
                <span className="font-semibold text-lg text-gray-800 dark:text-white">{question}</span>
                <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}>
                <div className="p-6 text-gray-600 dark:text-gray-300 leading-relaxed prose dark:prose-invert max-w-none">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

const FaqPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicPagesContent } = useAppContext();
    const content = publicPagesContent.faq;
    const [openFaqId, setOpenFaqId] = useState<string | null>('c0-i0'); // Unique ID for each item

    return (
        <div className="animate-fade-in py-12 px-4">
             <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6 max-w-4xl mx-auto">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                        <QuestionMarkCircleIcon className="w-12 h-12 text-cyan-500" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">{content.title}</h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{content.subtitle}</p>
                </div>
                
                <div className="space-y-8">
                    {content.categories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-200 border-b-2 border-cyan-500/50 pb-2">{category.category}</h2>
                            <div className="space-y-4">
                                {category.items.map((item, itemIndex) => {
                                    const id = `c${catIndex}-i${itemIndex}`;
                                    return (
                                        <FaqItem
                                            key={id}
                                            question={item.q}
                                            answer={item.a}
                                            isOpen={openFaqId === id}
                                            onClick={() => setOpenFaqId(openFaqId === id ? null : id)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                 <div className="mt-12 text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <p className="font-bold text-xl">☀️ Helio APP = مدينتك في جيبك</p>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">كل الأماكن، كل الخدمات، كل التفاصيل... في تطبيق واحد. جربه دلوقتي، وخلي المدينة أسهل.</p>
                </div>
            </div>
        </div>
    );
};

export default FaqPage;
