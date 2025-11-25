import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { useUIContext } from './UIContext';
import { mockOffers, mockOfferCodes } from '../data/mock-data';
import type { Offer, OfferCode, OffersContextType } from '../types';

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export const OffersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const { showToast } = useUIContext();
    const [offers, setOffers] = useState<Offer[]>(mockOffers);
    const [offerCodes, setOfferCodes] = useState<OfferCode[]>(mockOfferCodes);

    const handleSaveOffer = useCallback((offerData: Omit<Offer, 'id'> & { id?: number }) => {
        const isNew = !offerData.id;
        setOffers(prev => {
            if (offerData.id) {
                return prev.map(o => o.id === offerData.id ? { ...o, ...offerData } : o);
            } else {
                const newOffer: Offer = { ...offerData, id: Math.max(...prev.map(o => o.id), 0) + 1 };
                return [newOffer, ...prev];
            }
        });
        logActivity(isNew ? 'إضافة عرض جديد' : 'تعديل عرض', `تم حفظ العرض: "${offerData.title}"`);
    }, [logActivity]);

    const handleDeleteOffer = useCallback((offerId: number) => {
        const offer = offers.find(o => o.id === offerId);
        setOffers(prev => prev.filter(o => o.id !== offerId));
        setOfferCodes(prev => prev.filter(c => c.offerId !== offerId)); // Also delete associated codes
        if (offer) {
            logActivity('حذف عرض', `تم حذف العرض: "${offer.title}" وجميع أكواده.`);
        }
    }, [offers, logActivity]);

    const handleGenerateCode = useCallback((offerId: number, userId: number) => {
        const existingCode = offerCodes.find(c => c.offerId === offerId && c.userId === userId);
        if (existingCode) {
            showToast('هذا المستخدم لديه كود بالفعل لهذا العرض.', 'error');
            return;
        }

        const newCode: OfferCode = {
            id: Math.max(...offerCodes.map(c => c.id).concat(0)) + 1,
            offerId,
            userId,
            code: `HELIO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            isRedeemed: false,
            issueDate: new Date().toISOString().split('T')[0],
        };
        setOfferCodes(prev => [newCode, ...prev]);
        logActivity('إصدار كود عرض', `تم إصدار الكود "${newCode.code}" للمستخدم ID ${userId}.`);
    }, [offerCodes, logActivity, showToast]);

    const handleDeleteCode = useCallback((codeId: number) => {
        const code = offerCodes.find(c => c.id === codeId);
        setOfferCodes(prev => prev.filter(c => c.id !== codeId));
        if (code) {
            logActivity('حذف كود عرض', `تم حذف الكود: "${code.code}".`);
        }
    }, [offerCodes, logActivity]);

    const handleToggleCodeRedemption = useCallback((codeId: number) => {
        const code = offerCodes.find(c => c.id === codeId);
        if (code) {
            setOfferCodes(prev => prev.map(c => 
                c.id === codeId ? { ...c, isRedeemed: !c.isRedeemed } : c
            ));
            const action = !code.isRedeemed ? 'استخدام كود عرض' : 'إلغاء استخدام كود عرض';
            logActivity(action, `تم تغيير حالة الكود "${code.code}".`);
        }
    }, [offerCodes, logActivity]);

    const value = useMemo(() => ({
        offers,
        offerCodes,
        handleSaveOffer,
        handleDeleteOffer,
        handleGenerateCode,
        handleDeleteCode,
        handleToggleCodeRedemption,
    }), [offers, offerCodes, handleSaveOffer, handleDeleteOffer, handleGenerateCode, handleDeleteCode, handleToggleCodeRedemption]);

    return <OffersContext.Provider value={value}>{children}</OffersContext.Provider>;
};

export const useOffersContext = (): OffersContextType => {
    const context = useContext(OffersContext);
    if (context === undefined) {
        throw new Error('useOffersContext must be used within an OffersProvider');
    }
    return context;
};
