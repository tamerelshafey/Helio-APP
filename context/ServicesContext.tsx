import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockCategories, mockServices } from '../data/mock-data';
import type { Category, Service, ServicesContextType } from '../types';

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export const ServicesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();

    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);

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

    const value = useMemo(() => ({
        categories,
        services,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
    }), [
        categories,
        services,
        handleUpdateReview,
        handleDeleteReview,
        handleReplyToReview,
        handleSaveService,
        handleDeleteService,
        handleToggleFavorite,
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