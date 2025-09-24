import React, { useState, useMemo } from 'react';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import { useCommunityContext } from '../context/CommunityContext';
import type { CommunityPost, CommunityComment, AppUser } from '../types';
import {
    ArrowLeftIcon,
    ChatBubbleOvalLeftIcon,
    UsersIcon,
    TrashIcon,
    PinIcon,
    MapPinSolidIcon,
    ChatBubbleLeftRightIcon
} from '../components/common/Icons';
import { useNavigate } from 'react-router-dom';
import KpiCard from '../components/common/KpiCard';
import Modal from '../components/common/Modal';

const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ar-EG', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
};

const CommentsModal: React.FC<{
    post: CommunityPost;
    isOpen: boolean;
    onClose: () => void;
    onDeleteComment: (postId: number, commentId: number) => void;
    getUserById: (id: number) => AppUser | undefined;
}> = ({ post, isOpen, onClose, onDeleteComment, getUserById }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`تعليقات على منشور "${post.content.substring(0, 20)}..."`}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                {post.comments.length > 0 ? post.comments.map(comment => {
                    const author = getUserById(comment.authorId);
                    return (
                        <div key={comment.id} className="flex items-start gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <img src={author?.avatar} alt={author?.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{author?.name || 'مستخدم محذوف'}</p>
                                    <button onClick={() => onDeleteComment(post.id, comment.id)} className="p-1 text-red-500 opacity-50 hover:opacity-100" title="حذف التعليق">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{comment.content}</p>
                            </div>
                        </div>
                    )
                }) : <p className="text-center text-gray-500 py-8">لا توجد تعليقات على هذا المنشور.</p>}
            </div>
        </Modal>
    );
};


const PollDisplay: React.FC<{ post: CommunityPost }> = ({ post }) => {
    const { handleVote } = useCommunityContext();
    const totalVotes = useMemo(() => post.pollOptions?.reduce((sum, option) => sum + option.votes, 0) || 0, [post.pollOptions]);

    return (
        <div className="my-4 space-y-3">
            {post.pollOptions?.map((option, index) => {
                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                return (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm font-medium">
                            <span className="text-gray-700 dark:text-gray-200">{option.text}</span>
                            <span className="text-gray-500 dark:text-gray-400">{option.votes} صوت</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-6 relative overflow-hidden">
                            <div className="bg-cyan-500 h-6 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                             <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white mix-blend-lighten">{Math.round(percentage)}%</span>
                        </div>
                         <button onClick={() => handleVote(post.id, index)} className="mt-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                            صوّت لهذا الخيار
                        </button>
                    </div>
                )
            })}
        </div>
    );
}

const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const { users } = useUserManagementContext();
    const { communityPosts, handleDeletePost, handleTogglePostPin, handleDeleteComment } = useCommunityContext();
    const { showToast } = useUIContext();

    const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);

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
        const totalComments = communityPosts.reduce((acc, post) => acc + post.comments.length, 0);

        const activity = communityPosts.reduce((acc, post) => {
            acc[post.authorId] = (acc[post.authorId] || 0) + 1; // 1 point for a post
            post.comments.forEach(c => {
                 acc[c.authorId] = (acc[c.authorId] || 0) + 0.5; // 0.5 points for a comment
            });
            return acc;
        }, {} as Record<number, number>);

        const mostActiveUserId = Object.keys(activity).length > 0 ? parseInt(Object.keys(activity).reduce((a, b) => activity[parseInt(a)] > activity[parseInt(b)] ? a : b)) : null;
        const mostActiveUser = mostActiveUserId ? getUserById(mostActiveUserId)?.name : 'لا يوجد';

        return { totalPosts, totalComments, mostActiveUser };
    }, [communityPosts, users]);


    const confirmDeletePost = (postId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            handleDeletePost(postId);
            showToast('تم حذف المنشور بنجاح!');
        }
    };

    const togglePin = (postId: number) => {
        const isPinned = communityPosts.find(p => p.id === postId)?.isPinned;
        handleTogglePostPin(postId);
        showToast(isPinned ? 'تم إلغاء تثبيت المنشور.' : 'تم تثبيت المنشور بنجاح!');
    };

    const confirmDeleteComment = (postId: number, commentId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
            handleDeleteComment(postId, commentId);
            showToast('تم حذف التعليق بنجاح!');
        }
    };

    const handleOpenCommentsModal = (post: CommunityPost) => {
        setSelectedPost(post);
        setCommentsModalOpen(true);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">إدارة المجتمع</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <KpiCard title="إجمالي المنشورات" value={stats.totalPosts.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="إجمالي التعليقات" value={stats.totalComments.toString()} icon={<ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-400" />} />
                <KpiCard title="المستخدم الأكثر تفاعلاً" value={stats.mostActiveUser} icon={<UsersIcon className="w-8 h-8 text-amber-400" />} />
            </div>

            <div className="space-y-6">
                {sortedPosts.map(post => {
                    const author = getUserById(post.authorId);
                    return (
                        <div key={post.id} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 relative border-2 ${post.isPinned ? 'border-cyan-500' : 'border-transparent'}`}>
                            {post.isPinned && (
                                <div className="absolute top-4 left-4 flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 font-semibold bg-cyan-100 dark:bg-cyan-900/50 px-2 py-1 rounded-full">
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
                                    <button onClick={() => togglePin(post.id)} className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 ${post.isPinned ? 'text-cyan-500' : 'text-gray-400'}`} title={post.isPinned ? "إلغاء التثبيت" : "تثبيت"}>
                                        <PinIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => confirmDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full" title="حذف المنشور">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <p className="my-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>

                             {post.type === 'poll' && <PollDisplay post={post} />}

                            {post.imageUrl && (
                                <div className="my-4">
                                    <img src={post.imageUrl} alt="مرفق المنشور" className="max-w-full md:max-w-md mx-auto rounded-lg shadow-md" />
                                </div>
                            )}

                            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                                <span className="text-sm text-gray-500">{post.comments.length} تعليقات</span>
                                <button onClick={() => handleOpenCommentsModal(post)} className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                                    إدارة التعليقات
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {sortedPosts.length === 0 && (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg">
                    <p className="text-gray-500">لا توجد منشورات في المجتمع حالياً.</p>
                </div>
            )}
            
            {selectedPost && <CommentsModal post={selectedPost} isOpen={isCommentsModalOpen} onClose={() => setCommentsModalOpen(false)} onDeleteComment={confirmDeleteComment} getUserById={getUserById} />}
        </div>
    );
};

export default CommunityPage;