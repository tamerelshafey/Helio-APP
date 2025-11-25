import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUIContext } from '../context/UIContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getServices, getCategories, saveCategory, deleteCategory, saveSubCategory, 
    deleteSubCategory, reorderCategories, reorderSubCategories 
} from '../api/servicesApi';
import { 
    ArrowLeftIcon, RectangleGroupIcon, Squares2X2Icon, HeartIcon, CakeIcon, AcademicCapIcon, ShoppingBagIcon, 
    DevicePhoneMobileIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon, CarIcon, GiftIcon, PaintBrushIcon,
    PlusIcon, PencilSquareIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, FilmIcon, BanknotesIcon, BeakerIcon,
    BuildingLibraryIcon, DocumentDuplicateIcon, EnvelopeIcon, FireIcon, HomeModernIcon, InformationCircleIcon,
    TruckIcon, UserGroupIcon,
} from '../components/common/Icons';
import Modal from '../components/common/Modal';
import { Category, SubCategory } from '../types';
import Spinner from '../components/common/Spinner';

const allIconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    HeartIcon, CakeIcon, AcademicCapIcon, ShoppingBagIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon, 
    CarIcon, Squares2X2Icon, GiftIcon, PaintBrushIcon, FilmIcon, BanknotesIcon, BeakerIcon, BuildingLibraryIcon, 
    DocumentDuplicateIcon, EnvelopeIcon, FireIcon, HomeModernIcon, InformationCircleIcon, TruckIcon, UserGroupIcon
};
const availableIcons = Object.keys(allIconComponents);

const getIcon = (name: string | undefined, props: React.SVGProps<SVGSVGElement>) => {
    if (!name) return <Squares2X2Icon {...props} />;
    const IconComponent = allIconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : <Squares2X2Icon {...props} />;
};

