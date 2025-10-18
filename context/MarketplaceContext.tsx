import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockForSaleItems, mockJobs } from '../data/mock-data';
import type { ForSaleItem, JobPosting, MarketplaceContextType, MarketplaceItemStatus } from '../types';

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [forSaleItems, setForSaleItems] = useState<ForSaleItem[]>(mockForSaleItems);
    const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);

    // FIX: Corrected generic constraint to ensure type safety for shared properties.
    const updateItemStatus = useCallback(<T extends { id: number; status: MarketplaceItemStatus; approvalDate?: string; expiryDate?: string; }>(
        items: T[], 
        id: number, 
        status: MarketplaceItemStatus, 
        expiryDays?: number
    ): T[] => {
        return items.map(item => {
            if (item.id === id) {
                const updatedItem = { ...item, status };
                if (status === 'approved' && expiryDays) {
                    const approvalDate = new Date();
                    const expiryDate = new Date();
                    expiryDate.setDate(approvalDate.getDate() + expiryDays);
                    updatedItem.approvalDate = approvalDate.toISOString().split('T')[0];
                    updatedItem.expiryDate = expiryDate.toISOString().split('T')[0];
                }
                return updatedItem;
            }
            return item;
        });
    }, []);
    
    const handleApproveItem = useCallback((type: 'sale' | 'job', id: number, expiryDays: number) => {
        if (type === 'sale') {
            const item = forSaleItems.find(i => i.id === id);
            setForSaleItems(prev => updateItemStatus(prev, id, 'approved', expiryDays));
            logActivity('الموافقة على إعلان بيع', `تمت الموافقة على "${item?.title}" لمدة ${expiryDays} يوم.`);
        } else {
            const item = jobs.find(i => i.id === id);
            setJobs(prev => updateItemStatus(prev, id, 'approved', expiryDays));
            logActivity('الموافقة على إعلان وظيفة', `تمت الموافقة على "${item?.title}" لمدة ${expiryDays} يوم.`);
        }
    }, [logActivity, updateItemStatus, forSaleItems, jobs]);

    const handleRejectItem = useCallback((type: 'sale' | 'job', id: number) => {
        if (type === 'sale') {
            const item = forSaleItems.find(i => i.id === id);
            setForSaleItems(prev => updateItemStatus(prev, id, 'rejected'));
            logActivity('رفض إعلان بيع', `تم رفض الإعلان: "${item?.title}".`);
        } else {
            const item = jobs.find(i => i.id === id);
            setJobs(prev => updateItemStatus(prev, id, 'rejected'));
            logActivity('رفض إعلان وظيفة', `تم رفض الوظيفة: "${item?.title}".`);
        }
    }, [logActivity, updateItemStatus, forSaleItems, jobs]);
    
    const handleDeleteItem = useCallback((type: 'sale' | 'job', id: number) => {
        if (type === 'sale') {
            const item = forSaleItems.find(i => i.id === id);
            setForSaleItems(prev => prev.filter(item => item.id !== id));
            logActivity('حذف إعلان بيع', `تم حذف الإعلان: "${item?.title}".`);
        } else {
            const item = jobs.find(i => i.id === id);
            setJobs(prev => prev.filter(item => item.id !== id));
            logActivity('حذف إعلان وظيفة', `تم حذف الوظيفة: "${item?.title}".`);
        }
    }, [logActivity, forSaleItems, jobs]);

    const value = useMemo(() => ({
        forSaleItems, jobs,
        handleApproveItem, handleRejectItem, handleDeleteItem,
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
