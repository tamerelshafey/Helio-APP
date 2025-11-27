import { 
    mockEmergencyContacts, mockServiceGuides, mockPublicPagesContent 
} from '../data/mock-data';
import type { 
    EmergencyContact, ServiceGuide, AuditLog, PublicPagesContent 
} from '../types';

// Simulate backend storage
let emergencyContacts = JSON.parse(JSON.stringify(mockEmergencyContacts));
let serviceGuides = JSON.parse(JSON.stringify(mockServiceGuides));
let publicPagesContent = JSON.parse(JSON.stringify(mockPublicPagesContent));
let auditLogs: AuditLog[] = [];
let appLinks = {
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.helio.company',
    appleAppStoreUrl: ''
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Audit Logs & Helper ---
export const logActivity = (user: string, action: string, details: string) => {
    const newLog: AuditLog = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        user,
        action,
        details,
    };
    auditLogs.unshift(newLog);
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    await delay(300);
    return [...auditLogs];
};

// --- Emergency Contacts ---
export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(emergencyContacts));
};

export const saveEmergencyContact = async (contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }, type: 'city' | 'national'): Promise<EmergencyContact> => {
    await delay(400);
    if (contactData.id) {
        emergencyContacts = emergencyContacts.map((c: EmergencyContact) => c.id === contactData.id ? { ...c, title: contactData.title, number: contactData.number } : c);
        return emergencyContacts.find((c: EmergencyContact) => c.id === contactData.id)!;
    } else {
        const newContact: EmergencyContact = {
            id: Math.max(...emergencyContacts.map((c: EmergencyContact) => c.id).concat(0)) + 1,
            title: contactData.title,
            number: contactData.number,
            type,
        };
        emergencyContacts.unshift(newContact);
        return newContact;
    }
};

export const deleteEmergencyContact = async (id: number): Promise<void> => {
    await delay(300);
    emergencyContacts = emergencyContacts.filter((c: EmergencyContact) => c.id !== id);
};

// --- Service Guides ---
export const getServiceGuides = async (): Promise<ServiceGuide[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(serviceGuides));
};

export const saveServiceGuide = async (guideData: Omit<ServiceGuide, 'id'> & { id?: number }): Promise<ServiceGuide> => {
    await delay(500);
    if (guideData.id) {
        serviceGuides = serviceGuides.map((g: ServiceGuide) => g.id === guideData.id ? { ...g, ...guideData } : g);
        return serviceGuides.find((g: ServiceGuide) => g.id === guideData.id)!;
    } else {
        const newGuide: ServiceGuide = {
            id: Math.max(...serviceGuides.map((g: ServiceGuide) => g.id).concat(0)) + 1,
            ...guideData
        };
        serviceGuides.unshift(newGuide);
        return newGuide;
    }
};

export const deleteServiceGuide = async (id: number): Promise<void> => {
    await delay(300);
    serviceGuides = serviceGuides.filter((g: ServiceGuide) => g.id !== id);
};

// --- App Links ---
export const getAppLinks = async (): Promise<{ googlePlayUrl: string; appleAppStoreUrl: string; }> => {
    await delay(200);
    return { ...appLinks };
};

export const updateAppLinks = async (links: { googlePlayUrl: string; appleAppStoreUrl: string; }): Promise<void> => {
    await delay(400);
    appLinks = links;
};

// --- Public Content ---
export const getPublicContent = async (): Promise<PublicPagesContent> => {
    await delay(300);
    return JSON.parse(JSON.stringify(publicPagesContent));
};

export const updatePublicContent = async ({ page, content }: { page: keyof PublicPagesContent, content: any }): Promise<void> => {
    await delay(500);
    publicPagesContent[page] = content;
};
