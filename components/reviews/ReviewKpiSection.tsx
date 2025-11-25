import React from 'react';
import KpiCard from '../common/KpiCard';
import { ChatBubbleOvalLeftIcon, StarIcon, ArrowTrendingUpIcon, ChatBubbleLeftRightIcon } from '../common/Icons';

interface ReviewStats {
    total: number;
    averageRating: number;
    newReviews: number;
    pendingReplies: number;
}

interface ReviewKpiSectionProps {
    stats: ReviewStats;
}

const ReviewKpiSection: React.FC<ReviewKpiSectionProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KpiCard title="إجمالي التقييمات" value={stats.total.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400" />} />
            <KpiCard title="متوسط التقييم" value={stats.averageRating.toFixed(1)} icon={<StarIcon className="w-8 h-8 text-amber-400" />} />
            <KpiCard title="تقييمات جديدة (30 يوم)" value={stats.newReviews.toString()} icon={<ArrowTrendingUpIcon className="w-8 h-8 text-lime-400" />} />
            <KpiCard title="بانتظار الرد" value={stats.pendingReplies.toString()} icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-400" />} />
        </div>
    );
};

export default ReviewKpiSection;
