import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, 
    MagnifyingGlassIcon, HomeModernIcon, MapPinIcon, PhoneIcon
} from '../components/common/Icons';
import type { Property } from '../types';
// FIX: Use usePropertiesContext for property data and handlers
import { usePropertiesContext } from '../context/PropertiesContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';

const PropertyForm: React.FC<{
    onSave: (property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => void;
    onClose: () => void;
    property: Omit<Property, 'id'> & { id?: number } | null;
}> = ({ onSave, onClose, property }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [address, setAddress] = useState('');
    const [type, setType] = useState<'sale' | 'rent'>('sale');
    const [price, setPrice] = useState(0);
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [amenities, setAmenities] = useState('');

    useEffect(() => {
        if (property) {
            setTitle(property.title || '');
            setDescription(property.description || '');
            setImages(property.images || []);
            setAddress(property.location?.address || '');
            setType(property.type || 'sale');
            setPrice(property.price || 0);
            setContactName(property.contact?.name || '');
            setContactPhone(property.contact?.phone || '');
            setAmenities(property.amenities?.join(', ') || '');
        } else {
            setTitle(''); setDescription(''); setImages([]); setAddress('');
            setType('sale'); setPrice(0); setContactName(''); setContactPhone(''); setAmenities('');
        }
    }, [property]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData = {
            id: property?.id,
            title, description,
            images: images,
            location: { address },
            type, price,
            contact: { name: contactName, phone: contactPhone },
            amenities: amenities.split(',').map(s => s.trim()).filter(Boolean),
        };
        onSave(propertyData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField label="عنوان الإعلان" value={title} onChange={setTitle} required />
            <TextareaField label="الوصف" value={description} onChange={setDescription} required />
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={10} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="السعر (بالجنيه المصري)" type="number" value={price} onChange={v => setPrice(Number(v))} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع العرض</label>
                    <select value={type} onChange={e => setType(e.target.value as 'sale' | 'rent')} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                        <option value="sale">بيع</option>
                        <option value="rent">إيجار</option>
                    </select>
                </div>
            </div>
            <InputField label="العنوان / المنطقة" value={address} onChange={setAddress} required />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="اسم جهة الاتصال" value={contactName} onChange={setContactName} required />
                <InputField label="رقم هاتف التواصل" value={contactPhone} onChange={setContactPhone} required />
            </div>
            <TextareaField label="وسائل الراحة (مفصولة بفاصلة)" value={amenities} onChange={setAmenities} />

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ العقار</button>
            </div>
        </form>
    );
};

const InputField: React.FC<{ label: string; value: string | number; onChange: (val: string) => void; type?: string; required?: boolean; }> = ({ label, value, onChange, type = 'text', required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
    </div>
);
const TextareaField: React.FC<{ label: string; value: string; onChange: (val: string) => void; required?: boolean; }> = ({ label, value, onChange, required = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} required={required} rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500"></textarea>
    </div>
);


const PropertyCard: React.FC<{ property: Property; onEdit: () => void; onDelete: () => void; }> = ({ property, onEdit, onDelete }) => {
    const canManage = useHasPermission(['مسؤول العقارات']);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
            <div className="relative">
                <img src={property.images[0] || 'https://picsum.photos/600/400?random=30'} alt={property.title} className="w-full h-48 object-cover" loading="lazy" />
                <div className={`absolute top-3 right-3 px-3 py-1 text-sm font-bold text-white rounded-full ${property.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                    {property.type === 'sale' ? 'للبيع' : 'للإيجار'}
                </div>
                 {canManage && (
                    <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={onEdit} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل العقار"><PencilSquareIcon className="w-5 h-5" /></button>
                        <button onClick={onDelete} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف العقار"><TrashIcon className="w-5 h-5" /></button>
                    </div>
                 )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{property.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {property.location.address}</p>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{property.price.toLocaleString('ar-EG')} جنيه</p>
                <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <PhoneIcon className="w-4 h-4"/>
                        <span>{property.contact.name}</span>
                    </div>
                    <a href={`tel:${property.contact.phone}`} className="font-bold text-green-600 hover:underline">{property.contact.phone}</a>
                </div>
            </div>
        </div>
    );
};


const PropertiesPage: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Use usePropertiesContext for property data and handlers
    const { properties, handleSaveProperty, handleDeleteProperty } = usePropertiesContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول العقارات']);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');

    const handleAddClick = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };

    const handleSaveAndClose = (propertyData: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        const isNew = !propertyData.id;
        handleSaveProperty(propertyData);
        setIsModalOpen(false);
        showToast(isNew ? 'تم إضافة العقار بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    };

    const confirmDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            handleDeleteProperty(id);
            showToast('تم حذف العقار بنجاح!');
        }
    };

    const filteredProperties = useMemo(() => {
        return properties.filter(prop => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = typeFilter === 'all' || prop.type === typeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [properties, searchTerm, typeFilter]);
    
    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
             <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><HomeModernIcon className="w-8 h-8"/>إدارة العقارات</h1>
                    {canManage && (
                        <button onClick={handleAddClick} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة عقار جديد</span>
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input
                            type="text" placeholder="بحث بالعنوان أو المنطقة..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <select
                        value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                        <option value="all">الكل (بيع وإيجار)</option>
                        <option value="sale">بيع فقط</option>
                        <option value="rent">إيجار فقط</option>
                    </select>
                </div>
                
                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProperties.map(prop => (
                            <PropertyCard key={prop.id} property={prop} onEdit={() => handleEditClick(prop)} onDelete={() => confirmDelete(prop.id)} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                      icon={<HomeModernIcon className="w-16 h-16 text-slate-400" />}
                      title={properties.length === 0 ? "لا توجد عقارات مضافة بعد" : "لا توجد عقارات تطابق بحثك"}
                      message={properties.length === 0 ? "ابدأ بإضافة أول عقار لعرضه للمستخدمين في المدينة." : "حاول تغيير الفلاتر أو توسيع نطاق البحث."}
                    >
                      {canManage && properties.length === 0 && (
                        <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                            <PlusIcon className="w-5 h-5" />
                            <span>إضافة عقار جديد</span>
                        </button>
                      )}
                    </EmptyState>
                )}
            </div>
            
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              title={editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
            >
                <PropertyForm 
                  onSave={handleSaveAndClose}
                  onClose={() => setIsModalOpen(false)}
                  property={editingProperty}
                />
            </Modal>
        </div>
    );
};

export default PropertiesPage;