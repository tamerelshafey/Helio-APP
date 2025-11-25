import { mockNews, mockNotifications, mockAds } from '../data/mock-data';
import type { News, Notification, Ad } from '../types';

// Simulate a database/API backend with mutable data
let news: News[] = JSON.parse(JSON.stringify(mockNews));
let notifications: Notification[] = JSON.parse(JSON.stringify(mockNotifications));
let ads: Ad[] = JSON.parse(JSON.stringify(mockAds));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- News Functions ---

export const getNews = async (): Promise<News[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(news));
};

export const saveNews = async (newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }): Promise<News> => {
    await delay(500);
    const isNew = !newsItem.id;
    if (isNew) {
        const newNewsItem: News = {
            id: Math.max(...news.map(n => n.id).concat(0)) + 1,
            ...newsItem,
            date: new Date().toISOString().split('T')[0],
            author: "إدارة المدينة",
            views: 0,
        };
        news.unshift(newNewsItem);
        return newNewsItem;
    } else {
        let updated: News | undefined;
        news = news.map(n => n.id === newsItem.id ? (updated = { ...n, ...newsItem, id: n.id }) : n);
        if (!updated) throw new Error("News item not found");
        return updated;
    }
};

export const deleteNews = async (id: number): Promise<{ id: number }> => {
    await delay(400);
    news = news.filter(n => n.id !== id);
    return { id };
};

// --- Notification Functions ---

export const getNotifications = async (): Promise<Notification[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(notifications));
};

export const saveNotification = async (notification: Omit<Notification, 'id'> & { id?: number }): Promise<Notification> => {
    await delay(500);
    const isNew = !notification.id;
    if (isNew) {
        const newNotification: Notification = { id: Math.max(...notifications.map(n => n.id).concat(0)) + 1, ...notification };
        notifications.unshift(newNotification);
        return newNotification;
    } else {
        let updated: Notification | undefined;
        notifications = notifications.map(n => n.id === notification.id ? (updated = { ...n, ...notification, id: n.id }) : n);
        if (!updated) throw new Error("Notification not found");
        return updated;
    }
};

export const deleteNotification = async (id: number): Promise<{ id: number }> => {
    await delay(400);
    notifications = notifications.filter(n => n.id !== id);
    return { id };
};

// --- Ad Functions ---

export const getAds = async (): Promise<Ad[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(ads));
};

export const saveAd = async (ad: Omit<Ad, 'id'> & { id?: number }): Promise<Ad> => {
    await delay(500);
    const isNew = !ad.id;
    if (isNew) {
        const newAd: Ad = { id: Math.max(...ads.map(n => n.id).concat(0)) + 1, ...ad };
        ads.unshift(newAd);
        return newAd;
    } else {
        let updated: Ad | undefined;
        ads = ads.map(a => a.id === ad.id ? (updated = { ...a, ...ad, id: a.id }) : a);
        if (!updated) throw new Error("Ad not found");
        return updated;
    }
};

export const deleteAd = async (id: number): Promise<{ id: number }> => {
    await delay(400);
    ads = ads.filter(a => a.id !== id);
    return { id };
};