const CategoryForm: React.FC<{
    category?: Category;
    onSave: (data: Omit<Category, 'id' | 'subCategories'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ category, onSave, onClose }) => {
    const [name, setName] = useState(category?.name || '');
    const [icon, setIcon] = useState(category?.icon || availableIcons[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: category?.id, name, icon });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم الفئة</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-2">الأيقونة</label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg max-h-48 overflow-y-auto">
                    {availableIcons.map(iconName => (
                        <button type="button" key={iconName} onClick={() => setIcon(iconName)} className={`flex items-center justify-center p-2 rounded-md transition-colors ${icon === iconName ? 'bg-cyan-500 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                            {getIcon(iconName, { className: "w-6 h-6" })}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const SubCategoryForm: React.FC<{
    subCategory?: SubCategory;
    onSave: (data: Omit<SubCategory, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ subCategory, onSave, onClose }) => {
    const [name, setName] = useState(subCategory?.name || '');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: subCategory?.id, name });
    };

    return (
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم الفئة الفرعية</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
             <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};


const ServicesOverviewPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useUIContext();
    const queryClient = useQueryClient();

    const { data: services = [], isLoading: isLoadingServices } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

    const [modalState, setModalState] = useState<{ type: null | 'category' | 'subcategory'; data?: any; parentId?: number }>({ type: null });

    const saveCategoryMutation = useMutation({
        mutationFn: saveCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setModalState({ type: null });
            showToast('تم حفظ الفئة الرئيسية بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error'),
    });

    const deleteCategoryMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            showToast('تم حذف الفئة بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error'),
    });

    const saveSubCategoryMutation = useMutation({
        mutationFn: saveSubCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            setModalState({ type: null });
            showToast('تم حفظ الفئة الفرعية بنجاح!');
        },
        onError: (error: Error) => showToast(error.message, 'error'),
    });

    const deleteSubCategoryMutation = useMutation({
        mutationFn: deleteSubCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: (error: Error) => showToast(error.message, 'error'),
    });

    const reorderCategoriesMutation = useMutation({
        mutationFn: reorderCategories,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const reorderSubCategoriesMutation = useMutation({
        mutationFn: reorderSubCategories,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const categoryData = useMemo(() => {
        const serviceCounts: { [subCategoryId: number]: number } = {};
        for (const service of services) {
            serviceCounts[service.subCategoryId] = (serviceCounts[service.subCategoryId] || 0) + 1;
        }

        return categories
            .filter(cat => cat.name !== "المدينة والجهاز")
            .map(cat => {
                const subCategoriesWithCounts = cat.subCategories.map(sub => ({ ...sub, count: serviceCounts[sub.id] || 0 }));
                const totalCount = subCategoriesWithCounts.reduce((sum, sub) => sum + sub.count, 0);
                return { ...cat, totalCount, subCategories: subCategoriesWithCounts };
            });
    }, [categories, services]);
    
    // Handlers
    const handleMove = (array: any[], index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= array.length) return array;
        const newArray = [...array];
        [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
        return newArray;
    };
    
    const onMoveCategory = (index: number, direction: 'up' | 'down') => {
        const reordered = handleMove(categoryData, index, direction);
        const originalCategories = reordered.map(c => categories.find(oc => oc.id === c.id)).filter(Boolean) as Category[];
        reorderCategoriesMutation.mutate(originalCategories);
    };

    const onMoveSubCategory = (catId: number, subIndex: number, direction: 'up' | 'down') => {
        const category = categories.find(c => c.id === catId);
        if (!category) return;
        const reorderedSubCategories = handleMove(category.subCategories, subIndex, direction);
        reorderSubCategoriesMutation.mutate({ categoryId: catId, reorderedSubCategories });
    };

    if (isLoadingServices || isLoadingCategories) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline"><ArrowLeftIcon className="w-5 h-5" /><span>العودة</span></button>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><RectangleGroupIcon className="w-8 h-8"/>إدارة هيكل الخدمات</h1>
                <button onClick={() => setModalState({ type: 'category' })} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5"/>إضافة فئة رئيسية</button>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg">
                 <div className="space-y-2">
                    {categoryData.map((category, index) => (
                        <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                            <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-700/50">
                                <div className="flex items-center gap-1">
                                    <button onClick={() => onMoveCategory(index, 'up')} disabled={index === 0} className="p-1 disabled:opacity-30"><ArrowUpIcon className="w-5 h-5"/></button>
                                    <button onClick={() => onMoveCategory(index, 'down')} disabled={index === categoryData.length - 1} className="p-1 disabled:opacity-30"><ArrowDownIcon className="w-5 h-5"/></button>
                                </div>
                                {getIcon(category.icon, { className: "w-6 h-6 text-cyan-500 mx-3" })}
                                <span className="font-semibold text-lg text-gray-800 dark:text-white">{category.name}</span>
                                <span className="text-sm font-mono px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full mr-3">{category.totalCount}</span>
                                <div className="mr-auto flex items-center gap-2">
                                    <button onClick={() => setModalState({ type: 'category', data: category })} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                    <button onClick={() => deleteCategoryMutation.mutate(category.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                </div>
                            </div>
                            <div className="p-4 pr-12 space-y-2">
                                {category.subCategories.map((sub, subIndex) => (
                                    <div key={sub.id} className="flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50 group">
                                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => onMoveSubCategory(category.id, subIndex, 'up')} disabled={subIndex === 0} className="p-1 disabled:opacity-30"><ArrowUpIcon className="w-4 h-4"/></button>
                                            <button onClick={() => onMoveSubCategory(category.id, subIndex, 'down')} disabled={subIndex === category.subCategories.length - 1} className="p-1 disabled:opacity-30"><ArrowDownIcon className="w-4 h-4"/></button>
                                        </div>
                                        <Link to={`/dashboard/services/subcategory/${sub.id}`} className="flex-grow text-gray-700 dark:text-gray-300 px-2">{sub.name}</Link>
                                        <span className="font-bold font-mono text-cyan-600 dark:text-cyan-400">{sub.count}</span>
                                        <div className="mr-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setModalState({ type: 'subcategory', data: sub, parentId: category.id })} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md" title="تعديل"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => deleteSubCategoryMutation.mutate({ categoryId: category.id, subCategoryId: sub.id })} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md" title="حذف"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => setModalState({type: 'subcategory', parentId: category.id})} className="flex items-center gap-2 text-sm text-cyan-600 font-semibold p-2 mt-2 hover:underline"><PlusIcon className="w-4 h-4"/>إضافة فئة فرعية</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Modals */}
            <Modal isOpen={modalState.type === 'category'} onClose={() => setModalState({ type: null })} title={modalState.data ? 'تعديل فئة رئيسية' : 'إضافة فئة رئيسية'}>
                <CategoryForm category={modalState.data} onClose={() => setModalState({ type: null })} onSave={(data) => saveCategoryMutation.mutate(data)} />
            </Modal>
             <Modal isOpen={modalState.type === 'subcategory'} onClose={() => setModalState({ type: null })} title={modalState.data ? 'تعديل فئة فرعية' : 'إضافة فئة فرعية'}>
                <SubCategoryForm subCategory={modalState.data} onClose={() => setModalState({ type: null })} onSave={(data) => { if (modalState.parentId) { saveSubCategoryMutation.mutate({ categoryId: modalState.parentId, subCategoryData: data }); } }} />
            </Modal>
        </div>
    );
};

export default ServicesOverviewPage;
