import React, { useState, useMemo, useEffect } from 'react';
import type { LostAndFoundItem, LostFoundStatus } from '../../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLostAndFoundItems, saveLostAndFoundItem, deleteLostAndFoundItem } from '../../api/communityApi';
import { useStore } from '../../store';
import KpiCard from '../common/KpiCard';
import Modal from '../common/Modal';
import TabButton from '../common/TabButton';
import EmptyState from '../common/EmptyState';
import ImageUploader from '../common/ImageUploader';
import { ArchiveBoxIcon, PlusIcon, PencilSquareIcon, TrashIcon, CheckCircleIcon } from '../common/Icons';
import StatusBadge from '../common/StatusBadge';
import QueryStateWrapper from '../common/QueryStateWrapper';

const LostFoundForm: React.FC<{
    item: LostAndFoundItem | null;
    onSave: (data: Omit<LostAndFoundItem, 'id' | 'moderationStatus'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        itemName: '', description: '', location: '', date: '', reporterName: '', reporterContact: '', status: 'lost' as LostFoundStatus
    });
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (item) {
            setFormData({
                itemName: item.itemName, description: item.description, location: item.location, 
                date: item.date, reporterName: item.reporterName, reporterContact: item.reporterContact, status: item.status
            });
            setImages(item.imageUrl ? [item.imageUrl] : []);
        } else {
             setFormData({
                itemName: '', description: '', location: '', date: new Date().toISOString().split('T')[0], reporterName: '', reporterContact: '', status: 'lost' as LostFoundStatus
            });
            setImages([]);
        }
    }, [item]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: item?.id, ...formData, imageUrl: images[0] });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">اسم العنصر</label><input type="text" name="itemName" value={formData.itemName} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
                <div><label className="block text-sm font-medium mb-1">الحالة</label><select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"><option value="lost">مفقود</option><option value="found">تم العثور عليه</option><option value="returned">تم التسليم</option></select></div>
            </div>
            <div><label className="block text-sm font-medium mb-1">الوصف</label><textarea name="description" value={formData.description} onChange={handleChange} required rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">مكان الفقد/العثور</label><input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
                <div><label className="block text-sm font-medium mb-1">التاريخ</label><input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">اسم المُبلِّغ</label><input type="text" name="reporterName" value={formData.reporterName} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
                <div><label className="block text-sm font-medium mb-1">بيانات التواصل</label><input type="text" name="reporterContact" value={formData.reporterContact} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
            </div>
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة العنصر (اختياري)"/>
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button></div>
        </form>
    );
};

const LostAndFoundTab: React.FC = () => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);
    
    const itemsQuery = useQuery({ queryKey: ['lostAndFound'], queryFn: getLostAndFoundItems });
    const lostAndFoundItems = itemsQuery.data || [];

    const [activeSubTab, setActiveSubTab] = useState<LostFoundStatus>('lost');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LostAndFoundItem | null>(null);

    const saveItemMutation = useMutation({
        mutationFn: saveLostAndFoundItem,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
            setIsModalOpen(false);
            showToast(editingItem ? 'تم تعديل العنصر بنجاح!' : 'تم إضافة العنصر، وهو الآن بانتظار المراجعة.');
        },
        onError: (error: Error) => showToast(error.message, 'error')
    });

    const deleteItemMutation = useMutation({
        mutationFn: deleteLostAndFoundItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
            showToast('تم حذف العنصر!');
        }
    });

    const approvedItems = useMemo(() => lostAndFoundItems.filter(item => item.moderationStatus === 'approved'), [lostAndFoundItems]);

    const filteredItems = useMemo(() => approvedItems.filter(item => item.status === activeSubTab), [approvedItems, activeSubTab]);
    
    const stats = useMemo(() => ({ 
        lost: approvedItems.filter(i => i.status === 'lost').length, 
        found: approvedItems.filter(i => i.status === 'found').length, 
        returned: approvedItems.filter(i => i.status === 'returned').length 
    }), [approvedItems]);

    const handleAddItem = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEditItem = (item: LostAndFoundItem) => { setEditingItem(item); setIsModalOpen(true); };
    
    const handleSaveAndClose = (itemData: Omit<LostAndFoundItem, 'id' | 'moderationStatus'> & { id?: number }) => { 
        saveItemMutation.mutate(itemData);
    };
    
    const confirmDelete = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) { deleteItemMutation.mutate(id); } };
    
    const markAsReturned = (item: LostAndFoundItem) => { 
        // We need to keep moderation status as is, just update status to returned
        const { id, moderationStatus, ...rest } = item;
        saveItemMutation.mutate({ id, ...rest, status: 'returned' });
        showToast(`تم تحديث حالة "${item.itemName}" إلى "تم التسليم".`); 
    };

    const ItemCard: React.FC<{ item: LostAndFoundItem }> = ({ item }) => (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-lg overflow-hidden flex flex-col">
            {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />}
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold">{item.itemName}</h3><StatusBadge status={item.status} /></div>
                <p className="text-sm text-gray-500 mb-2">في: {item.location} - بتاريخ: {item.date}</p>
                <p className="text-sm flex-grow">{item.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t mt-2">
                    <p><strong>المُبلِّغ:</strong> {item.reporterName}</p>
                    <p><strong>للتواصل:</strong> {item.reporterContact}</p>
                </div>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center gap-2">
                {item.status !== 'returned' && <button onClick={() => markAsReturned(item)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-green-100 text-green-700 p-2 rounded-md"><CheckCircleIcon className="w-5 h-5"/> تم التسليم</button>}
                <button onClick={() => handleEditItem(item)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-2 rounded-md"><PencilSquareIcon className="w-5 h-5"/> تعديل</button>
                <button onClick={() => confirmDelete(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
            </div>
        </div>
    );

    return (
        <QueryStateWrapper queries={itemsQuery}>
            <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><KpiCard title="عناصر مفقودة" value={stats.lost.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-red-400" />} /><KpiCard title="تم العثور عليها" value={stats.found.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-yellow-400" />} /><KpiCard title="تم تسليمها" value={stats.returned.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-green-400" />} /></div>
                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2"><TabButton active={activeSubTab === 'lost'} onClick={() => setActiveSubTab('lost')}>مفقود ({stats.lost})</TabButton><TabButton active={activeSubTab === 'found'} onClick={() => setActiveSubTab('found')}>تم العثور عليه ({stats.found})</TabButton><TabButton active={activeSubTab === 'returned'} onClick={() => setActiveSubTab('returned')}>تم التسليم</TabButton></div>
                    <button onClick={handleAddItem} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5" /> إضافة عنصر</button>
                </div>
                 {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => <ItemCard key={item.id} item={item} />)}
                    </div>
                ) : <EmptyState icon={<ArchiveBoxIcon className="w-16 h-16 text-slate-400" />} title="لا توجد عناصر" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد'}>
                    <LostFoundForm item={editingItem} onSave={handleSaveAndClose} onClose={() => setIsModalOpen(false)} />
                </Modal>
            </div>
        </QueryStateWrapper>
    );
};

export default LostAndFoundTab;