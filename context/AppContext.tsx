import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useAuthContext } from './AuthContext';
import { 
    mockEmergencyContacts, mockServiceGuides,
    mockPublicPagesContent
} from '../data/mock-data';
import type { 
    EmergencyContact, ServiceGuide, AppContextType,
    AuditLog, PublicPagesContent
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { currentUser } = useAuthContext();

    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    
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
    
    const handleSaveEmergencyContact = useCallback((contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }) => {
        const isNew = !contactData.id;
        setEmergencyContacts(prevContacts => {
            if (contactData.id) {
                return prevContacts.map(c => c.id === contactData.id ? { ...c, title: contactData.title, number: contactData.number } : c);
            } else {
                const newContact: EmergencyContact = {
                    id: Math.max(...prevContacts.map(c => c.id), 0) + 1,
                    title: contactData.title,
                    number: contactData.number,
                    type: 'city',
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
        logActivity('تحديث محتوى الموقع العام', `تم تحديث محتوى صفحة "${page}"`);
    }, [logActivity]);


    const value = useMemo(() => ({
        emergencyContacts, serviceGuides,
        auditLogs, logActivity,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        publicPagesContent, handleUpdatePublicPageContent,
    }), [
        emergencyContacts, serviceGuides,
        auditLogs, logActivity,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        publicPagesContent, handleUpdatePublicPageContent
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