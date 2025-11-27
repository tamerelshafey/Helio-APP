import { 
    mockInternalSupervisor, mockExternalSupervisor, mockInternalDrivers, 
    mockInternalRoutes, mockWeeklySchedule, mockExternalRoutes, mockScheduleOverrides 
} from '../data/mock-data';
import type { 
    Driver, InternalRoute, ExternalRoute, WeeklyScheduleItem, 
    ScheduleOverride, Supervisor 
} from '../types';

// Simulate backend storage
let internalDrivers = JSON.parse(JSON.stringify(mockInternalDrivers));
let internalRoutes = JSON.parse(JSON.stringify(mockInternalRoutes));
let externalRoutes = JSON.parse(JSON.stringify(mockExternalRoutes));
let weeklySchedule = JSON.parse(JSON.stringify(mockWeeklySchedule));
let scheduleOverrides = JSON.parse(JSON.stringify(mockScheduleOverrides));
let supervisors = {
    internal: JSON.parse(JSON.stringify(mockInternalSupervisor)),
    external: JSON.parse(JSON.stringify(mockExternalSupervisor))
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Drivers ---
export const getDrivers = async (): Promise<Driver[]> => {
    await delay(300);
    return [...internalDrivers];
};

export const saveDriver = async (driverData: Omit<Driver, 'id'> & { id?: number }): Promise<Driver> => {
    await delay(500);
    if (driverData.id) {
        // Update
        internalDrivers = internalDrivers.map((d: Driver) => d.id === driverData.id ? { ...d, ...driverData } : d);
        return internalDrivers.find((d: Driver) => d.id === driverData.id)!;
    } else {
        // Create
        const newDriver = { ...driverData, id: Date.now(), avatar: driverData.avatar || `https://picsum.photos/200/200?random=${Date.now()}` };
        internalDrivers.push(newDriver);
        return newDriver;
    }
};

export const deleteDriver = async (id: number): Promise<void> => {
    await delay(400);
    internalDrivers = internalDrivers.filter((d: Driver) => d.id !== id);
};

// --- Routes ---
export const getInternalRoutes = async (): Promise<InternalRoute[]> => {
    await delay(300);
    return [...internalRoutes];
};

export const saveInternalRoute = async (routeData: Omit<InternalRoute, 'id'> & { id?: number }): Promise<InternalRoute> => {
    await delay(500);
    if (routeData.id) {
        internalRoutes = internalRoutes.map((r: InternalRoute) => r.id === routeData.id ? { ...r, ...routeData } : r);
        return internalRoutes.find((r: InternalRoute) => r.id === routeData.id)!;
    } else {
        const newRoute = { ...routeData, id: Date.now() };
        internalRoutes.push(newRoute);
        return newRoute;
    }
};

export const deleteInternalRoute = async (id: number): Promise<void> => {
    await delay(400);
    internalRoutes = internalRoutes.filter((r: InternalRoute) => r.id !== id);
};

export const getExternalRoutes = async (): Promise<ExternalRoute[]> => {
    await delay(300);
    return [...externalRoutes];
};

export const saveExternalRoute = async (routeData: Omit<ExternalRoute, 'id'> & { id?: number }): Promise<ExternalRoute> => {
    await delay(500);
    if (routeData.id) {
        externalRoutes = externalRoutes.map((r: ExternalRoute) => r.id === routeData.id ? { ...r, ...routeData } : r);
        return externalRoutes.find((r: ExternalRoute) => r.id === routeData.id)!;
    } else {
        const newRoute = { ...routeData, id: Date.now() };
        externalRoutes.push(newRoute);
        return newRoute;
    }
};

export const deleteExternalRoute = async (id: number): Promise<void> => {
    await delay(400);
    externalRoutes = externalRoutes.filter((r: ExternalRoute) => r.id !== id);
};

// --- Schedule ---
export const getWeeklySchedule = async (): Promise<WeeklyScheduleItem[]> => {
    await delay(300);
    return [...weeklySchedule];
};

export const saveWeeklySchedule = async (schedule: WeeklyScheduleItem[]): Promise<WeeklyScheduleItem[]> => {
    await delay(500);
    weeklySchedule = schedule;
    return weeklySchedule;
};

export const getScheduleOverrides = async (): Promise<ScheduleOverride[]> => {
    await delay(300);
    return [...scheduleOverrides];
};

export const saveScheduleOverride = async (override: ScheduleOverride): Promise<ScheduleOverride> => {
    await delay(400);
    const index = scheduleOverrides.findIndex((o: ScheduleOverride) => o.date === override.date);
    if (index > -1) {
        scheduleOverrides[index] = override;
    } else {
        scheduleOverrides.push(override);
    }
    return override;
};

export const deleteScheduleOverride = async (date: string): Promise<void> => {
    await delay(300);
    scheduleOverrides = scheduleOverrides.filter((o: ScheduleOverride) => o.date !== date);
};

// --- Supervisors ---
export const getSupervisors = async (): Promise<{ internal: Supervisor, external: Supervisor }> => {
    await delay(300);
    return { ...supervisors };
};

export const saveSupervisor = async (type: 'internal' | 'external', data: Supervisor): Promise<Supervisor> => {
    await delay(400);
    supervisors[type] = data;
    return data;
};