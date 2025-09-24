import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCommunityContext } from '../../context/CommunityContext';
import { useUserManagementContext } from '../../context/UserManagementContext';
import KpiCard from '../common/KpiCard';
import { ChatBubbleOvalLeftIcon, UsersIcon, PlusIcon, ShieldExclamationIcon, TrashIcon, PinIcon } from '../common/Icons';

const CommunityManagerDashboard: React.FC = () => {
    const { communityPosts, handleDeletePost, handleTogglePostPin } = useCommunityContext();
    const { users } = useUserManagementContext();

    const stats = useMemo(() => {
        const totalPosts = communityPosts.length;
        const totalComments = communityPosts.reduce((acc, post) => acc + post.comments.length, 0);
        const reportedPosts = communityPosts.filter(p => p.isReported).length;
        const pinnedPosts = communityPosts.filter(p => p.isPinned).length;

        return { totalPosts, totalComments, reportedPosts, pinnedPosts };
    }, [communityPosts]);

    const latestPosts = useMemo(() => {
        return [...communityPosts]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5);
    }, [communityPosts]);

    const getUserById = (id: number) => users.find(u => u.id === id);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي المنشورات" value={stats.totalPosts.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="إجمالي التعليقات" value={stats.totalComments.toString()} icon={<UsersIcon className="w-8 h-8 text-purple-400" />} />
                <KpiCard title="منشورات مبلغ عنها" value={stats.reportedPosts.toString()} icon={<ShieldExclamationIcon className="w-8 h-8 text-rose-400" />} changeType="negative" />
                <KpiCard title="منشورات مثبتة" value={stats.pinnedPosts.toString()} icon={<PinIcon className="w-8 h-8 text-amber-400" />} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">أحدث المنشورات للمراجعة</h3>
                        <Link to="/community" className="text-sm text-cyan-500 hover:underline">عرض الكل</Link>
                    </div>
                    <div className="space-y-4">
                        {latestPosts.map(post => {
                            const author = getUserById(post.authorId);
                            return (
                                <div key={post.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <img src={author?.avatar} alt={author?.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-sm text-gray-800 dark:text-white">{author?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.timestamp).toLocaleDateString('ar-EG')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleTogglePostPin(post.id)} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 ${post.isPinned ? 'text-yellow-500' : 'text-gray-400'}`} title={post.isPinned ? "إلغاء التثبيت" : "تثبيت"}>
                                                <PinIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" title="حذف المنشور">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{post.content}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">منشورات مبلغ عنها</h3>
                        <ul className="space-y-2">
                            {communityPosts.filter(p => p.isReported).slice(0, 5).map(post => {
                                const author = getUserById(post.authorId);
                                return (
                                <li key={post.id} className="text-sm text-gray-600 dark:text-gray-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <p className="truncate">{post.content}</p>
                                    <p className="text-xs text-gray-400">بواسطة: {author?.name}</p>
                                </li>
                                )
                            })}
                            {stats.reportedPosts === 0 && <p className="text-sm text-gray-400 text-center py-4">لا توجد منشورات مبلغ عنها حالياً.</p>}
                        </ul>
                    </div>
                     <Link to="/community" className="block w-full text-center bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition-colors">
                        الانتقال إلى إدارة المجتمع
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CommunityManagerDashboard;
