import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockForSaleItems, mockJobs } from '../data/mock-data';
import type { ForSaleItem, JobPosting, MarketplaceContextType } from '../types';

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();

    const [forSaleItems, setForSaleItems] = useState<ForSaleItem[]>(mockForSaleItems);
    const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);

    const handleApproveItem = useCallback((type: 'sale' | 'job', id: number) => {
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const expiryDate = thirtyDaysFromNow.toISOString().split('T')[0];
        const approvalDate = new Date().toISOString().split('T')[0];

        if (type === 'sale') {
            setForSaleItems(prev => prev.map(item => item.id === id ? { ...item, status: 'approved', approvalDate, expiryDate } : item));
            logActivity('الموافقة على إعلان بيع', `تمت الموافقة على إعلان ID: ${id}`);
        } else {
            setJobs(prev => prev.map(item => item.id === id ? { ...item, status: 'approved', approvalDate, expiryDate } : item));
            logActivity('الموافقة على إعلان وظيفة', `تمت الموافقة على إعلان ID: ${id}`);
        }
    }, [logActivity]);

    const handleRejectItem = useCallback((type: 'sale' | 'job', id: number) => {
        if (type === 'sale') {
            setForSaleItems(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
            logActivity('رفض إعلان بيع', `تم رفض إعلان ID: ${id}`);
        } else {
            setJobs(prev => prev.map(item => item.id === id ? { ...item, status: 'rejected' } : item));
            logActivity('رفض إعلان وظيفة', `تم رفض إعلان ID: ${id}`);
        }
    }, [logActivity]);

    const handleDeleteItem = useCallback((type: 'sale' | 'job', id: number) => {
        if (type === 'sale') {
            setForSaleItems(prev => prev.filter(item => item.id !== id));
            logActivity('حذف إعلان بيع', `تم حذف إعلان ID: ${id}`);
        } else {
            setJobs(prev => prev.filter(item => item.id !== id));
            logActivity('حذف إعلان وظيفة', `تم حذف إعلان ID: ${id}`);
        }
    }, [logActivity]);

    const value = useMemo(() => ({
        forSaleItems,
        jobs,
        handleApproveItem,
        handleRejectItem,
        handleDeleteItem,
    }), [forSaleItems, jobs, handleApproveItem, handleRejectItem, handleDeleteItem]);


    return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export const useMarketplaceContext = (): MarketplaceContextType => {
    const context = useContext(MarketplaceContext);
    if (context === undefined) {
        throw new Error('useMarketplaceContext must be used within a MarketplaceProvider');
    }
    return context;
};
