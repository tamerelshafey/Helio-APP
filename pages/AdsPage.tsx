import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, NewspaperIcon, EyeIcon } from '../components/common/Icons';
import type { Ad, Service, Category, Property, AdPlacement } from '../types';
import { useContentContext } from '../context/ContentContext';
import { useServicesContext } from '../context/ServicesContext';
import { usePropertiesContext } from '../context/PropertiesContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { ContentStatusBadge } from '../components/common/StatusBadge';
import { InputField, TextareaField } from '../components/common/FormControls';

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

const ReferralSection: React.FC<{
    referralType: 'none' | 'service' | 'property';
    onTypeChange: (type: 'none' | 'service' | 'property') => void;
    referralId?: number;
    onIdChange: (id?: number) => void;
    services: Service[];
    categories: Category[];
    properties: Property[];
}> = ({ referralType, onTypeChange, referralId, onIdChange, services, categories, properties }) => {

    const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
    const [selectedSubCategory, setSelectedSubCategory] = useState<number | undefined>();

    useEffect(() => {
        if (referralType === 'service' && referralId) {
            const service = services.find(s => s.id === referralId);
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
        }
    }, [referralType, referralId, services, categories]);


    const availableSubCategories = useMemo(() => {
        if (!selectedCategory) return [];
        return categories.find(c => c.id === selectedCategory)?.subCategories || [];
    }, [selectedCategory, categories]);

    const availableServices = useMemo(() => {
        if (!selectedSubCategory) return [];
        return services.filter(s => s.subCategoryId === selectedSubCategory);
    }, [selectedSubCategory, services]);

    return (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">إحالة الإعلان (اختياري)</label>
            <div className="flex gap-4 mb-4">
                {['none', 'service', 'property'].map(type => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                        <input type="radio" name="referralType" checked={referralType === type} onChange={() => onTypeChange(type as any)} className="form-radio text-cyan-500 focus:ring-cyan-500" />
                        {type === 'none' && 'لا يوجد (عرض منبثق)'}
                        {type === 'service' && 'إحالة إلى خدمة'}
                        {type === 'property' && 'إحالة إلى عقار'}
                    </label>
                ))}
            </div>

            {referralType === 'service' && (
                <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <select value={selectedCategory || ''} onChange={e => { setSelectedCategory(Number(e.target.value)); setSelectedSubCategory(undefined); onIdChange(undefined); }} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الفئة الرئيسية --</option>{categories.filter(c => c.name !== "المدينة والجهاز").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    <select value={selectedSubCategory || ''} onChange={e => { setSelectedSubCategory(Number(e.target.value)); onIdChange(undefined); }} disabled={!selectedCategory} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الفئة الفرعية --</option>{availableSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}</select>
                    <select value={referralId || ''} onChange={e => onIdChange(Number(e.target.value))} disabled={!selectedSubCategory} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر الخدمة --</option>{availableServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
                </div>
            )}
            
            {referralType === 'property' && (
                 <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <select value={referralId || ''} onChange={e => onIdChange(Number(e.target.value))} className="w-full bg-white dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"><option value="">-- اختر العقار للإحالة إليه --</option>{properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
                </div>
            )}
        </div>
    );
}

const AdForm: React.FC<{
    onSave: (ad: Omit<Ad, 'id'> & { id?: number }) => void;
    onClose: () => void;
    ad: Omit<Ad, 'id'> & { id?: number } | null;
    services: Service[];
    categories: Category[];
    properties: Property[];
}> = ({ onSave, onClose, ad, services, categories, properties }) => {
    
    const [formData, setFormData] = useState({
        title: '', content: '', externalUrl: '', startDate: '', endDate: ''
    });
    const [placements, setPlacements] = useState<AdPlacement[]>(['الرئيسية']);
    const [images, setImages] = useState<string[]>([]);
    const [referralType, setReferralType] = useState<'none' | 'service' | 'property'>('none');
    const [referralId, setReferralId] = useState<number | undefined>(undefined);

    const allPlacements: AdPlacement[] = ['الرئيسية', 'الخدمات', 'العقارات', 'الأخبار', 'المجتمع'];

    useEffect(() => {
        if (ad) {
            setFormData({
                title: ad.title || '', content: ad.content || '', externalUrl: ad.externalUrl || '',
                startDate: ad.startDate || '', endDate: ad.endDate || ''
            });
            setPlacements(ad.placements || ['الرئيسية']);
            setImages(ad.imageUrl ? [ad.imageUrl] : []);
            setReferralType(ad.referralType || 'none');
            setReferralId(ad.referralId);
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ title: '', content: '', externalUrl: '', startDate: today, endDate: today });
            setPlacements(['الرئيسية']);
            setImages([]);
            setReferralType('none');
            setReferralId(undefined);
        }
    }, [ad]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handlePlacementChange = (placement: AdPlacement) => {
        setPlacements(prev => {
            const newPlacements = prev.includes(placement)
                ? prev.filter(p => p !== placement)
                : [...prev, placement];
            // Ensure at least one is selected
            if (newPlacements.length === 0) {
                return prev; // Or show a toast. Forcing one selection is better UX.
            }
            return newPlacements;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            id: ad?.id, 
            ...formData,
            placements,
            imageUrl: images.length > 0 ? images[0] : undefined, 
            referralType: referralType === 'none' ? undefined : referralType,
            referralId: referralType !== 'none' ? referralId : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="العنوان" value={formData.title} onChange={handleChange} required />
            <TextareaField name="content" label="المحتوى" value={formData.content} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="startDate" type="date" label="تاريخ البدء" value={formData.startDate} onChange={handleChange} required />
                <InputField name="endDate" type="date" label="تاريخ الانتهاء" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">أماكن عرض الإعلان</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                    {allPlacements.map(placement => (
                        <label key={placement} className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                            <input
                                type="checkbox"
                                checked={placements.includes(placement)}
                                onChange={() => handlePlacementChange(placement)}
                                className="form-checkbox h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                            />
                            <span className="text-sm">{placement}</span>
                        </label>
                    ))}
                </div>
            </div>
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة الإعلان (اختياري)" />
            <InputField name="externalUrl" type="url" label="رابط خارجي (اختياري)" value={formData.externalUrl} onChange={handleChange} />

            <ReferralSection
                referralType={referralType}
                onTypeChange={setReferralType}
                referralId={referralId}
                onIdChange={setReferralId}
                services={services}
                categories={categories}
                properties={properties}
            />

            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ الإعلان</button></div>
        </form>
    );
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
                                    <th scope="col" className="px-6 py-3">مكان العرض</th>
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
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {ad.placements.map(p => (
                                                    <span key={p} className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300">{p}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><ContentStatusBadge startDate={ad.startDate} endDate={ad.endDate} /></td>
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