import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon,
    ArchiveBoxIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon,
    CheckCircleIcon,
    PhoneIcon,
    MapPinIcon
} from '../components/common/Icons';
import type { LostAndFoundItem, LostFoundStatus } from '../types';
import { useAppContext } from '../context/AppContext';
import { useUIContext } from '../context/UIContext';
import KpiCard from '../components/common/KpiCard';
import TabButton from '../components/common/TabButton';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';

const StatusBadge: React.FC<{ status: LostFoundStatus }> = ({ status }) => {
    const statusMap = {
        lost: { text: 'مفقود', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
        found: { text: 'تم العثور عليه', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        returned: { text: 'تم التسليم', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    const { text, classes } = statusMap[status];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

const ItemForm: React.FC<{
    item: Omit<LostAndFoundItem, 'id'> & { id?: number } | null;
    onSave: (item: Omit<LostAndFoundItem, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ item, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        itemName: item?.itemName || '',
        description: item?.description || '',
        location: item?.location || '',
        reporterName: item?.reporterName || '',
        reporterContact: item?.reporterContact || '',
        date: item?.date || new Date().toISOString().split('T')[0],
        status: item?.status || 'lost',
    });
    const [images, setImages] = useState<string[]>(item?.imageUrl ? [item.imageUrl] : []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, status: formData.status as LostFoundStatus, imageUrl: images[0] });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="itemName" label="اسم العنصر" value={formData.itemName} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الحالة</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                        <option value="lost">مفقود</option>
                        <option value="found">تم العثور عليه</option>
                        <option value="returned">تم التسليم</option>
                    </select>
                </div>
            </div>
            <TextareaField name="description" label="الوصف" value={formData.description} onChange={handleChange} required />
            <InputField name="location" label="المكان المفقود فيه / الذي تم العثور عليه فيه" value={formData.location} onChange={handleChange} required />
            <InputField name="date" label="التاريخ" type="date" value={formData.date} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="reporterName" label="اسم المبلغ" value={formData.reporterName} onChange={handleChange} required />
                <InputField name="reporterContact" label="رقم تواصل المبلغ" value={formData.reporterContact} onChange={handleChange} required />
            </div>
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة العنصر (اختياري)" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const InputField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean }> = ({ name, label, value, onChange, type = 'text', required }) => (
    <div><label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label><input type={type} id={name} name={name} value={value} onChange={onChange} required={required} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
);
const TextareaField: React.FC<{ name: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean }> = ({ name, label, value, onChange, required }) => (
    <div><label htmlFor={name} className="block text-sm font-medium mb-1">{label}</label><textarea id={name} name={name} value={value} onChange={onChange} required={required} rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"></textarea></div>
);


const LostAndFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { lostAndFoundItems, handleSaveLostAndFoundItem, handleDeleteLostAndFoundItem } = useAppContext();
    const { showToast } = useUIContext();

    const [activeTab, setActiveTab] = useState<LostFoundStatus>('lost');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LostAndFoundItem | null>(null);

    const filteredItems = useMemo(() => {
        return lostAndFoundItems.filter(item => item.status === activeTab);
    }, [lostAndFoundItems, activeTab]);

    const stats = useMemo(() => ({
        lost: lostAndFoundItems.filter(i => i.status === 'lost').length,
        found: lostAndFoundItems.filter(i => i.status === 'found').length,
        returned: lostAndFoundItems.filter(i => i.status === 'returned').length,
    }), [lostAndFoundItems]);

    const handleAddItem = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEditItem = (item: LostAndFoundItem) => { setEditingItem(item); setIsModalOpen(true); };
    const handleSaveAndClose = (item: Omit<LostAndFoundItem, 'id'> & { id?: number }) => {
        handleSaveLostAndFoundItem(item);
        setIsModalOpen(false);
        showToast(item.id ? 'تم تعديل العنصر بنجاح!' : 'تم إضافة العنصر بنجاح!');
    };
    const confirmDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) { handleDeleteLostAndFoundItem(id); showToast('تم حذف العنصر!'); }
    };
    const markAsReturned = (item: LostAndFoundItem) => {
        handleSaveLostAndFoundItem({ ...item, status: 'returned' });
        showToast(`تم تحديث حالة "${item.itemName}" إلى "تم التسليم".`);
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6"><ArrowLeftIcon className="w-5 h-5" /><span>العودة</span></button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><ArchiveBoxIcon className="w-8 h-8"/>إدارة المفقودات</h1>
                    <button onClick={handleAddItem} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"><PlusIcon className="w-5 h-5" /><span>إضافة عنصر</span></button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KpiCard title="عناصر مفقودة" value={stats.lost.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-red-400" />} />
                    <KpiCard title="عناصر تم العثور عليها" value={stats.found.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-yellow-400" />} />
                    <KpiCard title="عناصر تم تسليمها" value={stats.returned.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-green-400" />} />
                </div>

                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'lost'} onClick={() => setActiveTab('lost')}>مفقود ({stats.lost})</TabButton>
                    <TabButton active={activeTab === 'found'} onClick={() => setActiveTab('found')}>تم العثور عليه ({stats.found})</TabButton>
                    <TabButton active={activeTab === 'returned'} onClick={() => setActiveTab('returned')}>تم التسليم</TabButton>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <div key={item.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-lg overflow-hidden flex flex-col">
                                {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} className="w-full h-48 object-cover" />}
                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.itemName}</h3><StatusBadge status={item.status} /></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">{item.description}</p>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <p className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/> <strong>المكان:</strong> {item.location} ({item.date})</p>
                                        <p><strong>المبلغ:</strong> {item.reporterName}</p>
                                        <div className="flex items-center gap-1"><PhoneIcon className="w-3 h-3"/><a href={`tel:${item.reporterContact}`} className="hover:underline">{item.reporterContact}</a></div>
                                    </div>
                                </div>
                                <div className="p-2 bg-slate-100 dark:bg-slate-900/50 flex items-center justify-center gap-2">
                                    {item.status !== 'returned' && <button onClick={() => markAsReturned(item)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900 p-2 rounded-md"><CheckCircleIcon className="w-5 h-5"/> تم التسليم</button>}
                                    <button onClick={() => handleEditItem(item)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900 p-2 rounded-md"><PencilSquareIcon className="w-5 h-5"/> تعديل</button>
                                    <button onClick={() => confirmDelete(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={<ArchiveBoxIcon className="w-16 h-16 text-slate-400" />} title="لا توجد عناصر" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>
                )}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد'}>
                <ItemForm item={editingItem} onSave={handleSaveAndClose} onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default LostAndFoundPage;