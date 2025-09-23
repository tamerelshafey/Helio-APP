import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { 
    mockCategories, mockServices, mockNews, mockNotifications, 
    mockProperties, mockEmergencyContacts, mockServiceGuides,
    mockUsers, mockAdmins,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes
} from '../data/mock-data';
import type { 
    Category, Service, Review, News, Notification, Property, 
    EmergencyContact, ServiceGuide, AppContextType, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, ExternalRoute, Supervisor,
    AuditLog
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem('isAuthenticated') === 'true');
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);
    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [properties, setProperties] = useState<Property[]>(mockProperties);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        return true; // Default to dark mode on first visit
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    const login = useCallback(() => {
        sessionStorage.setItem('isAuthenticated', 'true');
        setIsAuthenticated(true);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('isAuthenticated');
        setIsAuthenticated(false);
    }, []);


    const logActivity = useCallback((action: string, details: string) => {
        const newLog: AuditLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: 'مدير النظام', // Static user for now
            action,
            details,
        };
        setAuditLogs(prevLogs => [newLog, ...prevLogs]);
    }, []);

    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

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
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
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
        }
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
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            const serviceName = services.find(s => s.id === id)?.name || `ID: ${id}`;
            setServices(prevServices => prevServices.filter(s => s.id !== id));
            logActivity('حذف الخدمة', `حذف الخدمة: "${serviceName}"`);
        }
    }, [services, logActivity]);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        setServices(prevServices => prevServices.map(s => 
            s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s
        ));
    }, []);

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
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            const newsTitle = news.find(n => n.id === id)?.title || `ID: ${id}`;
            setNews(prevNews => prevNews.filter(n => n.id !== id));
            logActivity('حذف خبر', `حذف الخبر: "${newsTitle}"`);
        }
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
        if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
            const notifTitle = notifications.find(n => n.id === id)?.title || `ID: ${id}`;
            setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
            logActivity('حذف إشعار', `حذف الإشعار: "${notifTitle}"`);
        }
    }, [notifications, logActivity]);

    const handleSaveProperty = useCallback((property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
        const isNew = !property.id;
        setProperties(prevProperties => {
            if (property.id) {
                return prevProperties.map(p => p.id === property.id ? { ...p, ...property, id: p.id } : p);
            } else {
                const newProperty: Property = {
                    id: Math.max(...prevProperties.map(p => p.id), 0) + 1,
                    ...property,
                    views: 0,
                    creationDate: new Date().toISOString().split('T')[0],
                };
                return [newProperty, ...prevProperties];
            }
        });
        const action = isNew ? 'إنشاء عقار جديد' : 'تعديل عقار';
        logActivity(action, `حفظ العقار: "${property.title}"`);
    }, [logActivity]);

    const handleDeleteProperty = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            const propTitle = properties.find(p => p.id === id)?.title || `ID: ${id}`;
            setProperties(prevProperties => prevProperties.filter(p => p.id !== id));
            logActivity('حذف عقار', `حذف العقار: "${propTitle}"`);
        }
    }, [properties, logActivity]);
    
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
        if (window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            const contactTitle = emergencyContacts.find(c => c.id === id)?.title || `ID: ${id}`;
            setEmergencyContacts(prevContacts => prevContacts.filter(c => c.id !== id));
            logActivity('حذف رقم طوارئ', `حذف رقم الطوارئ: "${contactTitle}"`);
        }
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
        if (window.confirm('هل أنت متأكد من حذف هذا الدليل؟')) {
            const guideTitle = serviceGuides.find(g => g.id === id)?.title || `ID: ${id}`;
            setServiceGuides(prevGuides => prevGuides.filter(g => g.id !== id));
            logActivity('حذف دليل خدمة', `حذف دليل الخدمة: "${guideTitle}"`);
        }
    }, [serviceGuides, logActivity]);

    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
        const isNew = !userData.id;
        setUsers(prev => {
            if (userData.id) {
                return prev.map(u => u.id === userData.id ? { ...u, ...userData, id: u.id, joinDate: u.joinDate } : u);
            } else {
                const newUser: AppUser = {
                    id: Math.max(...prev.map(u => u.id), 0) + 1,
                    ...userData,
                    joinDate: new Date().toISOString().split('T')[0],
                };
                return [newUser, ...prev];
            }
        });
        const action = isNew ? 'إضافة مستخدم جديد' : 'تعديل بيانات مستخدم';
        logActivity(action, `حفظ بيانات المستخدم: "${userData.name}"`);
    }, [logActivity]);

    const handleDeleteUser = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            const userName = users.find(u => u.id === id)?.name || `ID: ${id}`;
            setUsers(prev => prev.filter(u => u.id !== id));
            logActivity('حذف مستخدم', `حذف المستخدم: "${userName}"`);
        }
    }, [users, logActivity]);

    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: number }) => {
        const isNew = !adminData.id;
        setAdmins(prev => {
            if (adminData.id) {
                return prev.map(a => a.id === adminData.id ? { ...a, ...adminData, id: a.id } : a);
            } else {
                const newAdmin: AdminUser = {
                    id: Math.max(...prev.map(a => a.id), 0) + 1,
                    ...adminData,
                };
                return [newAdmin, ...prev];
            }
        });
        const action = isNew ? 'إضافة مدير جديد' : 'تعديل بيانات مدير';
        logActivity(action, `حفظ بيانات المدير: "${adminData.name}"`);
    }, [logActivity]);

    const handleDeleteAdmin = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المدير؟')) {
            const adminName = admins.find(a => a.id === id)?.name || `ID: ${id}`;
            setAdmins(prev => prev.filter(a => a.id !== id));
            logActivity('حذف مدير', `حذف المدير: "${adminName}"`);
        }
    }, [admins, logActivity]);

    // Transportation Handlers
    const handleSaveDriver = useCallback((driverData: Omit<Driver, 'id'> & { id?: number }) => {
        const isNew = !driverData.id;
        setInternalDrivers(prev => {
            if (driverData.id) {
                const oldDriver = prev.find(d => d.id === driverData.id);
                if (oldDriver && (oldDriver.name !== driverData.name || oldDriver.phone !== driverData.phone)) {
                     setWeeklySchedule(s => s.map(day => ({ ...day, drivers: day.drivers.map(d => d.name === oldDriver.name ? { name: driverData.name, phone: driverData.phone } : d) })));
                }
                return prev.map(d => d.id === driverData.id ? { ...d, ...driverData, id: d.id } : d);
            } else {
                const newDriver = { ...driverData, id: Date.now() };
                return [newDriver, ...prev];
            }
        });
        const action = isNew ? 'إضافة سائق جديد' : 'تعديل بيانات سائق';
        logActivity(action, `حفظ بيانات السائق: "${driverData.name}"`);
    }, [logActivity]);
    const handleDeleteDriver = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول.')) {
            const driverName = internalDrivers.find(d => d.id === id)?.name || `ID: ${id}`;
            if(driverName) {
                 setWeeklySchedule(s => s.map(day => ({ ...day, drivers: day.drivers.filter(d => d.name !== driverName) })));
            }
            setInternalDrivers(prev => prev.filter(d => d.id !== id));
            logActivity('حذف سائق', `حذف السائق: "${driverName}"`);
        }
    }, [internalDrivers, logActivity]);
     const handleSaveRoute = useCallback((routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        const isNew = !routeData.id;
        setExternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                return [{ ...routeData, id: Date.now() }, ...prev];
            }
        });
        const action = isNew ? 'إضافة مسار جديد' : 'تعديل مسار';
        logActivity(action, `حفظ المسار: "${routeData.name}"`);
    }, [logActivity]);
    const handleDeleteRoute = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            const routeName = externalRoutes.find(r => r.id === id)?.name || `ID: ${id}`;
            setExternalRoutes(prev => prev.filter(r => r.id !== id));
            logActivity('حذف مسار', `حذف المسار: "${routeName}"`);
        }
    }, [externalRoutes, logActivity]);
    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        logActivity('تعديل جدول الباصات', 'تم تحديث الجدول الأسبوعي للباصات الداخلية');
    }, [logActivity]);
     const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
        const supervisorType = type === 'internal' ? 'الداخلي' : 'الخارجي';
        logActivity('تعديل بيانات مشرف', `تم تحديث بيانات المشرف ${supervisorType}: "${supervisor.name}"`);
    }, [logActivity]);


    const value = useMemo(() => ({
        isAuthenticated, login, logout,
        categories, services, news, notifications, properties, emergencyContacts, serviceGuides, users, admins,
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes },
        auditLogs, logActivity,
        handleUpdateReview, handleDeleteReview, handleReplyToReview,
        handleSaveService, handleDeleteService, handleToggleFavorite,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveProperty, handleDeleteProperty,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
        isDarkMode, toggleDarkMode,
    }), [
        isAuthenticated, login, logout,
        categories, services, news, notifications, properties, emergencyContacts, serviceGuides, users, admins,
        internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes,
        auditLogs, logActivity,
        handleUpdateReview, handleDeleteReview, handleReplyToReview,
        handleSaveService, handleDeleteService, handleToggleFavorite,
        handleSaveNews, handleDeleteNews,
        handleSaveNotification, handleDeleteNotification,
        handleSaveProperty, handleDeleteProperty,
        handleSaveEmergencyContact, handleDeleteEmergencyContact,
        handleSaveServiceGuide, handleDeleteServiceGuide,
        handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
        isDarkMode, toggleDarkMode
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
