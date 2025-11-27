import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPublicContent } from '../api/generalApi';
import { ArrowLeftIcon, BookOpenIcon } from '../components/common/Icons';
import QueryStateWrapper from '../components/common/QueryStateWrapper';
import useDocumentTitle from '../hooks/useDocumentTitle';

const PrivacyPolicyPage: React.FC = () => {
    useDocumentTitle('سياسة الخصوصية | Helio');
    const navigate = useNavigate();
    const { data: publicContent } = useQuery({ queryKey: ['publicContent'], queryFn: getPublicContent });
    const content = publicContent?.privacy;

    if (!content) return null;

    return (
        <QueryStateWrapper queries={{ isLoading: !publicContent, isError: false, error: null, refetch: () => {} }}>
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
                                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </QueryStateWrapper>
    );
};

export default PrivacyPolicyPage;