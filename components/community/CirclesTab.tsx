import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCircles, saveCircle, deleteCircle, getPosts } from '../../api/communityApi';
import type { DiscussionCircle, DiscussionCircleCategory } from '../../types';
import { useStore } from '../../store';
import Modal from '../common/Modal';
import { PlusIcon, PencilSquareIcon, TrashIcon } from '../common/Icons';
import QueryStateWrapper from '../common/QueryStateWrapper';

const CircleForm: React.FC<{ circle: DiscussionCircle | null; onSave: (data: any) => void; onClose: () => void; }> = ({ circle, onSave, onClose }) => {
    const [name, setName] = useState(circle?.name || '');
    const [description, setDescription] = useState(circle?.description || '');
    const [category, setCategory] = useState<DiscussionCircleCategory>(circle?.category || 'عام');
    const categories: DiscussionCircleCategory[] = ['عام', 'أحياء سكنية', 'كمبوندات'];

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

const CirclesTab: React.FC = () => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);

    const circlesQuery = useQuery({ queryKey: ['circles'], queryFn: getCircles });
    const postsQuery = useQuery({ queryKey: ['posts'], queryFn: getPosts });

    const discussionCircles = circlesQuery.data || [];
    const communityPosts = postsQuery.data || [];

    const [modalData, setModalData] = useState<DiscussionCircle | null>(null);

    const saveCircleMutation = useMutation({
        mutationFn: saveCircle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['circles'] });
            showToast('تم حفظ الدائرة بنجاح!');
            setModalData(null);
        }
    });

    const deleteCircleMutation = useMutation({
        mutationFn: deleteCircle,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['circles'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] }); // Posts might be moved
            showToast('تم حذف الدائرة بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });

    const postCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        for (const post of communityPosts) {
            counts[post.circleId] = (counts[post.circleId] || 0) + 1;
        }
        return counts;
    }, [communityPosts]);

    const categorizedCircles = useMemo(() => {
        const categories: Record<DiscussionCircleCategory, DiscussionCircle[]> = { 'عام': [], 'أحياء سكنية': [], 'كمبوندات': [] };
        discussionCircles.forEach(circle => {
            if (categories[circle.category]) categories[circle.category].push(circle);
        });
        return categories;
    }, [discussionCircles]);
    
    const confirmDeleteCircle = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الدائرة؟ سيتم نقل منشوراتها إلى "نقاش عام".')) {
            deleteCircleMutation.mutate(id);
        }
    };
    
    return (
        <QueryStateWrapper queries={[circlesQuery, postsQuery]}>
            <div className="animate-fade-in space-y-8">
                <div className="flex justify-end">
                    <button onClick={() => setModalData({} as DiscussionCircle)} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                        <PlusIcon className="w-5 h-5"/> إضافة دائرة
                    </button>
                </div>
                {(Object.keys(categorizedCircles) as DiscussionCircleCategory[]).map(category => (
                    categorizedCircles[category].length > 0 && (
                        <div key={category}>
                            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 border-r-4 border-cyan-500 pr-4">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categorizedCircles[category].map(circle => (
                                    <div key={circle.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg group relative">
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">{circle.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{circle.description}</p>
                                        <p className="text-xs font-semibold text-cyan-500 mt-2">{postCounts[circle.id] || 0} منشور</p>
                                        <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setModalData(circle)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500"><PencilSquareIcon className="w-4 h-4" /></button>
                                            <button onClick={() => confirmDeleteCircle(circle.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
                <Modal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.id ? 'تعديل دائرة النقاش' : 'إضافة دائرة نقاش'}>
                    <CircleForm
                        circle={modalData}
                        onSave={(data) => saveCircleMutation.mutate(data)}
                        onClose={() => setModalData(null)}
                    />
                </Modal>
            </div>
        </QueryStateWrapper>
    );
};

export default CirclesTab;
