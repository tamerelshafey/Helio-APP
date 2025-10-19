import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, TagIcon,
    KeyIcon, CheckCircleIcon, XCircleIcon,
    MagnifyingGlassIcon
} from '../components/common/Icons';
import type { Offer, OfferCode, AppUser, Service } from '../types';
import { useOffersContext } from '../context/OffersContext';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useServicesContext } from '../context/ServicesContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { ContentStatusBadge } from '../components/common/StatusBadge';
import { InputField, TextareaField } from '../components/common/FormControls';
import Pagination from '../components/common/Pagination';

const ITEMS_PER_PAGE = 10;

const OfferForm: React.FC<{
    offer: Offer | null;
    onSave: (data: Omit<Offer, 'id'> & { id?: number }) => void;
    onClose: () => void;
    services: Service[];
    serviceProviders: AppUser[];
}> = ({ offer, onSave, onClose, services, serviceProviders }) => {
    const [formData, setFormData] = useState({
        title: offer?.title || '',
        description: offer?.description || '',
        serviceId: offer?.serviceId || 0,
        providerId: offer?.providerId || 0,
        startDate: offer?.startDate || new Date().toISOString().split('T')[0],
        endDate: offer?.endDate || new Date().toISOString().split('T')[0],
        terms: offer?.terms || ''
    });
    const [images, setImages] = useState(offer?.imageUrl ? [offer.imageUrl] : []);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: offer?.id,
            ...formData,
            serviceId: Number(formData.serviceId),
            providerId: Number(formData.providerId) || undefined,
            imageUrl: images[0] || 'https://picsum.photos/600/400?random=80'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="عنوان العرض" value={formData.title} onChange={handleChange} required />
            <TextareaField name="description" label="وصف العرض" value={formData.description} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="startDate" type="date" label="تاريخ البدء" value={formData.startDate} onChange={handleChange} required />
                <InputField name="endDate" type="date" label="تاريخ الانتهاء" value={formData.endDate} onChange={handleChange} required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">الخدمة المرتبطة</label>
                <select name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    <option value={0} disabled>-- اختر خدمة --</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">مقدم الخدمة (صاحب العرض)</label>
                <select name="providerId" value={formData.providerId} onChange={handleChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    <option value={0}>-- لا يوجد --</option>
                    {serviceProviders.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <TextareaField name="terms" label="الشروط والأحكام" value={formData.terms} onChange={handleChange} required />
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple={false} label="صورة العرض" />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ العرض</button>
            </div>
        </form>
    );
};

const CodesModal: React.FC<{
    offer: Offer | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({ offer, isOpen, onClose }) => {
    const { offerCodes, handleDeleteCode, handleToggleCodeRedemption } = useOffersContext();
    const { users } = useUserManagementContext();
    
    if (!isOpen || !offer) return null;

    const codesForOffer = offerCodes.filter(c => c.offerId === offer.id);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`متابعة أكواد عرض: ${offer.title}`}>
            <div className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md text-sm text-gray-600 dark:text-gray-300">
                    <p>هنا تظهر الأكواد التي طلبها المستخدمون عبر التطبيق. يمكن لكل مستخدم طلب كود واحد فقط لكل عرض.</p>
                </div>
                
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">الأكواد الصادرة ({codesForOffer.length})</h3>

                <div className="max-h-72 overflow-y-auto space-y-2 p-1 border-t border-slate-200 dark:border-slate-700 pt-2">
                    {codesForOffer.length > 0 ? codesForOffer.map(code => (
                        <div key={code.id} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                            <div>
                                <p className="font-mono font-bold text-base">{code.code}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">للمستخدم: {users.find(u=>u.id === code.userId)?.name || 'غير معروف'} | تاريخ الإصدار: {code.issueDate}</p>
                                <p className={`text-xs font-semibold ${code.isRedeemed ? 'text-red-500' : 'text-green-500'}`}>{code.isRedeemed ? 'تم الاستخدام' : 'لم يستخدم'}</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => handleToggleCodeRedemption(code.id)} title={code.isRedeemed ? 'إلغاء الاستخدام' : 'تحديد كـ "مستخدم"'} className={`p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 ${code.isRedeemed ? 'text-orange-500' : 'text-green-500'}`}>
                                    {code.isRedeemed ? <XCircleIcon className="w-5 h-5"/> : <CheckCircleIcon className="w-5 h-5"/>}
                                </button>
                                <button onClick={() => handleDeleteCode(code.id)} className="p-2 text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8">
                             <p className="text-sm text-gray-500">لم يطلب أي مستخدم كوداً لهذا العرض بعد.</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};


const OffersPage: React.FC = () => {
    const navigate = useNavigate();
    const { offers, handleSaveOffer, handleDeleteOffer } = useOffersContext();
    const { services } = useServicesContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول المحتوى', 'مدير عام', 'مسؤول ادارة الخدمات']);

    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const [isCodesModalOpen, setCodesModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const serviceProviders = useMemo(() => users.filter(u => u.accountType === 'service_provider'), [users]);
    const offersWithDetails = useMemo(() => offers.map(offer => ({
        ...offer,
        providerName: serviceProviders.find(p => p.id === offer.providerId)?.name || '--',
        serviceName: services.find(s => s.id === offer.serviceId)?.name || 'خدمة محذوفة'
    })), [offers, serviceProviders, services]);

     const filteredOffers = useMemo(() => {
        if (!searchTerm) return offersWithDetails;
        return offersWithDetails.filter(offer => 
            offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [offersWithDetails, searchTerm]);

    const paginatedOffers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredOffers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredOffers, currentPage]);

    const totalPages = Math.ceil(filteredOffers.length / ITEMS_PER_PAGE);

    const handleAddClick = () => { setSelectedOffer(null); setFormModalOpen(true); };
    const handleEditClick = (offer: Offer) => { setSelectedOffer(offer); setFormModalOpen(true); };
    const handleViewCodesClick = (offer: Offer) => { setSelectedOffer(offer); setCodesModalOpen(true); };

    const handleSaveAndClose = (data: Omit<Offer, 'id'> & { id?: number }) => {
        handleSaveOffer(data);
        setFormModalOpen(false);
        showToast(data.id ? 'تم تعديل العرض بنجاح!' : 'تم إضافة العرض بنجاح!');
    };
    
    const confirmDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العرض وجميع أكواده؟')) {
            handleDeleteOffer(id);
            showToast('تم حذف العرض بنجاح!');
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6"><ArrowLeftIcon className="w-5 h-5" /><span>العودة</span></button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><TagIcon className="w-8 h-8 text-rose-400"/>إدارة العروض</h1>
                    {canManage && <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5" /><span>إضافة عرض</span></button>}
                </div>

                <div className="mb-4">
                     <div className="relative">
                        <span className="absolute inset-y-0 right-3 flex items-center pl-3"><MagnifyingGlassIcon className="w-5 h-5 text-gray-400" /></span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            placeholder="ابحث عن عرض، خدمة، أو مقدم خدمة..."
                            className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    {filteredOffers.length > 0 ? (
                        <>
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">العرض</th>
                                    <th scope="col" className="px-6 py-3">مقدم الخدمة (صاحب العرض)</th>
                                    <th scope="col" className="px-6 py-3">الحالة</th>
                                    <th scope="col" className="px-6 py-3">فترة الصلاحية</th>
                                    {canManage && <th scope="col" className="px-6 py-3">إجراءات</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedOffers.map(offer => (
                                    <tr key={offer.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900 dark:text-white">{offer.title}</p>
                                            <p className="text-xs text-gray-500">للخدمة: {offer.serviceName}</p>
                                        </td>
                                        <td className="px-6 py-4">{offer.providerName}</td>
                                        <td className="px-6 py-4"><ContentStatusBadge startDate={offer.startDate} endDate={offer.endDate} /></td>
                                        <td className="px-6 py-4 text-xs font-mono">{offer.startDate} <br/> {offer.endDate}</td>
                                        {canManage && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleViewCodesClick(offer)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900/50 rounded-md" title="متابعة الأكواد"><KeyIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleEditClick(offer)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => confirmDelete(offer.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    ) : (
                       <EmptyState icon={<TagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد عروض حالياً" message="أضف عرضاً جديداً لجذب المزيد من المستخدمين.">
                          {canManage && <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5" /><span>إضافة عرض جديد</span></button>}
                       </EmptyState>
                    )}
                </div>
            </div>
            
            <Modal isOpen={isFormModalOpen} onClose={() => setFormModalOpen(false)} title={selectedOffer ? 'تعديل العرض' : 'إضافة عرض جديد'}>
                <OfferForm offer={selectedOffer} onSave={handleSaveAndClose} onClose={() => setFormModalOpen(false)} services={services} serviceProviders={serviceProviders} />
            </Modal>

            <CodesModal offer={selectedOffer} isOpen={isCodesModalOpen} onClose={() => { setCodesModalOpen(false); setSelectedOffer(null); }} />

        </div>
    );
};

export default OffersPage;