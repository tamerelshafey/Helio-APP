import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import {
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, 
    mockExternalRoutes, mockScheduleOverrides, mockInternalRoutes
} from '../data/mock-data';
import type {
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute, TransportationContextType, 
    ScheduleDriver, ScheduleOverride, InternalRoute
} from '../types';

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const TransportationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();

    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [internalRoutes, setInternalRoutes] = useState<InternalRoute[]>(mockInternalRoutes);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);
    const [scheduleOverrides, setScheduleOverrides] = useState<ScheduleOverride[]>(mockScheduleOverrides);

    const handleSaveDriver = useCallback((driverData: Omit<Driver, 'id'> & { id?: number }) => {
        setInternalDrivers(prev => {
            if (driverData.id) {
                const oldDriver = prev.find(d => d.id === driverData.id);
                // Update schedule if driver info changed
                if (oldDriver && (oldDriver.name !== driverData.name || oldDriver.phone !== driverData.phone)) {
                     setWeeklySchedule(s => s.map(day => ({ 
                        ...day, 
                        drivers: day.drivers.map(d => d.name === oldDriver.name ? { name: driverData.name, phone: driverData.phone } : d) 
                    })));
                     setScheduleOverrides(o => o.map(day => ({ 
                        ...day, 
                        drivers: day.drivers.map(d => d.name === oldDriver.name ? { name: driverData.name, phone: driverData.phone } : d) 
                    })));
                }
                return prev.map(d => d.id === driverData.id ? { ...d, ...driverData, id: d.id } : d);
            } else {
                const newDriver: Driver = { ...driverData, id: Date.now(), avatar: driverData.avatar || `https://picsum.photos/200/200?random=${Date.now()}` };
                return [newDriver, ...prev];
            }
        });
        logActivity(driverData.id ? 'تعديل سائق' : 'إضافة سائق', `تم حفظ بيانات السائق: ${driverData.name}`);
    }, [logActivity]);

    const handleDeleteDriver = useCallback((id: number) => {
        const driver = internalDrivers.find(d => d.id === id);
        if(!driver) return;
        
        // Remove driver from schedules
        setWeeklySchedule(s => s.map(day => ({ 
            ...day, 
            drivers: day.drivers.filter(d => d.name !== driver.name) 
        })));
        setScheduleOverrides(o => o.map(day => ({ 
            ...day, 
            drivers: day.drivers.filter(d => d.name !== driver.name) 
        })));

        setInternalDrivers(prev => prev.filter(d => d.id !== id));
        logActivity('حذف سائق', `تم حذف السائق: ${driver.name}`);
    }, [internalDrivers, logActivity]);

     const handleSaveRoute = useCallback((routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        setExternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                const newRoute: ExternalRoute = { ...routeData, id: Date.now() };
                return [newRoute, ...prev];
            }
        });
        logActivity(routeData.id ? 'تعديل مسار خارجي' : 'إضافة مسار خارجي', `تم حفظ المسار: ${routeData.name}`);
    }, [logActivity]);

    const handleDeleteRoute = useCallback((id: number) => {
        const route = externalRoutes.find(r => r.id === id);
        setExternalRoutes(prev => prev.filter(r => r.id !== id));
        if (route) {
            logActivity('حذف مسار خارجي', `تم حذف المسار: ${route.name}`);
        }
    }, [externalRoutes, logActivity]);

    const handleSaveInternalRoute = useCallback((routeData: Omit<InternalRoute, 'id'> & { id?: number }) => {
        setInternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                const newRoute: InternalRoute = { ...routeData, id: Date.now() };
                return [newRoute, ...prev];
            }
        });
        logActivity(routeData.id ? 'تعديل مسار داخلي' : 'إضافة مسار داخلي', `تم حفظ المسار: ${routeData.name}`);
    }, [logActivity]);

    const handleDeleteInternalRoute = useCallback((id: number) => {
        const route = internalRoutes.find(r => r.id === id);
        setInternalRoutes(prev => prev.filter(r => r.id !== id));
        if (route) {
            logActivity('حذف مسار داخلي', `تم حذف المسار: ${route.name}`);
        }
    }, [internalRoutes, logActivity]);

    const handleSaveSchedule = useCallback((schedule: WeeklyScheduleItem[]) => {
        setWeeklySchedule(schedule);
        logActivity('تحديث قالب الجدول', 'تم تحديث القالب الأسبوعي لمناوبات السائقين.');
    }, [logActivity]);

     const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
        logActivity('تحديث بيانات مشرف', `تم تحديث بيانات المشرف ${type === 'internal' ? 'الداخلي' : 'الخارجي'}.`);
    }, [logActivity]);

    const handleSaveOverride = useCallback((override: ScheduleOverride) => {
        setScheduleOverrides(prev => {
            const existingIndex = prev.findIndex(o => o.date === override.date);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex] = override;
                return updated;
            }
            return [...prev, override];
        });
        logActivity('تعديل جدول مخصص', `تعديل جدول يوم: ${override.date}`);
    }, [logActivity]);

    const handleResetOverride = useCallback((date: string) => {
        setScheduleOverrides(prev => prev.filter(o => o.date !== date));
        logActivity('إعادة تعيين جدول مخصص', `إعادة تعيين جدول يوم: ${date} إلى القالب الأسبوعي`);
    }, [logActivity]);


    const value = useMemo(() => ({
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, internalRoutes, weeklySchedule, externalRoutes, scheduleOverrides },
        handleSaveDriver, handleDeleteDriver,
        handleSaveInternalRoute, handleDeleteInternalRoute,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
        handleSaveOverride, handleResetOverride,
    }), [
        internalSupervisor, externalSupervisor, internalDrivers, internalRoutes, weeklySchedule, externalRoutes, scheduleOverrides,
        handleSaveDriver, handleDeleteDriver, handleSaveInternalRoute, handleDeleteInternalRoute, handleSaveRoute, handleDeleteRoute, handleSaveSchedule, 
        handleSaveSupervisor, handleSaveOverride, handleResetOverride
    ]);

    return <TransportationContext.Provider value={value}>{children}</TransportationContext.Provider>;
};

export const useTransportationContext = (): TransportationContextType => {
    const context = useContext(TransportationContext);
    if (context === undefined) {
        throw new Error('useTransportationContext must be used within a TransportationProvider');
    }
    return context;
};
