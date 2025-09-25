import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookOpenIcon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();
    const { publicPagesContent } = useAppContext();
    const content = publicPagesContent.privacy;

    return (
        <div className="animate-fade-in py-12 px-4" dir="rtl">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">
                            <BookOpenIcon className="w-12 h-12 text-cyan-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">{content.title}</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">آخر تحديث: {content.lastUpdated}</p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-right leading-relaxed">
                        {content.sections.map((section, index) => (
                            <React.Fragment key={index}>
                                <h2>{section.title}</h2>
                                {section.content.map((item, itemIndex) => {
                                    if (typeof item === 'string') {
                                        // Simple check for titles within content
                                        if (item.endsWith(':')) {
                                            return <h3 key={itemIndex} className="font-semibold mt-4">{item}</h3>;
                                        }
                                        return <p key={itemIndex}>{item}</p>;
                                    } else if (item.list) {
                                        return (
                                            <ul key={itemIndex}>
                                                {item.list.map((li, liIndex) => <li key={liIndex}>{li}</li>)}
                                            </ul>
                                        );
                                    }
                                    return null;
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
