import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { 
    mockCategories, mockServices, mockNews, mockNotifications, 
    mockProperties, mockEmergencyContacts, mockServiceGuides,
    mockUsers, mockAdmins,
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes,
    mockPublicPagesContent
} from '../data/mock-data';
// FIX: Add missing 'ExternalRoute' type import to resolve compilation errors.
import type { 
    Category, Service, Review, News, Notification, Property, 
    EmergencyContact, ServiceGuide, AppContextType, AppUser, AdminUser,
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute,
    AuditLog, PublicPagesContent, ToastMessage
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useHasPermission = (requiredRoles: AdminUser['role'][]) => {
    const { currentUser } = useAppContext();
    if (!currentUser) return false;
    // Super admin can do anything
    if (currentUser.role === 'مدير عام') return true;
    return requiredRoles.includes(currentUser.role);
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const isAuthenticated = !!currentUser;

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
    const [publicPagesContent, setPublicPagesContent] = useState<PublicPagesContent>(mockPublicPagesContent);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);


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

    const login = useCallback((user: AdminUser) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);


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
        showToast('تم تعديل التقييم بنجاح!');
    }, [logActivity, showToast]);

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
            showToast('تم حذف التقييم بنجاح!');
        }
    }, [logActivity, showToast]);

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
        showToast('تم إضافة الرد بنجاح!');
    }, [logActivity, showToast]);

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
        showToast(isNew ? 'تمت إضافة الخدمة بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteService = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            const serviceName = services.find(s => s.id === id)?.name || `ID: ${id}`;
            setServices(prevServices => prevServices.filter(s => s.id !== id));
            logActivity('حذف الخدمة', `حذف الخدمة: "${serviceName}"`);
            showToast('تم حذف الخدمة بنجاح!');
        }
    }, [services, logActivity, showToast]);

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
        showToast(isNew ? 'تم نشر الخبر بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteNews = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            const newsTitle = news.find(n => n.id === id)?.title || `ID: ${id}`;
            setNews(prevNews => prevNews.filter(n => n.id !== id));
            logActivity('حذف خبر', `حذف الخبر: "${newsTitle}"`);
            showToast('تم حذف الخبر بنجاح!');
        }
    }, [news, logActivity, showToast]);
    
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
        showToast(isNew ? 'تم إضافة الإشعار بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteNotification = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
            const notifTitle = notifications.find(n => n.id === id)?.title || `ID: ${id}`;
            setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
            logActivity('حذف إشعار', `حذف الإشعار: "${notifTitle}"`);
            showToast('تم حذف الإشعار بنجاح!');
        }
    }, [notifications, logActivity, showToast]);

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
        showToast(isNew ? 'تم إضافة العقار بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteProperty = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            const propTitle = properties.find(p => p.id === id)?.title || `ID: ${id}`;
            setProperties(prevProperties => prevProperties.filter(p => p.id !== id));
            logActivity('حذف عقار', `حذف العقار: "${propTitle}"`);
            showToast('تم حذف العقار بنجاح!');
        }
    }, [properties, logActivity, showToast]);
    
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
        showToast(isNew ? 'تم إضافة الرقم بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);
    
    const handleDeleteEmergencyContact = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            const contactTitle = emergencyContacts.find(c => c.id === id)?.title || `ID: ${id}`;
            setEmergencyContacts(prevContacts => prevContacts.filter(c => c.id !== id));
            logActivity('حذف رقم طوارئ', `حذف رقم الطوارئ: "${contactTitle}"`);
            showToast('تم حذف الرقم بنجاح!');
        }
    }, [emergencyContacts, logActivity, showToast]);
    
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
        showToast(isNew ? 'تم إضافة الدليل بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);
    
    const handleDeleteServiceGuide = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الدليل؟')) {
            const guideTitle = serviceGuides.find(g => g.id === id)?.title || `ID: ${id}`;
            setServiceGuides(prevGuides => prevGuides.filter(g => g.id !== id));
            logActivity('حذف دليل خدمة', `حذف دليل الخدمة: "${guideTitle}"`);
            showToast('تم حذف الدليل بنجاح!');
        }
    }, [serviceGuides, logActivity, showToast]);

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
        showToast(isNew ? 'تم إضافة المستخدم بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteUser = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            const userName = users.find(u => u.id === id)?.name || `ID: ${id}`;
            setUsers(prev => prev.filter(u => u.id !== id));
            logActivity('حذف مستخدم', `حذف المستخدم: "${userName}"`);
            showToast('تم حذف المستخدم بنجاح!');
        }
    }, [users, logActivity, showToast]);

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
        showToast(isNew ? 'تم إضافة المدير بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);

    const handleDeleteAdmin = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المدير؟')) {
            const adminName = admins.find(a => a.id === id)?.name || `ID: ${id}`;
            setAdmins(prev => prev.filter(a => a.id !== id));
            logActivity('حذف مدير', `حذف المدير: "${adminName}"`);
            showToast('تم حذف المدير بنجاح!');
        }
    }, [admins, logActivity, showToast]);

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
        showToast(isNew ? 'تم إضافة السائق بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);
    const handleDeleteDriver = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول.')) {
            const driverName = internalDrivers.find(d => d.id === id)?.name || `ID: ${id}`;
            if(driverName) {
                 setWeeklySchedule(s => s.map(day => ({ ...day, drivers: day.drivers.filter(d => d.name !== driverName) })));
            }
            setInternalDrivers(prev => prev.filter(d => d.id !== id));
            logActivity('حذف سائق', `حذف السائق: "${driverName}"`);
            showToast('تم حذف السائق بنجاح!');
        }
    }, [internalDrivers, logActivity, showToast]);
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
        showToast(isNew ? 'تم إضافة المسار بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    }, [logActivity, showToast]);
    const handleDeleteRoute = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            const routeName = externalRoutes.find(r => r.id === id)?.name || `ID: ${id}`;
            setExternalRoutes(prev => prev.filter(r => r.id !== id));
            logActivity('حذف مسار', `حذف المسار: "${routeName}"`);
            showToast('تم حذف المسار بنجاح!');
        }
    }, [externalRoutes, logActivity, showToast]);
    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        logActivity('تعديل جدول الباصات', 'تم تحديث الجدول الأسبوعي للباصات الداخلية');
        showToast('تم حفظ جدول المناوبات بنجاح!');
    }, [logActivity, showToast]);
     const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
        const supervisorType = type === 'internal' ? 'الداخلي' : 'الخارجي';
        logActivity('تعديل بيانات مشرف', `تم تحديث بيانات المشرف ${supervisorType}: "${supervisor.name}"`);
        showToast('تم حفظ بيانات المشرف بنجاح!');
    }, [logActivity, showToast]);

    const handleUpdatePublicPageContent = useCallback(<K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => {
        setPublicPagesContent(prev => ({
            ...prev,
            [page]: newContent
        }));
        logActivity('تحديث محتوى الموقع العام', `تم تحديث محتوى صفحة "${page}"`);
        showToast(`تم حفظ محتوى صفحة "${page}" بنجاح!`);
    }, [logActivity, showToast]);


    const value = useMemo(() => ({
        isAuthenticated, login, logout, currentUser,
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
        publicPagesContent, handleUpdatePublicPageContent,
        toasts, showToast, dismissToast
    }), [
        isAuthenticated, login, logout, currentUser,
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
        isDarkMode, toggleDarkMode,
        publicPagesContent, handleUpdatePublicPageContent,
        toasts, showToast, dismissToast
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