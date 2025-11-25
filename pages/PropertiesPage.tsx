import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProperties, saveProperty, deleteProperty } from '../api/propertiesApi';
import { 
    ArrowLeftIcon, PlusIcon, PencilSquareIcon, TrashIcon, 
    MagnifyingGlassIcon, HomeModernIcon, MapPinIcon, PhoneIcon,
    ShareIcon, ArrowUpIcon, ArrowDownIcon
} from '../components/common/Icons';
import type { Property, SortDirection } from '../types';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import { InputField, TextareaField } from '../components/common/FormControls';
import { PropertyCardSkeleton } from '../components/common/SkeletonLoader';
import Pagination from '../components/common/Pagination';
import { PropertyStatusBadge } from '../components/common/StatusBadge';
import QueryStateWrapper from '../components/common/QueryStateWrapper';

const ITEMS_PER_PAGE = 8;

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
    const [expiryDate, setExpiryDate] = useState('');

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
            setExpiryDate(property.expiryDate || '');
        } else {
            setTitle(''); setDescription(''); setImages([]); setAddress('');
            setType('sale'); setPrice(0); setContactName(''); setContactPhone(''); setAmenities('');
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            setExpiryDate(futureDate.toISOString().split('T')[0]);
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
            expiryDate,
        };
        onSave(propertyData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField name="title" label="عنوان الإعلان" value={title} onChange={e => setTitle(e.target.value)} required />
            <TextareaField name="description" label="الوصف" value={description} onChange={e => setDescription(e.target.value)} required />
            <ImageUploader initialImages={images} onImagesChange={setImages} multiple maxFiles={10} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="price" label="السعر (بالجنيه المصري)" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نوع العرض</label>
                    <select value={type} onChange={e => setType(e.target.value as 'sale' | 'rent')} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500">
                        <option value="sale">بيع</option>
                        <option value="rent">إيجار</option>
                    </select>
                </div>
            </div>
            <InputField name="expiryDate" label="تاريخ انتهاء صلاحية الإعلان" type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required />
            <InputField name="address" label="العنوان / المنطقة" value={address} onChange={e => setAddress(e.target.value)} required />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField name="contactName" label="اسم جهة الاتصال" value={contactName} onChange={e => setContactName(e.target.value)} required />
                <InputField name="contactPhone" label="رقم هاتف التواصل" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required />
            </div>
            <TextareaField name="amenities" label="وسائل الراحة (مفصولة بفاصلة)" value={amenities} onChange={e => setAmenities(e.target.value)} />

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ العقار</button>
            </div>
        </form>
    );
};

