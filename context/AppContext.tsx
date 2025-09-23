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
    Driver, WeeklyScheduleItem, ExternalRoute, Supervisor
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [services, setServices] = useState<Service[]>(mockServices);
    const [news, setNews] = useState<News[]>(mockNews);
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [properties, setProperties] = useState<Property[]>(mockProperties);
    const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(mockEmergencyContacts);
    const [serviceGuides, setServiceGuides] = useState<ServiceGuide[]>(mockServiceGuides);
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);

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

    // Transportation State
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

    const handleUpdateReview = useCallback((serviceId: number, reviewId: number, newComment: string) => {
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                return {
                    ...s,
                    reviews: s.reviews.map(r => r.id === reviewId ? { ...r, comment: newComment } : r)
                };
            }
            return s;
        }));
    }, []);

    const handleDeleteReview = useCallback((serviceId: number, reviewId: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) {
            setServices(prevServices => prevServices.map(s => {
                if (s.id === serviceId) {
                    return { ...s, reviews: s.reviews.filter(r => r.id !== reviewId) };
                }
                return s;
            }));
        }
    }, []);

    const handleReplyToReview = useCallback((serviceId: number, reviewId: number, reply: string) => {
        setServices(prevServices => prevServices.map(s => {
            if (s.id === serviceId) {
                return { ...s, reviews: s.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r) };
            }
            return s;
        }));
    }, []);

    const handleSaveService = useCallback((serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => {
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
    }, []);

    const handleDeleteService = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) {
            setServices(prevServices => prevServices.filter(s => s.id !== id));
        }
    }, []);

    const handleToggleFavorite = useCallback((serviceId: number) => {
        setServices(prevServices => prevServices.map(s => 
            s.id === serviceId ? { ...s, isFavorite: !s.isFavorite } : s
        ));
    }, []);

    const handleSaveNews = useCallback((newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => {
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
    }, []);

    const handleDeleteNews = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الخبر؟')) {
            setNews(prevNews => prevNews.filter(n => n.id !== id));
        }
    }, []);
    
    const handleSaveNotification = useCallback((notification: Omit<Notification, 'id'> & { id?: number }) => {
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
    }, []);

    const handleDeleteNotification = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإشعار؟')) {
            setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
        }
    }, []);

    const handleSaveProperty = useCallback((property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => {
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
    }, []);

    const handleDeleteProperty = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            setProperties(prevProperties => prevProperties.filter(p => p.id !== id));
        }
    }, []);
    
    const handleSaveEmergencyContact = useCallback((contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }) => {
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
    }, []);
    
    const handleDeleteEmergencyContact = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الرقم؟')) {
            setEmergencyContacts(prevContacts => prevContacts.filter(c => c.id !== id));
        }
    }, []);
    
    const handleSaveServiceGuide = useCallback((guideData: Omit<ServiceGuide, 'id'> & { id?: number }) => {
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
    }, []);
    
    const handleDeleteServiceGuide = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الدليل؟')) {
            setServiceGuides(prevGuides => prevGuides.filter(g => g.id !== id));
        }
    }, []);

    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
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
    }, []);

    const handleDeleteUser = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    }, []);

    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: number }) => {
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
    }, []);

    const handleDeleteAdmin = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المدير؟')) {
            setAdmins(prev => prev.filter(a => a.id !== id));
        }
    }, []);

    // Transportation Handlers
    const handleSaveDriver = useCallback((driverData: Omit<Driver, 'id'> & { id?: number }) => {
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
    }, []);
    const handleDeleteDriver = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول.')) {
            const driverToRemove = internalDrivers.find(d => d.id === id);
            if(driverToRemove) {
                 setWeeklySchedule(s => s.map(day => ({ ...day, drivers: day.drivers.filter(d => d.name !== driverToRemove.name) })));
            }
            setInternalDrivers(prev => prev.filter(d => d.id !== id));
        }
    }, [internalDrivers]);
     const handleSaveRoute = useCallback((routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        setExternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                return [{ ...routeData, id: Date.now() }, ...prev];
            }
        });
    }, []);
    const handleDeleteRoute = useCallback((id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            setExternalRoutes(prev => prev.filter(r => r.id !== id));
        }
    }, []);
    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
    }, []);
     const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
    }, []);


    const value = useMemo(() => ({
        categories, services, news, notifications, properties, emergencyContacts, serviceGuides, users, admins,
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes },
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
        categories, services, news, notifications, properties, emergencyContacts, serviceGuides, users, admins,
        internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes,
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