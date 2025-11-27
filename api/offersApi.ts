import { mockOffers, mockOfferCodes } from '../data/mock-data';
import type { Offer, OfferCode } from '../types';

// Simulate backend storage
let offers = JSON.parse(JSON.stringify(mockOffers));
let offerCodes = JSON.parse(JSON.stringify(mockOfferCodes));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Offers ---
export const getOffers = async (): Promise<Offer[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(offers));
};

export const saveOffer = async (offerData: Omit<Offer, 'id'> & { id?: number }): Promise<Offer> => {
    await delay(500);
    if (offerData.id) {
        offers = offers.map((o: Offer) => o.id === offerData.id ? { ...o, ...offerData } : o);
        return offers.find((o: Offer) => o.id === offerData.id)!;
    } else {
        const newOffer: Offer = {
            ...offerData,
            id: Math.max(...offers.map((o: Offer) => o.id), 0) + 1
        };
        offers.unshift(newOffer);
        return newOffer;
    }
};

export const deleteOffer = async (id: number): Promise<void> => {
    await delay(400);
    offers = offers.filter((o: Offer) => o.id !== id);
    // Also delete associated codes
    offerCodes = offerCodes.filter((c: OfferCode) => c.offerId !== id);
};

// --- Offer Codes ---
export const getOfferCodes = async (): Promise<OfferCode[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(offerCodes));
};

export const generateOfferCode = async ({ offerId, userId }: { offerId: number, userId: number }): Promise<OfferCode> => {
    await delay(400);
    const existingCode = offerCodes.find((c: OfferCode) => c.offerId === offerId && c.userId === userId);
    if (existingCode) {
        throw new Error('هذا المستخدم لديه كود بالفعل لهذا العرض.');
    }

    const newCode: OfferCode = {
        id: Math.max(...offerCodes.map((c: OfferCode) => c.id).concat(0)) + 1,
        offerId,
        userId,
        code: `HELIO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        isRedeemed: false,
        issueDate: new Date().toISOString().split('T')[0],
    };
    offerCodes.unshift(newCode);
    return newCode;
};

export const deleteOfferCode = async (id: number): Promise<void> => {
    await delay(300);
    offerCodes = offerCodes.filter((c: OfferCode) => c.id !== id);
};

export const toggleCodeRedemption = async (id: number): Promise<void> => {
    await delay(300);
    offerCodes = offerCodes.map((c: OfferCode) => c.id === id ? { ...c, isRedeemed: !c.isRedeemed } : c);
};