import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, StarIcon, StarIconOutline, EyeIcon, PencilSquareIcon, TrashIcon, WrenchScrewdriverIcon } from '../components/common/Icons';
import type { Service, Category, AppUser } from '../types';
import { useServicesContext } from '../context/ServicesContext';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import Rating from '../components/DashboardView';
import { InputField, TextareaField } from '../components/common/FormControls';

const ServiceForm: React.FC<{
    onSave: (service: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => void;
    onClose: () => void;
    service: Service | null;
    initialSubCategoryId: number;
    categories: Category[];
    serviceProviders: AppUser[];
}> = ({ onSave, onClose, service, initialSubCategoryId, categories, serviceProviders }) => {

    const [formData, setFormData] = useState({
        name: '', address: '', phone: '', phone2: '', whatsapp: '', about: '',
        facebookUrl: '', instagramUrl: '', workingHours: '', providerId: 0
    });
    const [images, setImages] = useState<string[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number>(initialSubCategoryId);

    useEffect(() => {
        let currentSubCategoryId = initialSubCategoryId;
        if (service) {
            setFormData({
                name: service.name,
                address: service.address,
                phone: service.phone,
                phone2: service.phone2 || '',
                whatsapp: service.whatsapp,
                about: service.about,
                facebookUrl: service.facebookUrl || '',
                instagramUrl: service.instagramUrl || '',
                workingHours: service.workingHours || '',
                providerId: service.providerId || 0,
            });
            setImages(service.images);
            currentSubCategoryId = service.subCategoryId;
        } else {
            // Reset form for new service
            setFormData({ name: '', address: '', phone: '', phone2: '', whatsapp: '', about: '', facebookUrl: '', instagramUrl: '', workingHours: '', providerId: 0 });
            setImages([]);
        }
        
        const parentCategory = categories.find(cat => 
            cat.subCategories.some(sub => sub.id === currentSubCategoryId)
        );

        if (parentCategory) {
            setSelectedCategoryId(parentCategory.id);
            setSelectedSubCategoryId(currentSubCategoryId);
        }
    }, [service, initialSubCategoryId, categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCatId = Number(e.target.value);
        setSelectedCategoryId(newCatId);
        const firstSubCategory = categories.find(c => c.id === newCatId)?.subCategories[0];
        setSelectedSubCategoryId(firstSubCategory?.id || 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const serviceData = {
            id: service?.id,
            subCategoryId: selectedSubCategoryId,
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            phone2: formData.phone2,
            whatsapp: formData.whatsapp,
            about: formData.about,
            facebookUrl: formData.facebookUrl,
            instagramUrl: formData.instagramUrl,
            workingHours: formData.workingHours,
            providerId: formData.providerId ? Number(formData.providerId) : undefined,
            images,
        };
        onSave(serviceData);
    };
    
    const availableSubCategories = useMemo(() => {
        if (!selectedCategoryId) return [];
        return categories.find(c => c.id === selectedCategoryId)?.subCategories || [];
    }, [selectedCategoryId, categories]);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="name" label="اسم الخدمة" value={formData.name} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفئة الرئيسية</label>
                    <select value={selectedCategoryId || ''} onChange={handleCategoryChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                        <option value="" disabled>اختر فئة رئيسية</option>
                        {categories.filter(c => c.name !== "المدينة والجهاز").map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفئة الفرعية</label>
                    <select value={selectedSubCategoryId || ''} onChange={e => setSelectedSubCategoryId(Number(e.target.value))} disabled={!selectedCategoryId} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-200 dark:disabled:bg-slate-600">
                        <option value="" disabled>اختر فئة فرعية</option>
                        {availableSubCategories.map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">مقدم الخدمة (المالك)</label>
                <select name="providerId" value={formData.providerId} onChange={handleChange} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                    <option value={0}>-- لا يوجد --</option>
                    {serviceProviders.map(provider => (
                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                    ))}
                </select>
            </div>
            <InputField name="address" label="العنوان" value={formData.address} onChange={handleChange} required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="phone" label="رقم الهاتف" value={formData.phone} onChange={handleChange} required />
                <InputField name="phone2" label="رقم هاتف إضافي (اختياري)" value={formData.phone2} onChange={handleChange} />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="whatsapp" label="رقم الواتساب" value={formData.whatsapp} onChange={handleChange} />
                <InputField name="facebookUrl" label="رابط فيسبوك (اختياري)" value={formData.facebookUrl} onChange={handleChange} />
            </div>
            <InputField name="instagramUrl" label="رابط انستغرام (اختياري)" value={formData.instagramUrl} onChange={handleChange} />
            <TextareaField name="about" label="حول الخدمة" value={formData.about} onChange={handleChange} required />
            <TextareaField name="workingHours" label="ساعات العمل (اختياري)" value={formData.workingHours} onChange={handleChange} />
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={8} />
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
            </div>
        </form>
    );
};

const ServicePage: React.FC = () => {
    const navigate = useNavigate();
    const { subCategoryId: subCategoryIdStr } = useParams<{ subCategoryId: string }>();
    const subCategoryId = Number(subCategoryIdStr);
    
    const { services, categories, handleSaveService, handleDeleteService, handleToggleFavorite } = useServicesContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول ادارة الخدمات']);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [sortOrder, setSortOrder] = useState<'default' | 'favorite' | 'rating' | 'alpha'>('default');
    
    const serviceProviders = useMemo(() => users.filter(u => u.accountType === 'service_provider'), [users]);
    
    const categoryName = useMemo(() => {
        return categories.flatMap(c => c.subCategories).find(sc => sc.id === subCategoryId)?.name || 'خدمات';
    }, [categories, subCategoryId]);

    const filteredServices = useMemo(() => services.filter(s => s.subCategoryId === subCategoryId), [services, subCategoryId]);

    const sortedServices = useMemo(() => {
        let sorted = [...filteredServices];
        switch (sortOrder) {
            case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
            case 'favorite': sorted.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0)); break;
            case 'alpha': sorted.sort((a, b) => a.name.localeCompare(b.name, 'ar')); break;
        }
        return sorted;
    }, [filteredServices, sortOrder]);

    const handleAddService = () => { setEditingService(null); setIsModalOpen(true); };
    const handleEditService = (service: Service) => { setEditingService(service); setIsModalOpen(true); };
    
    const handleSaveAndClose = (serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => {
        const isNew = !serviceData.id;
        handleSaveService(serviceData);
        setIsModalOpen(false);
        showToast(isNew ? 'تمت إضافة الخدمة بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    };

    const confirmDeleteService = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            handleDeleteService(id);
            showToast('تم حذف الخدمة بنجاح!');
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">إدارة الخدمات</h1>
                        <p className="text-gray-500 dark:text-gray-400">{categoryName}</p>
                    </div>
                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
                         <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                         >
                            <option value="default">ترتيب افتراضي</option>
                            <option value="favorite">الأكثر تفضيلاً</option>
                            <option value="rating">الأعلى تقييماً</option>
                            <option value="alpha">ترتيب أبجدي</option>
                        </select>
                        {canManage && (
                            <button onClick={handleAddService} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                                <PlusIcon className="w-5 h-5" />
                                <span>إضافة خدمة</span>
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                     {sortedServices.length > 0 ? (
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-3"><StarIcon className="w-5 h-5 mx-auto"/></th>
                                    <th scope="col" className="px-6 py-3">اسم الخدمة</th>
                                    <th scope="col" className="px-6 py-3">التقييم</th>
                                    <th scope="col" className="px-6 py-3">عدد التقييمات</th>
                                    <th scope="col" className="px-6 py-3">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedServices.map(service => (
                                    <tr key={service.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-4 py-4 text-center">
                                            <button onClick={() => handleToggleFavorite(service.id)} className="p-2 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/50" title="إضافة للمفضلة">
                                                {service.isFavorite 
                                                    ? <StarIcon className="w-5 h-5 text-yellow-400" /> 
                                                    : <StarIconOutline className="w-5 h-5 text-gray-400" />
                                                }
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 dark:text-white">{service.name}</div>
                                            <div className="text-xs">{service.address}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Rating rating={service.rating} />
                                                <span className="text-xs font-bold">({service.rating.toFixed(1)})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{service.reviews.length}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => navigate(`/dashboard/services/detail/${service.id}`)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900/50 rounded-md" title="عرض التفاصيل"><EyeIcon className="w-5 h-5" /></button>
                                                {canManage && (
                                                    <>
                                                        <button onClick={() => handleEditService(service)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                                        <button onClick={() => confirmDeleteService(service.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <EmptyState
                            icon={<WrenchScrewdriverIcon className="w-16 h-16 text-slate-400" />}
                            title={`لا توجد خدمات في فئة "${categoryName}"`}
                            message="يمكنك البدء بإضافة أول خدمة في هذه الفئة من خلال الزر أدناه."
                        >
                            {canManage && (
                                <button onClick={handleAddService} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>إضافة خدمة جديدة</span>
                                </button>
                            )}
                        </EmptyState>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}>
                <ServiceForm
                    onSave={handleSaveAndClose}
                    onClose={() => setIsModalOpen(false)}
                    service={editingService}
                    initialSubCategoryId={subCategoryId}
                    categories={categories}
                    serviceProviders={serviceProviders}
                />
            </Modal>
        </div>
    );
};

export default ServicePage;