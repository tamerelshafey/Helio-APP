import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSaleItems, getJobs } from '../api/marketplaceApi';
import { getLostAndFoundItems } from '../api/communityApi';
import {
    ChatBubbleOvalLeftIcon, TagIcon, BriefcaseIcon, ArchiveBoxIcon, ChatBubbleBottomCenterTextIcon,
    ClipboardDocumentCheckIcon
} from '../components/common/Icons';
import TabButton from '../components/common/TabButton';
import useDocumentTitle from '../hooks/useDocumentTitle';

// Import tab components
import CirclesTab from '../components/community/CirclesTab';
import PostsAndCommentsTab from '../components/community/PostsAndCommentsTab';
import BuySellTab from '../components/community/BuySellTab';
import JobsTab from '../components/community/JobsTab';
import LostAndFoundTab from '../components/community/LostAndFoundTab';
import ReviewQueueTab from '../components/community/ReviewQueueTab';

type CommunityTab = 'circles' | 'posts' | 'buy-sell' | 'jobs' | 'lost-found' | 'review-queue';

const CommunityPage: React.FC = () => {
    useDocumentTitle('إدارة المجتمع | Helio');
    const [activeTab, setActiveTab] = useState<CommunityTab>('review-queue');
    
    // Fetch data for counters
    const { data: forSaleItems = [] } = useQuery({ queryKey: ['saleItems'], queryFn: getSaleItems });
    const { data: jobs = [] } = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
    const { data: lostAndFoundItems = [] } = useQuery({ queryKey: ['lostAndFound'], queryFn: getLostAndFoundItems });

    const reviewQueueCount = useMemo(() => {
        const pendingSale = forSaleItems.filter(i => i.status === 'pending').length;
        const pendingJobs = jobs.filter(j => j.status === 'pending').length;
        const pendingLostFound = lostAndFoundItems.filter(i => i.moderationStatus === 'pending').length;
        return pendingSale + pendingJobs + pendingLostFound;
    }, [forSaleItems, jobs, lostAndFoundItems]);

    const renderContent = () => {
        switch(activeTab) {
            case 'circles': return <CirclesTab />;
            case 'posts': return <PostsAndCommentsTab />;
            case 'buy-sell': return <BuySellTab />;
            case 'jobs': return <JobsTab />;
            case 'lost-found': return <LostAndFoundTab />;
            case 'review-queue': return <ReviewQueueTab />;
            default: return null;
        }
    };

    return (
        <div className="animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">إدارة المجتمع</h1>
                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'review-queue'} onClick={() => setActiveTab('review-queue')} icon={<ClipboardDocumentCheckIcon className="w-5 h-5"/>}>
                        مراجعة الطلبات
                        {reviewQueueCount > 0 && (
                            <span className="mr-2 rtl:mr-0 rtl:ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{reviewQueueCount}</span>
                        )}
                    </TabButton>
                    <TabButton active={activeTab === 'circles'} onClick={() => setActiveTab('circles')} icon={<ChatBubbleOvalLeftIcon className="w-5 h-5"/>}>دوائر النقاش</TabButton>
                    <TabButton active={activeTab === 'posts'} onClick={() => setActiveTab('posts')} icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>}>المنشورات والتعليقات</TabButton>
                    <TabButton active={activeTab === 'buy-sell'} onClick={() => setActiveTab('buy-sell')} icon={<TagIcon className="w-5 h-5"/>}>البيع والشراء</TabButton>
                    <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<BriefcaseIcon className="w-5 h-5"/>}>الوظائف</TabButton>
                    <TabButton active={activeTab === 'lost-found'} onClick={() => setActiveTab('lost-found')} icon={<ArchiveBoxIcon className="w-5 h-5"/>}>المفقودات</TabButton>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default CommunityPage;