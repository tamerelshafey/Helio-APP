import React, { useState, useMemo } from 'react';
import type { CommunityPost, CommunityComment, AppUser } from '../../types';
import { useCommunityContext } from '../../context/CommunityContext';
// FIX: Replaced deprecated useUserManagementContext with useQuery to fetch users from the API.
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../../api/usersApi';
import { useUIContext } from '../../context/UIContext';
import KpiCard from '../common/KpiCard';
import Modal from '../common/Modal';
import EmptyState from '../common/EmptyState';
import { 
    DocumentDuplicateIcon, ChatBubbleOvalLeftIcon, ShieldExclamationIcon,
    MagnifyingGlassIcon, PencilSquareIcon, TrashIcon, ChatBubbleLeftRightIcon
} from '../common/Icons';
import ImageUploader from '../common/ImageUploader';

const PostForm: React.FC<{ post: CommunityPost | null; onSave: (data: any) => void; onClose: () => void; }> = ({ post, onSave, onClose }) => {
    const { discussionCircles } = useCommunityContext();
    const [content, setContent] = useState(post?.content || '');
    const [images, setImages] = useState(post?.imageUrl ? [post.imageUrl] : []);
    const [circleId, setCircleId] = useState(post?.circleId || discussionCircles[0]?.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: post?.id, content, imageUrl: images[0], circleId });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">دائرة النقاش</label>
                <select value={circleId} onChange={e => setCircleId(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    {discussionCircles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">محتوى المنشور</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} required rows={5} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة (اختياري)"/>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const CommentForm: React.FC<{ comment: CommunityComment | null; onSave: (content: string) => void; onClose: () => void; }> = ({ comment, onSave, onClose }) => {
    const [content, setContent] = useState(comment?.content || '');
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(content); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium mb-1">محتوى التعليق</label>
                <textarea value={content} onChange={e => setContent(e.target.value)} required rows={4} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};


const PostsAndCommentsTab: React.FC = () => {
    const { 
        communityPosts, discussionCircles, handleDeletePost, handleUpdatePost,
        handleDeleteComment, handleUpdateComment, handleDismissPostReports, handleDismissCommentReports
    } = useCommunityContext();
    const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { showToast } = useUIContext();

    const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [circleFilter, setCircleFilter] = useState<number>(0); // 0 for all
    const [reportFilter, setReportFilter] = useState<'all' | 'reported'>('all');

    const [editingPost, setEditingPost] = useState<CommunityPost | null>(null);
    const [editingComment, setEditingComment] = useState<CommunityComment | null>(null);

    const getUser = (id: number): AppUser | undefined => users.find(u => u.id === id);

    const stats = useMemo(() => {
      const reportedPosts = communityPosts.filter(p => p.reports && p.reports.length > 0).length;
      const reportedComments = communityPosts.reduce((acc, post) => 
          acc + post.comments.filter(c => c.reports && c.reports.length > 0).length, 0);
      return {
          totalPosts: communityPosts.length,
          totalComments: communityPosts.reduce((acc, post) => acc + post.comments.length, 0),
          reportedContent: reportedPosts + reportedComments,
      };
    }, [communityPosts]);

    const filteredPosts = useMemo(() => {
        return communityPosts
            .filter(post => {
                const matchesCircle = circleFilter === 0 || post.circleId === circleFilter;
                const matchesReport = reportFilter === 'all' || (post.reports && post.reports.length > 0) || post.comments.some(c => c.reports && c.reports.length > 0);
                const matchesSearch = searchTerm === '' || post.content.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesCircle && matchesReport && matchesSearch;
            })
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [communityPosts, circleFilter, reportFilter, searchTerm]);

    const handleSavePost = (data: any) => { handleUpdatePost({ ...editingPost, ...data }); setEditingPost(null); showToast("تم تعديل المنشور بنجاح!"); };
    const handleSaveComment = (content: string) => { 
        if(editingComment && selectedPost) {
            handleUpdateComment(selectedPost.id, editingComment.id, content);
            setSelectedPost(prev => prev ? ({...prev, comments: prev.comments.map(c => c.id === editingComment.id ? {...c, content} : c)}) : null);
            setEditingComment(null);
            showToast("تم تعديل التعليق بنجاح!");
        }
    };
    const confirmDeletePost = (id: number) => { if(window.confirm("متأكد من حذف المنشور؟")) { handleDeletePost(id); if(selectedPost?.id === id) setSelectedPost(null); showToast("تم حذف المنشور"); } };
    const confirmDeleteComment = (postId: number, commentId: number) => { if(window.confirm("متأكد من حذف التعليق؟")) { handleDeleteComment(postId, commentId); setSelectedPost(prev => prev ? ({...prev, comments: prev.comments.filter(c => c.id !== commentId)}) : null); showToast("تم حذف التعليق"); } };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="إجمالي المنشورات" value={stats.totalPosts.toString()} icon={<DocumentDuplicateIcon className="w-8 h-8 text-cyan-400"/>} />
                <KpiCard title="إجمالي التعليقات" value={stats.totalComments.toString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-amber-400"/>} />
                <KpiCard title="محتوى للمراجعة" value={stats.reportedContent.toString()} icon={<ShieldExclamationIcon className="w-8 h-8 text-rose-400"/>} />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow"><MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" /><input type="text" placeholder="بحث في محتوى المنشورات..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4"/></div>
                <select value={circleFilter} onChange={e => setCircleFilter(Number(e.target.value))} className="w-full md:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4"><option value="0">كل الدوائر</option>{discussionCircles.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                <select value={reportFilter} onChange={e => setReportFilter(e.target.value as any)} className="w-full md:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4"><option value="all">كل الحالات</option><option value="reported">يحتوي على بلاغات</option></select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[60vh]">
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg h-full max-h-[70vh] overflow-y-auto">
                    {filteredPosts.map(post => (
                        <button key={post.id} onClick={() => setSelectedPost(post)} className={`w-full text-right p-3 rounded-lg mb-1 ${selectedPost?.id === post.id ? 'bg-cyan-100 dark:bg-cyan-900' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                            <p className="font-semibold text-sm line-clamp-2">{post.content}</p>
                            <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>{getUser(post.authorId)?.name || 'مستخدم'}</span>
                                <div>{(post.reports?.length || 0) > 0 && <span className="text-red-500">بلاغات!</span>}</div>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg h-full max-h-[70vh] overflow-y-auto">
                    {selectedPost ? (
                        <div>
                            {/* Post Details */}
                            <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-lg">{getUser(selectedPost.authorId)?.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(selectedPost.timestamp).toLocaleString('ar-EG')}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEditingPost(selectedPost)} className="p-2 text-blue-500 rounded-md hover:bg-slate-100"><PencilSquareIcon className="w-5 h-5" /></button>
                                        <button onClick={() => confirmDeletePost(selectedPost.id)} className="p-2 text-red-500 rounded-md hover:bg-slate-100"><TrashIcon className="w-5 h-5" /></button>
                                    </div>
                                </div>
                                <p className="mt-2 whitespace-pre-wrap">{selectedPost.content}</p>
                                {selectedPost.imageUrl && <img src={selectedPost.imageUrl} alt="post content" className="mt-3 rounded-lg max-h-64 w-auto"/>}
                                {(selectedPost.reports?.length || 0) > 0 && 
                                    <div className="mt-3 p-2 bg-red-100 dark:bg-red-900/50 rounded-md text-sm">
                                        <p className="font-bold text-red-700 dark:text-red-300">بلاغات على المنشور ({selectedPost.reports?.length})</p>
                                        <button onClick={() => handleDismissPostReports(selectedPost.id)} className="text-xs text-blue-600 hover:underline">تجاهل البلاغات</button>
                                    </div>
                                }
                            </div>
                            {/* Comments */}
                            <h4 className="font-bold mt-4 mb-2">التعليقات ({selectedPost.comments.length})</h4>
                            <div className="space-y-4">
                                {selectedPost.comments.map(comment => (
                                    <div key={comment.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-sm">{getUser(comment.authorId)?.name}</p>
                                                <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString('ar-EG')}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                <button onClick={() => setEditingComment(comment)} className="p-1 text-blue-500 rounded-md hover:bg-slate-200"><PencilSquareIcon className="w-4 h-4" /></button>
                                                <button onClick={() => confirmDeleteComment(selectedPost.id, comment.id)} className="p-1 text-red-500 rounded-md hover:bg-slate-200"><TrashIcon className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <p className="mt-1 text-sm">{comment.content}</p>
                                         {(comment.reports?.length || 0) > 0 && 
                                            <div className="mt-2 p-1.5 bg-red-100 dark:bg-red-900/50 rounded-md text-xs">
                                                <p className="font-bold text-red-700 dark:text-red-300">بلاغات على التعليق ({comment.reports?.length})</p>
                                                <button onClick={() => handleDismissCommentReports(selectedPost.id, comment.id)} className="text-xs text-blue-600 hover:underline">تجاهل البلاغات</button>
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <EmptyState icon={<DocumentDuplicateIcon className="w-16 h-16 text-slate-400"/>} title="اختر منشوراً" message="اختر منشوراً من القائمة لعرض تفاصيله وإدارته."/>}
                </div>
            </div>

            <Modal isOpen={!!editingPost} onClose={() => setEditingPost(null)} title="تعديل المنشور"><PostForm post={editingPost} onClose={() => setEditingPost(null)} onSave={handleSavePost} /></Modal>
            <Modal isOpen={!!editingComment} onClose={() => setEditingComment(null)} title="تعديل التعليق"><CommentForm comment={editingComment} onClose={() => setEditingComment(null)} onSave={handleSaveComment} /></Modal>
        </div>
    );
};

export default PostsAndCommentsTab;
