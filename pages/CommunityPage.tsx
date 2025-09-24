import React, { useMemo } from 'react';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import { useCommunityContext } from '../context/CommunityContext';
import type { CommunityPost, AppUser } from '../types';
import {
    ArrowLeftIcon,
    ChatBubbleOvalLeftIcon,
    UsersIcon,
    PlusIcon,
    TrashIcon,
    PinIcon,
    MapPinSolidIcon
} from '../components/common/Icons';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../components/common/KpiCard';

const formatTimestamp = (timestamp: string) => {
    // A simple formatter
    return new Date(timestamp).toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const { users } = useUserManagementContext();
    const {
        communityPosts,
        handleDeletePost,
        handleTogglePostPin,
        handleDeleteComment
    } = useCommunityContext();
    const { showToast } = useUIContext();

    const getUserById = (id: number): AppUser | undefined => users.find(u => u.id === id);

    const sortedPosts = useMemo(() => {
        return [...communityPosts].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
    }, [communityPosts]);

    const stats = useMemo(() => {
        const totalPosts = communityPosts.length;
        const today = new Date().toISOString().split('T')[0];
        const newPostsToday = communityPosts.filter(p => p.timestamp.startsWith(today)).length;
        const totalComments = communityPosts.reduce((acc, post) => acc + post.comments.length, 0);
        return { totalPosts, newPostsToday, totalComments };
    }, [communityPosts]);

    const confirmDeletePost = (postId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            handleDeletePost(postId);
            showToast('تم حذف المنشور بنجاح!');
        }
    };

    const togglePin = (postId: number) => {
        const isPinned = communityPosts.find(p => p.id === postId)?.isPinned;
        handleTogglePostPin(postId);
        showToast(isPinned ? 'تم إلغاء تثبيت المنشور.' : 'تم تثبيت المنشور.');
    };

    const confirmDeleteComment = (postId: number, commentId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
            handleDeleteComment(postId, commentId);
            showToast('تم حذف التعليق بنجاح!');
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <KpiCard title="إجمالي المنشورات" value={stats.totalPosts.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="منشورات جديدة اليوم" value={stats.newPostsToday.toString()} icon={<PlusIcon className="w-8 h-8 text-lime-400" />} />
                <KpiCard title="إجمالي التعليقات" value={stats.totalComments.toString()} icon={<UsersIcon className="w-8 h-8 text-amber-400" />} />
            </div>

            <div className="space-y-6">
                {sortedPosts.map(post => {
                    const author = getUserById(post.authorId);
                    return (
                        <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 relative">
                            {post.isPinned && (
                                <div className="absolute top-4 left-4 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-100 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                                    <MapPinSolidIcon className="w-4 h-4" />
                                    <span>مثبت</span>
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <img src={author?.avatar} alt={author?.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{author?.name || 'مستخدم محذوف'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimestamp(post.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => togglePin(post.id)} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${post.isPinned ? 'text-yellow-500' : 'text-gray-400'}`} title={post.isPinned ? "إلغاء التثبيت" : "تثبيت"}>
                                        <PinIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => confirmDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" title="حذف المنشور">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="my-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

                            {post.imageUrl && (
                                <div className="my-4">
                                    <img src={post.imageUrl} alt="مرفق المنشور" className="max-w-full md:max-w-md mx-auto rounded-lg shadow-md" />
                                </div>
                            )}

                            {post.comments.length > 0 && (
                                <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">التعليقات ({post.comments.length})</h4>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-4">
                                        {post.comments.map(comment => {
                                            const commentAuthor = getUserById(comment.authorId);
                                            return (
                                                <div key={comment.id} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                                                    <img src={commentAuthor?.avatar} alt={commentAuthor?.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <div className="flex-grow">
                                                        <div className="flex justify-between items-center">
                                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{commentAuthor?.name || 'مستخدم محذوف'}</p>
                                                             <button onClick={() => confirmDeleteComment(post.id, comment.id)} className="p-1 text-red-500 opacity-50 hover:opacity-100" title="حذف التعليق">
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {sortedPosts.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg">
                    <p className="text-gray-500">لا توجد منشورات في المجتمع حالياً.</p>
                </div>
            )}
        </div>
    );
};

export default CommunityPage;