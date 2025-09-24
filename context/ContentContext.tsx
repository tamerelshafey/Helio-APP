import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockNews, mockNotifications, mockAds } from '../data/mock-data';
import type { News, Notification, Ad, ContentContextType } from '../types';

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();

    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [ads, setAds] = useState<Ad[]>(mockAds);

    const handleSaveNews = useCallback((newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => {
        const isNew = !newsItem.id;
        setNews(prevNews => {
            if (newsItem.id) {
                return prevNews.map(n => n.id === newsItem.id ? { ...n, ...newsItem, id: n.id } : n);
            } else {
                const newNewsItem: News = {
                    id: Math.max(...prevNews.map(n => n.id), 0) + 1,
                    ...newsItem,
                    date: new Date().toISOString().split('T')[0],
                    author: "إدارة المدينة",
                    views: 0,
                };
                return [newNewsItem, ...prevNews];
            }
        });
        const action = isNew ? 'إنشاء خبر جديد' : 'تعديل خبر';
        logActivity(action, `حفظ الخبر: "${newsItem.title}"`);
    }, [logActivity]);

    const handleDeleteNews = useCallback((id: number) => {
        const newsTitle = news.find(n => n.id === id)?.title || `ID: ${id}`;
        setNews(prevNews => prevNews.filter(n => n.id !== id));
        logActivity('حذف خبر', `حذف الخبر: "${newsTitle}"`);
    }, [news, logActivity]);
    
    const handleSaveNotification = useCallback((notification: Omit<Notification, 'id'> & { id?: number }) => {
        const isNew = !notification.id;
        setNotifications(prevNotifications => {
            if (notification.id) {
                return prevNotifications.map(n => n.id === notification.id ? { ...n, ...notification, id: n.id } : n);
            } else {
                const newNotification: Notification = {
                    id: Math.max(...prevNotifications.map(n => n.id), 0) + 1,
                    ...notification,
                };
                return [newNotification, ...prevNotifications];
            }
        });
        const action = isNew ? 'إنشاء إشعار جديد' : 'تعديل إشعار';
        logActivity(action, `حفظ الإشعار: "${notification.title}"`);
    }, [logActivity]);

    const handleDeleteNotification = useCallback((id: number) => {
        const notifTitle = notifications.find(n => n.id === id)?.title || `ID: ${id}`;
        setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
        logActivity('حذف إشعار', `حذف الإشعار: "${notifTitle}"`);
    }, [notifications, logActivity]);

    const handleSaveAd = useCallback((ad: Omit<Ad, 'id'> & { id?: number }) => {
        const isNew = !ad.id;
        setAds(prevAds => {
            if (ad.id) {
                return prevAds.map(n => n.id === ad.id ? { ...n, ...ad, id: n.id } : n);
            } else {
                const newAd: Ad = {
                    id: Math.max(...prevAds.map(n => n.id), 0) + 1,
                    ...ad,
                };
                return [newAd, ...prevAds];
            }
        });
        const action = isNew ? 'إنشاء إعلان جديد' : 'تعديل إعلان';
        logActivity(action, `حفظ الإعلان: "${ad.title}"`);
    }, [logActivity]);

    const handleDeleteAd = useCallback((id: number) => {
        const adTitle = ads.find(n => n.id === id)?.title || `ID: ${id}`;
        setAds(prevAds => prevAds.filter(n => n.id !== id));
        logActivity('حذف إعلان', `حذف الإعلان: "${adTitle}"`);
    }, [ads, logActivity]);

    const value = useMemo(() => ({
        news, notifications, ads,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveAd, handleDeleteAd,
    }), [
        news, notifications, ads,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveAd, handleDeleteAd
    ]);

    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContentContext = (): ContentContextType => {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContentContext must be used within a ContentProvider');
    }
    return context;
};