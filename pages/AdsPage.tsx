import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, NewspaperIcon, EyeIcon } from '../components/common/Icons';
import type { Ad, Service, Category, Property } from '../types';
import { useContentContext } from '../context/ContentContext';
import { useServicesContext } from '../context/ServicesContext';
import { usePropertiesContext } from '../context/PropertiesContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';

const AdDetailsModal: React.FC<{ ad: Ad | null; isOpen: boolean; onClose: () => void }> = ({ ad, isOpen, onClose }) => {
    if (!ad) return null;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ad.title}>
            <div className="space-y-4">
                {ad.imageUrl && <img src={ad.imageUrl} alt={ad.title} className="w-full h-auto max-h-64 object-contain rounded-lg" />}
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{ad.content}</p>
                {ad.externalUrl && (
                    <a href={ad.externalUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                        زيارة الرابط
                    </a>
                )}
            </div>
        </Modal>
    );
};

const AdForm: React.FC<{
    onSave: (ad: Omit<Ad, 'id'> & { id?: number }) => void;
    onClose: () => void;
    ad: Omit<Ad, 'id'> & { id?: number } | null;
    services: Service[];
    categories: Category[];
    properties: Property[];
}> = ({ onSave, onClose, ad, services, categories, properties }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [externalUrl, setExternalUrl] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Referral state
    const [referralType, setReferralType] = useState<'none' | 'service' | 'property'>('none');
    const [referralId, setReferralId] = useState<number | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (ad) {
            setTitle(ad.title || '');
            setContent(ad.content || '');
            setImages(ad.imageUrl ? [ad.imageUrl] : []);
            setExternalUrl(ad.externalUrl || '');
            setStartDate(ad.startDate || '');
            setEndDate(ad.endDate || '');

            const refType = ad.referralType || 'none';
            setReferralType(refType);
            setReferralId(ad.referralId);

            if (refType === 'service' && ad.referralId) {
                const service = services.find(s => s.id === ad.referralId);
                if (service) {
                    for (const category of categories) {
                        const subCategory = category.subCategories.find(sc => sc.id === service.subCategoryId);
                        if (subCategory) {
                            setSelectedCategory(category.id);
                            setSelectedSubCategory(subCategory.id);
                            break;
                        }
                    }
                }
            } else {
                setSelectedCategory(undefined);
                setSelectedSubCategory(undefined);
            }

        } else {
            setTitle(''); setContent(''); setImages([]); setExternalUrl('');
            setReferralType('none'); setReferralId(undefined);
            setSelectedCategory(undefined); setSelectedSubCategory(undefined);
            const today = new Date().toISOString().split('T')[0];
            setStartDate(today); setEndDate(today);
        }
    }, [ad, services, categories]);

    const handleReferralTypeChange = (type: 'none' | 'service' | 'property') => {
        setReferralType(type);
        setReferralId(undefined);
        setSelectedCategory(undefined);
        setSelectedSubCategory(undefined);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: ad?.id, 
            title, content, 
            imageUrl: images.length > 0 ? images[0] : undefined, 
            externalUrl, 
            startDate, endDate,
            referralType: referralType === 'none' ? undefined : referralType,
            referralId: referralType !== 'none' ? referralId : undefined,
        });
        onClose();
    };

    const availableSubCategories = useMemo(() => {
        if (!selectedCategory) return [];
        return categories.find(c => c.id === selectedCategory)?.subCategories || [];
    }, [selectedCategory, categories]);

    const availableServices = useMemo(() => {
        if (!selectedSubCategory) return [];
        return services.filter(s => s.subCategoryId === selectedSubCategory);
    }, [selectedSubCategory, services]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">العنوان</label><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"/></div>
            <div><label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المحتوى</label><textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"></textarea></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ البدء</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الانتهاء</label><input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div></div>
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة الإعلان (اختياري)" />
            <div><label htmlFor="externalUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رابط خارجي (اختياري)</label><input type="url" id="externalUrl" value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"/></div>

            {/* Referral Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">إحالة الإعلان (اختياري)</label>
                <div className="flex gap-4 mb-4">
                    {['none', 'service', 'property'].map(type => (
                        <label key={type} className="flex items-center gap-2 text-sm">
                            <input type="radio" name="referralType" checked={referralType === type} onChange={() => handleReferralTypeChange(type as any)} className="form-radio text-cyan-500 focus:ring-cyan-500" />
                            {type === 'none' && 'لا يوجد (عرض منبثق)'}
                            {type === 'service' && 'إحالة إلى خدمة'}
                            {type === 'property' && 'إحالة إلى عقار'}
                        </label>
                    ))}
                </div>

                {referralType === 'service' && (
                    <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <select value={selectedCategory || ''} onChange={e => { setSelectedCategory(Number(e.target.value)); setSelectedSubCategory(undefined); setReferralId(undefined); }} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الفئة الرئيسية --</option>{categories.filter(c => c.name !== "المدينة والجهاز").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                        <select value={selectedSubCategory || ''} onChange={e => { setSelectedSubCategory(Number(e.target.value)); setReferralId(undefined); }} disabled={!selectedCategory} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الفئة الفرعية --</option>{availableSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}</select>
                        <select value={referralId || ''} onChange={e => setReferralId(Number(e.target.value))} disabled={!selectedSubCategory} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الخدمة --</option>{availableServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                    </div>
                )}
                
                {referralType === 'property' && (
                     <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <select value={referralId || ''} onChange={e => setReferralId(Number(e.target.value))} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر العقار للإحالة إليه --</option>{properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ الإعلان</button></div>
        </form>
    );
};

const StatusBadge: React.FC<{ startDate: string, endDate: string }> = ({ startDate, endDate }) => {
    const today = new Date(); today.setHours(0,0,0,0);
    const start = new Date(startDate); const end = new Date(endDate);
    if (today < start) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">مجدول</span>;
    if (today >= start && today <= end) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">نشط</span>;
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">منتهي</span>;
};

const AdsPage: React.FC = () => {
    const navigate = useNavigate();
    const { ads, handleSaveAd, handleDeleteAd } = useContentContext();
    const { services, categories } = useServicesContext();
    const { properties } = usePropertiesContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول المحتوى']);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<Ad | null>(null);
    const [viewingAd, setViewingAd] = useState<Ad | null>(null);

    const handleAddClick = () => { setEditingAd(null); setIsModalOpen(true); };
    const handleEditClick = (ad: Ad) => { setEditingAd(ad); setIsModalOpen(true); };
    const handleSaveAndClose = (adData: Omit<Ad, 'id'> & { id?: number }) => {
        const isNew = !adData.id;
        handleSaveAd(adData);
        setIsModalOpen(false);
        showToast(isNew ? 'تم إضافة الإعلان بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    };
    const confirmDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) { handleDeleteAd(id); showToast('تم حذف الإعلان بنجاح!'); }
    };
    
    const getReferralInfo = (ad: Ad): string => {
        if (ad.referralType === 'service' && ad.referralId) {
            const service = services.find(s => s.id === ad.referralId);
            return `خدمة: ${service?.name || 'غير معروف'}`;
        }
        if (ad.referralType === 'property' && ad.referralId) {
            const property = properties.find(p => p.id === ad.referralId);
            return `عقار: ${property?.title || 'غير معروف'}`;
        }
        return 'عرض منبثق';
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6"><ArrowLeftIcon className="w-5 h-5" /><span>العودة</span></button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><NewspaperIcon className="w-8 h-8 text-orange-400"/>إدارة الإعلانات</h1>
                    {canManage && <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"><PlusIcon className="w-5 h-5" /><span>إضافة إعلان</span></button>}
                </div>
                
                <div className="overflow-x-auto">
                    {ads.length > 0 ? (
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">الإعلان</th>
                                    <th scope="col" className="px-6 py-3">الحالة</th>
                                    <th scope="col" className="px-6 py-3">فترة الصلاحية</th>
                                    <th scope="col" className="px-6 py-3">الإحالة</th>
                                    {canManage && <th scope="col" className="px-6 py-3">إجراءات</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map(ad => (
                                    <tr key={ad.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 max-w-sm"><div className="font-semibold text-gray-900 dark:text-white truncate">{ad.title}</div><div className="text-xs text-gray-500 dark:text-gray-400 truncate">{ad.content}</div></td>
                                        <td className="px-6 py-4"><StatusBadge startDate={ad.startDate} endDate={ad.endDate} /></td>
                                        <td className="px-6 py-4 text-xs font-mono">{ad.startDate} <br/> {ad.endDate}</td>
                                        <td className="px-6 py-4 text-xs">{getReferralInfo(ad)}</td>
                                        {canManage && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setViewingAd(ad)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900/50 rounded-md" title="عرض الإعلان"><EyeIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleEditClick(ad)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => confirmDelete(ad.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                       <EmptyState icon={<NewspaperIcon className="w-16 h-16 text-slate-400" />} title="لا توجد إعلانات حالياً" message="يمكنك إضافة إعلان جديد للوصول إلى سكان المدينة.">
                          {canManage && <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"><PlusIcon className="w-5 h-5" /><span>إضافة إعلان جديد</span></button>}
                       </EmptyState>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}>
                <AdForm onSave={handleSaveAndClose} onClose={() => setIsModalOpen(false)} ad={editingAd} services={services} categories={categories} properties={properties} />
            </Modal>
            <AdDetailsModal ad={viewingAd} isOpen={!!viewingAd} onClose={() => setViewingAd(null)} />
        </div>
    );
};

export default AdsPage;