import React, { useState, useMemo } from 'react';
import { useCommunityContext } from '../context/CommunityContext';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import type { CommunityPost, DiscussionCircle, CommunityComment, DiscussionCircleCategory } from '../types';
import { ChatBubbleOvalLeftIcon, UserGroupIcon, PlusIcon, PencilSquareIcon, TrashIcon, ArrowLeftIcon } from '../components/common/Icons';
import KpiCard from '../components/common/KpiCard';
import Modal from '../components/common/Modal';

// Main Page Component
const CommunityPage: React.FC = () => {
    const { discussionCircles, communityPosts, handleSaveCircle, handleDeleteCircle, handleSavePost, handleDeletePost } = useCommunityContext();
    const [selectedCircle, setSelectedCircle] = useState<DiscussionCircle | null>(null);
    const [modal, setModal] = useState<{ type: 'circle' | 'post'; data: any } | null>(null);
    const { showToast } = useUIContext();

    const postCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        for (const post of communityPosts) {
            counts[post.circleId] = (counts[post.circleId] || 0) + 1;
        }
        return counts;
    }, [communityPosts]);

    const categorizedCircles = useMemo(() => {
        const categories: Record<DiscussionCircleCategory, DiscussionCircle[]> = {
            'عام': [],
            'خدمات مجتمعية': [],
            'أحياء سكنية': [],
            'كمبوندات': [],
        };
        discussionCircles.forEach(circle => {
            if (categories[circle.category]) {
                categories[circle.category].push(circle);
            }
        });
        return categories;
    }, [discussionCircles]);

    const confirmDeleteCircle = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الدائرة؟ سيتم نقل منشوراتها إلى "نقاش عام".')) {
            handleDeleteCircle(id);
            showToast('تم حذف الدائرة بنجاح!');
        }
    };
    
    if (selectedCircle) {
        return <PostsView circle={selectedCircle} onBack={() => setSelectedCircle(null)} />;
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                    <ChatBubbleOvalLeftIcon className="w-8 h-8" />
                    دوائر النقاش
                </h1>
                <button onClick={() => setModal({ type: 'circle', data: null })} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                    <PlusIcon className="w-5 h-5"/> إضافة دائرة
                </button>
            </div>
            
            <div className="space-y-8">
                {(Object.keys(categorizedCircles) as DiscussionCircleCategory[]).map(category => (
                    categorizedCircles[category].length > 0 && (
                        <div key={category}>
                            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4 border-r-4 border-cyan-500 pr-4">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categorizedCircles[category].map(circle => (
                                    <div key={circle.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg group relative">
                                        <div onClick={() => setSelectedCircle(circle)} className="cursor-pointer">
                                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{circle.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{circle.description}</p>
                                            <p className="text-xs font-semibold text-cyan-500 mt-2">{postCounts[circle.id] || 0} منشور</p>
                                        </div>
                                        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setModal({ type: 'circle', data: circle })} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500"><PencilSquareIcon className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDeleteCircle(circle.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {modal?.type === 'circle' && (
                <Modal isOpen={true} onClose={() => setModal(null)} title={modal.data ? 'تعديل دائرة النقاش' : 'إضافة دائرة نقاش'}>
                    <CircleForm
                        circle={modal.data}
                        onSave={(data) => {
                            handleSaveCircle(data);
                            showToast('تم حفظ الدائرة بنجاح!');
                            setModal(null);
                        }}
                        onClose={() => setModal(null)}
                    />
                </Modal>
            )}
        </div>
    );
};

// Posts View for a selected circle
const PostsView: React.FC<{ circle: DiscussionCircle; onBack: () => void }> = ({ circle, onBack }) => {
    const { communityPosts, handleDeletePost } = useCommunityContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();

    const postsInCircle = useMemo(() => 
        communityPosts
            .filter(p => p.circleId === circle.id)
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), 
        [communityPosts, circle.id]
    );
    const getUser = (id: number) => users.find(u => u.id === id);

    const confirmDeletePost = (id: number) => {
        if(window.confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
            handleDeletePost(id);
            showToast("تم حذف المنشور.");
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={onBack} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline"><ArrowLeftIcon className="w-5 h-5"/><span>العودة لدوائر النقاش</span></button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">منشورات: {circle.name}</h1>
            <div className="space-y-4">
                {postsInCircle.map(post => {
                    const author = getUser(post.authorId);
                    return (
                        <div key={post.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <img src={author?.avatar} alt={author?.name} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{author?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(post.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => confirmDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                            <p className="mt-3 text-gray-700 dark:text-gray-300">{post.content}</p>
                            {post.imageUrl && <img src={post.imageUrl} className="mt-2 rounded-lg max-h-80 w-auto"/>}
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex gap-4">
                                <span>{post.likes} إعجاب</span>
                                <span>{post.comments.length} تعليق</span>
                                {post.reports && post.reports.length > 0 && <span className="text-red-500 font-bold">{post.reports.length} بلاغ</span>}
                            </div>
                        </div>
                    );
                })}
                 {postsInCircle.length === 0 && <p className="text-center py-10 text-gray-500">لا توجد منشورات في هذه الدائرة بعد.</p>}
            </div>
        </div>
    );
};


// Form for Circle
const CircleForm: React.FC<{ circle: DiscussionCircle | null; onSave: (data: any) => void; onClose: () => void; }> = ({ circle, onSave, onClose }) => {
    const [name, setName] = useState(circle?.name || '');
    const [description, setDescription] = useState(circle?.description || '');
    const [category, setCategory] = useState<DiscussionCircleCategory>(circle?.category || 'عام');
    const categories: DiscussionCircleCategory[] = ['عام', 'خدمات مجتمعية', 'أحياء سكنية', 'كمبوندات'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: circle?.id, name, description, category });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم الدائرة</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select value={category} onChange={e => setCategory(e.target.value as DiscussionCircleCategory)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};


export default CommunityPage;