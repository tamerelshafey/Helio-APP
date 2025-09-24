import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import {
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, mockWeeklySchedule, mockExternalRoutes
} from '../data/mock-data';
import type {
    Driver, WeeklyScheduleItem, Supervisor, ExternalRoute, TransportationContextType, ScheduleDriver
} from '../types';

const TransportationContext = createContext<TransportationContextType | undefined>(undefined);

export const TransportationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [internalSupervisor, setInternalSupervisor] = useState<Supervisor>(mockInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState<Supervisor>(mockExternalSupervisor);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(mockInternalDrivers);
    const [weeklySchedule, setWeeklySchedule] = useState<WeeklyScheduleItem[]>(mockWeeklySchedule);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(mockExternalRoutes);

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
    }, []);

     const handleSaveSupervisor = useCallback((type: 'internal' | 'external', supervisor: Supervisor) => {
        if (type === 'internal') {
            setInternalSupervisor(supervisor);
        } else {
            setExternalSupervisor(supervisor);
        }
    }, []);

    const value = useMemo(() => ({
        transportation: { internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes },
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor,
    }), [
        internalSupervisor, externalSupervisor, internalDrivers, weeklySchedule, externalRoutes,
        handleSaveDriver, handleDeleteDriver,
        handleSaveRoute, handleDeleteRoute,
        handleSaveSchedule, handleSaveSupervisor
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
