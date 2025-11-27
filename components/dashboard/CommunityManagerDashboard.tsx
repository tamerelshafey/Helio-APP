import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPosts, getCircles } from '../../api/communityApi';
import KpiCard from '../common/KpiCard';
import { UserGroupIcon, DocumentDuplicateIcon, ShieldExclamationIcon, ChatBubbleOvalLeftIcon } from '../common/Icons';
import QueryStateWrapper from '../common/QueryStateWrapper';

const CommunityManagerDashboard: React.FC = () => {
  const postsQuery = useQuery({ queryKey: ['posts'], queryFn: getPosts });
  const circlesQuery = useQuery({ queryKey: ['circles'], queryFn: getCircles });

  const communityPosts = postsQuery.data || [];
  const discussionCircles = circlesQuery.data || [];

  const stats = useMemo(() => {
      const reportedPosts = communityPosts.filter(p => p.reports && p.reports.length > 0).length;
      const reportedComments = communityPosts.reduce((acc, post) => 
          acc + post.comments.filter(c => c.reports && c.reports.length > 0).length, 0);
      
      return {
          totalCircles: discussionCircles.length,
          totalPosts: communityPosts.length,
          totalComments: communityPosts.reduce((acc, post) => acc + post.comments.length, 0),
          reportedContent: reportedPosts + reportedComments,
      };
  }, [communityPosts, discussionCircles]);

  return (
    <QueryStateWrapper queries={[postsQuery, circlesQuery]}>
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-2xl font-bold">لوحة معلومات مدير المجتمع</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/dashboard/community">
                <KpiCard title="إجمالي دوائر النقاش" value={stats.totalCircles.toString()} icon={<UserGroupIcon className="w-8 h-8 text-cyan-400"/>} />
                </Link>
                <Link to="/dashboard/community">
                <KpiCard title="إجمالي المنشورات" value={stats.totalPosts.toString()} icon={<DocumentDuplicateIcon className="w-8 h-8 text-amber-400"/>} />
                </Link>
                <Link to="/dashboard/community">
                <KpiCard title="إجمالي التعليقات" value={stats.totalComments.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-lime-400"/>} />
                </Link>
                <Link to="/dashboard/community">
                <KpiCard title="محتوى بحاجة للمراجعة" value={stats.reportedContent.toString()} icon={<ShieldExclamationIcon className="w-8 h-8 text-rose-400"/>} />
                </Link>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">إجراءات سريعة</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/dashboard/community" className="flex-1 text-center bg-cyan-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors">
                        الانتقال إلى إدارة المجتمع
                    </Link>
                </div>
            </div>
        </div>
    </QueryStateWrapper>
  );
};

export default CommunityManagerDashboard;
