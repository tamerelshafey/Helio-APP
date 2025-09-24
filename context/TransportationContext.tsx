import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import {
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes, mockScheduleOverrides
} from '../data/mock-data';
import type {
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute, TransportationContextType, ScheduleDriver, ScheduleOverride
} from '../types';

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const TransportationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();

    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
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
                }
                return prev.map(d => d.id === driverData.id ? { ...d, ...driverData, id: d.id } : d);
            } else {
                const newDriver: Driver = { ...driverData, id: Date.now() };
                return [newDriver, ...prev];
            }
        });
    }, []);

    const handleDeleteDriver = useCallback((id: number) => {
        const driverName = internalDrivers.find(d => d.id === id)?.name;
        // Also remove driver from schedule
        if(driverName) {
             setWeeklySchedule(s => s.map(day => ({ 
                ...day, 
                drivers: day.drivers.filter(d => d.name !== driverName) 
            })));
        }
        setInternalDrivers(prev => prev.filter(d => d.id !== id));
    }, [internalDrivers]);

     const handleSaveRoute = useCallback((routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        setExternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                const newRoute: ExternalRoute = { ...routeData, id: Date.now() };
                return [newRoute, ...prev];
            }
        });
    }, []);

    const handleDeleteRoute = useCallback((id: number) => {
        setExternalRoutes(prev => prev.filter(r => r.id !== id));
    }, []);

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
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes, scheduleOverrides },
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
        handleSaveOverride, handleResetOverride,
    }), [
        internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes, scheduleOverrides,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
        handleSaveOverride, handleResetOverride
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