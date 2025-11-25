import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { 
    mockEmergencyContacts, mockServiceGuides,
    mockPublicPagesContent, mockLostAndFoundItems
} from '../data/mock-data';
import type { 
    EmergencyContact, ServiceGuide, AppContextType,
    AuditLog, PublicPagesContent, LostAndFoundItem
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuthContext();

    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    const [lostAndFoundItems, setLostAndFoundItems] = useState<LostAndFoundItem[]>(mockLostAndFoundItems);
    const [googlePlayUrl, setGooglePlayUrl] = useState('https://play.google.com/store/apps/details?id=com.helio.company');
    const [appleAppStoreUrl, setAppleAppStoreUrl] = useState('');

    
    const logActivity = useCallback((action: string, details: string) => {
        const newLog: AuditLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: currentUser?.name || 'زائر',
            action,
            details,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    }, [currentUser]);

    const handleUpdateAppLinks = useCallback((links: { googlePlayUrl: string; appleAppStoreUrl: string; }) => {
        setGooglePlayUrl(links.googlePlayUrl);
        setAppleAppStoreUrl(links.appleAppStoreUrl);
        logActivity('تحديث روابط التطبيق', `تم تحديث روابط متاجر التطبيقات.`);
    }, [logActivity]);
    
    const handleSaveEmergencyContact = useCallback((contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }, newContactType: 'city' | 'national' = 'city') => {
        const isNew = !contactData.id;
        setEmergencyContacts(prevContacts => {
            if (contactData.id) {
                return prevContacts.map(c => c.id === contactData.id ? { ...c, title: contactData.title, number: contactData.number } : c);
            } else {
                const newContact: EmergencyContact = {
                    id: Math.max(...prevContacts.map(c => c.id), 0) + 1,
                    title: contactData.title,
                    number: contactData.number,
                    type: newContactType,
                };
                return [newContact, ...prevContacts];
            }
        });
        const action = isNew ? 'إضافة رقم طوارئ' : 'تعديل رقم طوارئ';
        logActivity(action, `حفظ رقم الطوارئ: "${contactData.title}"`);
    }, [logActivity]);
    
    const handleDeleteEmergencyContact = useCallback((id: number) => {
        const contactTitle = emergencyContacts.find(c => c.id === id)?.title || `ID: ${id}`;
        setEmergencyContacts(prevContacts => prevContacts.filter(c => c.id !== id));
        logActivity('حذف رقم طوارئ', `حذف رقم الطوارئ: "${contactTitle}"`);
    }, [emergencyContacts, logActivity]);
    
    const handleSaveServiceGuide = useCallback((guideData: Omit<ServiceGuide, 'id'> & { id?: number }) => {
        const isNew = !guideData.id;
        setServiceGuides(prevGuides => {
             const guideToSave: ServiceGuide = {
                id: guideData.id || Math.max(...prevGuides.map(g => g.id), 0) + 1,
                title: guideData.title,
                steps: guideData.steps,
                documents: guideData.documents,
                attachmentUrl: guideData.attachmentUrl,
                attachmentType: guideData.attachmentType,
            };
            if (guideData.id) {
                return prevGuides.map(g => g.id === guideData.id ? guideToSave : g);
            } else {
                return [guideToSave, ...prevGuides];
            }
        });
        const action = isNew ? 'إضافة دليل خدمة' : 'تعديل دليل خدمة';
        logActivity(action, `حفظ دليل الخدمة: "${guideData.title}"`);
    }, [logActivity]);
    
    const handleDeleteServiceGuide = useCallback((id: number) => {
        const guideTitle = serviceGuides.find(g => g.id === id)?.title || `ID: ${id}`;
        setServiceGuides(prevGuides => prevGuides.filter(g => g.id !== id));
        logActivity('حذف دليل خدمة', `حذف دليل الخدمة: "${guideTitle}"`);
    }, [serviceGuides, logActivity]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({
            ...prev,
            [page]: newContent
        }));
        logActivity('تحديث محتوى الموقع العام', `تم تحديث محتوى صفحة "${String(page)}"`);
    }, [logActivity]);

    const handleSaveLostAndFoundItem = useCallback((itemData: Omit<LostAndFoundItem, 'id' | 'moderationStatus'> & { id?: number }) => {
        const isNew = !itemData.id;
        setLostAndFoundItems(prev => {
            if (itemData.id) {
                return prev.map(item => item.id === itemData.id ? { ...item, ...itemData, moderationStatus: item.moderationStatus, id: item.id } : item);
            } else {
                const newItem: LostAndFoundItem = {
                    ...itemData,
                    id: Math.max(...prev.map(i => i.id), 0) + 1,
                    moderationStatus: 'pending',
                };
                return [newItem, ...prev];
            }
        });
        const action = isNew ? 'إضافة عنصر مفقودات' : 'تحديث عنصر مفقودات';
        logActivity(action, `تم حفظ العنصر: "${itemData.itemName}"`);
    }, [logActivity]);

    const handleDeleteLostAndFoundItem = useCallback((id: number) => {
        const item = lostAndFoundItems.find(i => i.id === id);
        setLostAndFoundItems(prev => prev.filter(i => i.id !== id));
        if (item) {
            logActivity('حذف عنصر مفقودات', `تم حذف العنصر: "${item.itemName}"`);
        }
    }, [lostAndFoundItems, logActivity]);

    const handleApproveLostAndFoundItem = useCallback((id: number) => {
        setLostAndFoundItems(prev => prev.map(item => item.id === id ? { ...item, moderationStatus: 'approved' } : item));
        logActivity('الموافقة على عنصر مفقودات', `تمت الموافقة على عنصر ID: ${id}`);
    }, [logActivity]);

    const handleRejectLostAndFoundItem = useCallback((id: number) => {
        setLostAndFoundItems(prev => prev.map(item => item.id === id ? { ...item, moderationStatus: 'rejected' } : item));
        logActivity('رفض عنصر مفقودات', `تم رفض عنصر ID: ${id}`);
    }, [logActivity]);


    const value = useMemo(() => ({
        emergencyContacts, serviceGuides,
        auditLogs, logActivity,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        publicPagesContent, handleUpdatePublicPageContent,
        lostAndFoundItems, handleSaveLostAndFoundItem, handleDeleteLostAndFoundItem,
        handleApproveLostAndFoundItem, handleRejectLostAndFoundItem,
        googlePlayUrl, appleAppStoreUrl, handleUpdateAppLinks,
    }), [
        emergencyContacts, serviceGuides,
        auditLogs, logActivity,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        publicPagesContent, handleUpdatePublicPageContent,
        lostAndFoundItems, handleSaveLostAndFoundItem, handleDeleteLostAndFoundItem,
        handleApproveLostAndFoundItem, handleRejectLostAndFoundItem,
        googlePlayUrl, appleAppStoreUrl, handleUpdateAppLinks,
    ]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
