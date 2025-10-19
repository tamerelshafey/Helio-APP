import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { useUIContext } from './UIContext';
import { mockCategories, mockServices } from '../data/mock-data';
import type { Category, Service, ServicesContextType, SubCategory, SortConfig } from '../types';

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const { showToast } = useUIContext();

    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<SortConfig<Service>>(null);
    
    useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => {
            setCategories(mockCategories);
            setServices(mockServices);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleSortServices = useCallback((key: keyof Service) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                if (prevConfig.direction === 'descending') {
                    return null; // Return to default
                }
                return { ...prevConfig, direction: 'descending' };
            }
            return { key, direction: 'ascending' };
        });
    }, []);


    const handleUpdateReview = useCallback((serviceId: number, reviewId: number, newComment: string) => {
        let serviceName = '';
        let reviewUser = '';
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                serviceName = s.name;
                const review = s.reviews.find(r => r.id === reviewId);
                if (review) reviewUser = review.username;
                return {
                    ...s,
                    reviews: s.reviews.map(r => r.id === reviewId ? { ...r, comment: newComment } : r)
                };
            }
            return s;
        }));
        logActivity('تعديل تقييم', `تعديل تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
    }, [logActivity]);

    const handleDeleteReview = useCallback((serviceId: number, reviewId: number) => {
        let serviceName = '';
        let reviewUser = '';
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                serviceName = s.name;
                const review = s.reviews.find(r => r.id === reviewId);
                if (review) reviewUser = review.username;
                return { ...s, reviews: s.reviews.filter(r => r.id !== reviewId) };
            }
            return s;
        }));
        logActivity('حذف تقييم', `حذف تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
    }, [logActivity]);

    const handleReplyToReview = useCallback((serviceId: number, reviewId: number, reply: string) => {
        let serviceName = '';
        let reviewUser = '';
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                serviceName = s.name;
                const review = s.reviews.find(r => r.id === reviewId);
                if (review) reviewUser = review.username;
                return { ...s, reviews: s.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r) };
            }
            return s;
        }));
        logActivity('إضافة رد على تقييم', `إضافة رد على تقييم المستخدم "${reviewUser}" على خدمة "${serviceName}"`);
    }, [logActivity]);

    const handleSaveService = useCallback((serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => {
        const isNew = !serviceData.id;
        setServices(prevServices => {
            if (serviceData.id) {
                return prevServices.map(s => 
                    s.id === serviceData.id 
                    ? { ...s, ...serviceData, id: s.id } 
                    : s
                );
            } else {
                const newService: Service = {
                    id: Math.max(...prevServices.map(s => s.id), 0) + 1,
                    ...serviceData,
                    rating: 0,
                    reviews: [],
                    isFavorite: false,
                    views: 0,
                    creationDate: new Date().toISOString().split('T')[0],
                };
                return [newService, ...prevServices];
            }
        });
        const action = isNew ? 'إنشاء خدمة جديدة' : 'تعديل الخدمة';
        logActivity(action, `حفظ الخدمة: "${serviceData.name}"`);
    }, [logActivity]);

    const handleDeleteService = useCallback((id: number) => {
        const serviceName = services.find(s => s.id === id)?.name || `ID: ${id}`;
        setServices(prevServices => prevServices.filter(s => s.id !== id));
        logActivity('حذف الخدمة', `حذف الخدمة: "${serviceName}"`);
    }, [services, logActivity]);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        setServices(prevServices => prevServices.map(s => 
            s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s
        ));
    }, []);
    
    const handleSaveCategory = useCallback((categoryData: Omit<Category, 'id' | 'subCategories'> & { id?: number }) => {
        const isNew = !categoryData.id;
        setCategories(prev => {
            if (categoryData.id) {
                return prev.map(c => c.id === categoryData.id ? { ...c, name: categoryData.name, icon: categoryData.icon } : c);
            } else {
                const newCategory: Category = {
                    ...categoryData,
                    id: Math.max(...prev.map(c => c.id), 0) + 1,
                    subCategories: [],
                };
                return [...prev, newCategory];
            }
        });
        logActivity(isNew ? 'إضافة فئة رئيسية' : 'تعديل فئة رئيسية', `تم حفظ الفئة: "${categoryData.name}"`);
    }, [logActivity]);

    const handleDeleteCategory = useCallback((categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        if (category.subCategories.length > 0) {
            showToast('لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية. يرجى حذف الفئات الفرعية أولاً.', 'error');
            return;
        }
        setCategories(prev => prev.filter(c => c.id !== categoryId));
        logActivity('حذف فئة رئيسية', `تم حذف الفئة: "${category.name}"`);
    }, [categories, logActivity, showToast]);
    
    const handleSaveSubCategory = useCallback((categoryId: number, subCategoryData: Omit<SubCategory, 'id'> & { id?: number }) => {
        const isNew = !subCategoryData.id;
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                if (subCategoryData.id) { // Edit
                    return { ...cat, subCategories: cat.subCategories.map(sub => sub.id === subCategoryData.id ? { ...sub, ...subCategoryData } : sub) };
                } else { // Add
                    const newSubCategory: SubCategory = { ...subCategoryData, id: Date.now() }; // Using Date.now for simplicity
                    return { ...cat, subCategories: [...cat.subCategories, newSubCategory] };
                }
            }
            return cat;
        }));
        const categoryName = categories.find(c => c.id === categoryId)?.name;
        logActivity(isNew ? 'إضافة فئة فرعية' : 'تعديل فئة فرعية', `تم حفظ الفئة الفرعية "${subCategoryData.name}" في "${categoryName}"`);
    }, [categories, logActivity]);
    
    const handleDeleteSubCategory = useCallback((categoryId: number, subCategoryId: number) => {
        const hasServices = services.some(s => s.subCategoryId === subCategoryId);
        if (hasServices) {
            showToast('لا يمكن حذف الفئة الفرعية لأنها تحتوي على خدمات. يرجى نقل أو حذف الخدمات أولاً.', 'error');
            return;
        }
        const subCategory = categories.find(c => c.id === categoryId)?.subCategories.find(sc => sc.id === subCategoryId);
        setCategories(prev => prev.map(cat => {
            if (cat.id === categoryId) {
                return { ...cat, subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId) };
            }
            return cat;
        }));
        if (subCategory) {
            logActivity('حذف فئة فرعية', `تم حذف الفئة الفرعية: "${subCategory.name}"`);
        }
    }, [services, categories, logActivity, showToast]);

    const handleReorderCategories = useCallback((reorderedCategories: Category[]) => {
        setCategories(reorderedCategories);
        logActivity('إعادة ترتيب الفئات', 'تم تغيير ترتيب الفئات الرئيسية.');
    }, [logActivity]);

    const handleReorderSubCategories = useCallback((categoryId: number, reorderedSubCategories: SubCategory[]) => {
        setCategories(prev => prev.map(cat => 
            cat.id === categoryId 
            ? { ...cat, subCategories: reorderedSubCategories }
            : cat
        ));
        const categoryName = categories.find(c => c.id === categoryId)?.name;
        logActivity('إعادة ترتيب الفئات الفرعية', `تم تغيير ترتيب الفئات الفرعية داخل "${categoryName}".`);
    }, [categories, logActivity]);


    const value = useMemo(() => ({
        categories,
        services,
        loading,
        sortConfig,
        handleSortServices,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
        handleSaveCategory,
        handleDeleteCategory,
        handleSaveSubCategory,
        handleDeleteSubCategory,
        handleReorderCategories,
        handleReorderSubCategories,
    }), [
        categories,
        services,
        loading,
        sortConfig,
        handleSortServices,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
        handleSaveCategory,
        handleDeleteCategory,
        handleSaveSubCategory,
        handleDeleteSubCategory,
        handleReorderCategories,
        handleReorderSubCategories,
    ]);

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServicesContext = (): ServicesContextType => {
    const context = useContext(ServicesContext);
    if (context === undefined) {
        throw new Error('useServicesContext must be used within a ServicesProvider');
    }
    return context;
};