const PropertiesPage: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const propertiesQuery = useQuery({ queryKey: ['properties'], queryFn: getProperties });
    const { data: properties = [] } = propertiesQuery;
    
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول العقارات']);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'rent'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Property; direction: SortDirection } | null>(null);

    const savePropertyMutation = useMutation({
        mutationFn: saveProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            setIsModalOpen(false);
            showToast(editingProperty ? 'تم حفظ التعديلات بنجاح!' : 'تم إضافة العقار بنجاح!');
        },
        onError: (error) => showToast(`حدث خطأ: ${error.message}`, 'error'),
    });

    const deletePropertyMutation = useMutation({
        mutationFn: deleteProperty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['properties'] });
            showToast('تم حذف العقار بنجاح!');
        },
        onError: (error) => showToast(`حدث خطأ: ${error.message}`, 'error'),
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, typeFilter, sortConfig]);

    const handleAddClick = () => {
        setEditingProperty(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (property: Property) => {
        setEditingProperty(property);
        setIsModalOpen(true);
    };
    
    const confirmDelete = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            deletePropertyMutation.mutate(id);
        }
    };

    const handleSortProperties = (key: keyof Property) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                return { ...prevConfig, direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending' };
            }
            return { key, direction: 'ascending' };
        });
    };
    
    const SortIndicator: React.FC<{ direction?: SortDirection }> = ({ direction }) => {
        if (!direction) return null;
        return direction === 'ascending' ? <ArrowUpIcon className="w-3 h-3 ml-1" /> : <ArrowDownIcon className="w-3 h-3 ml-1" />;
    };

    const filteredProperties = useMemo(() => {
        let sorted = [...properties];

        // Sorting
        if (sortConfig) {
            sorted.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                 if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        // Filtering
        return sorted.filter(prop => {
            const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  prop.location.address.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = typeFilter === 'all' || prop.type === typeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [properties, searchTerm, typeFilter, sortConfig]);

    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredProperties, currentPage]);

    const renderGridView = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProperties.map(prop => (
                 <div key={prop.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group">
                    <div className="relative">
                        <img src={prop.images[0] || 'https://picsum.photos/600/400?random=30'} alt={prop.title} className="w-full h-48 object-cover" loading="lazy" />
                        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                            <div className={`px-3 py-1 text-sm font-bold text-white rounded-full ${prop.type === 'sale' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                                {prop.type === 'sale' ? 'للبيع' : 'للإيجار'}
                            </div>
                            <PropertyStatusBadge expiryDate={prop.expiryDate} />
                        </div>
                         {canManage && (
                            <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button onClick={() => handleEditClick(prop)} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50" title="تعديل العقار"><PencilSquareIcon className="w-5 h-5" /></button>
                                <button onClick={() => confirmDelete(prop.id)} className="p-2 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="حذف العقار"><TrashIcon className="w-5 h-5" /></button>
                            </div>
                        )}
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 truncate">{prop.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1"><MapPinIcon className="w-4 h-4" /> {prop.location.address}</p>
                        <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{prop.price.toLocaleString('ar-EG')} جنيه</p>
                        <div className="flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <PhoneIcon className="w-4 h-4"/>
                                <span>{prop.contact.name}</span>
                            </div>
                            <a href={`tel:${prop.contact.phone}`} className="font-bold text-green-600 hover:underline">{prop.contact.phone}</a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    
    const renderTableView = () => (
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortProperties('title')}>
                            <div className="flex items-center">العقار <SortIndicator direction={sortConfig?.key === 'title' ? sortConfig.direction : undefined} /></div>
                        </th>
                        <th scope="col" className="px-6 py-3">النوع</th>
                        <th scope="col" className="px-6 py-3">الحالة</th>
                        <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortProperties('price')}>
                             <div className="flex items-center">السعر <SortIndicator direction={sortConfig?.key === 'price' ? sortConfig.direction : undefined} /></div>
                        </th>
                        <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortProperties('creationDate')}>
                            <div className="flex items-center">تاريخ الإضافة <SortIndicator direction={sortConfig?.key === 'creationDate' ? sortConfig.direction : undefined} /></div>
                        </th>
                        <th scope="col" className="px-6 py-3">إجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedProperties.map(prop => (
                        <tr key={prop.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{prop.title}</td>
                            <td className="px-6 py-4">
                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${prop.type === 'sale' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                                    {prop.type === 'sale' ? 'بيع' : 'إيجار'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <PropertyStatusBadge expiryDate={prop.expiryDate} />
                            </td>
                            <td className="px-6 py-4 font-mono">{prop.price.toLocaleString('ar-EG')} ج.م</td>
                            <td className="px-6 py-4">{prop.creationDate}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditClick(prop)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                    <button onClick={() => confirmDelete(prop.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    const skeletonLoader = (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                <PropertyCardSkeleton key={index} />
            ))}
        </div>
    );

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

                {/* Filters & View Mode */}
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
                     <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`px-3 py-1 rounded-md text-sm ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}>شبكة</button>
                        <button onClick={() => setViewMode('table')} className={`px-3 py-1 rounded-md text-sm ${viewMode === 'table' ? 'bg-white dark:bg-slate-600 shadow' : ''}`}>جدول</button>
                    </div>
                </div>
                
                <QueryStateWrapper queries={propertiesQuery} loader={skeletonLoader}>
                     {filteredProperties.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? renderGridView() : renderTableView()}
                            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        </>
                    ) : (
                        <EmptyState
                            icon={<HomeModernIcon className="w-16 h-16 text-slate-400" />}
                            title="لا توجد عقارات"
                            message="لا توجد عقارات تطابق بحثك. حاول تغيير الفلاتر أو أضف عقاراً جديداً."
                        >
                            {canManage && (
                                <button onClick={handleAddClick} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                                    <PlusIcon className="w-5 h-5" />
                                    <span>إضافة عقار جديد</span>
                                </button>
                            )}
                        </EmptyState>
                    )}
                </QueryStateWrapper>
            </div>
            
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              title={editingProperty ? 'تعديل العقار' : 'إضافة عقار جديد'}
            >
                <PropertyForm 
                  onSave={(data) => savePropertyMutation.mutate(data)}
                  onClose={() => setIsModalOpen(false)}
                  property={editingProperty}
                />
            </Modal>
        </div>
    );
};

export default PropertiesPage;