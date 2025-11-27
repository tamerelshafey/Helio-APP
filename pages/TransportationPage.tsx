import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getDrivers, saveDriver, deleteDriver,
    getInternalRoutes, saveInternalRoute, deleteInternalRoute,
    getExternalRoutes, saveExternalRoute, deleteExternalRoute,
    getWeeklySchedule, saveWeeklySchedule,
    getScheduleOverrides, saveScheduleOverride, deleteScheduleOverride,
    getSupervisors, saveSupervisor
} from '../api/transportationApi';
import {
    ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, MapPinIcon, PlusIcon,
    PencilSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon
} from '../components/common/Icons';
import type { Driver, ExternalRoute, Supervisor, ScheduleOverride, WeeklyScheduleItem, InternalRoute, ScheduleDriver } from '../types';
import Modal from '../components/common/Modal';
import TabButton from '../components/common/TabButton';
import { useHasPermission } from '../hooks/usePermissions';
import { useStore } from '../store';
import EmptyState from '../components/common/EmptyState';
import TransportationCalendar from '../components/transportation/TransportationCalendar';
import DriverForm from '../components/transportation/DriverForm';
import RouteForm from '../components/transportation/RouteForm';
import InternalRouteForm from '../components/transportation/InternalRouteForm';
import ScheduleOverrideForm from '../components/transportation/ScheduleOverrideForm';
import WeeklyTemplateForm from '../components/transportation/WeeklyTemplateForm';
import QueryStateWrapper from '../components/common/QueryStateWrapper';
import useDocumentTitle from '../hooks/useDocumentTitle';

const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

const SupervisorCard: React.FC<{ name: string; phone: string; title: string; icon: React.ReactNode; canManage: boolean; onEdit: () => void; }> = ({ name, phone, title, icon, canManage, onEdit }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                </div>
            </div>
            {canManage && <button onClick={onEdit} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><PencilSquareIcon className="w-5 h-5"/></button>}
        </div>
        <div className="mt-4 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
            <p className="text-sm font-mono text-gray-600 dark:text-gray-300">{phone}</p>
            <CallButton phone={phone} />
        </div>
    </div>
);

// Gets the date for the Friday of the given date's week
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // Sunday - 0, ... Friday - 5, Saturday - 6
    const diff = d.getDate() - (day + 2) % 7;
    return new Date(d.setDate(diff));
};

const InternalTransportTab: React.FC = () => {
    const queryClient = useQueryClient();
    const canManage = useHasPermission(['مسؤول النقل']);
    const showToast = useStore((state) => state.showToast);

    // Queries
    const driversQuery = useQuery({ queryKey: ['drivers'], queryFn: getDrivers });
    const internalRoutesQuery = useQuery({ queryKey: ['internalRoutes'], queryFn: getInternalRoutes });
    const weeklyScheduleQuery = useQuery({ queryKey: ['weeklySchedule'], queryFn: getWeeklySchedule });
    const overridesQuery = useQuery({ queryKey: ['scheduleOverrides'], queryFn: getScheduleOverrides });
    const supervisorsQuery = useQuery({ queryKey: ['supervisors'], queryFn: getSupervisors });

    const internalDrivers = driversQuery.data || [];
    const internalRoutes = internalRoutesQuery.data || [];
    const weeklySchedule = weeklyScheduleQuery.data || [];
    const scheduleOverrides = overridesQuery.data || [];
    const supervisor = supervisorsQuery.data?.internal || { name: '', phone: '' };

    const [modal, setModal] = useState<'driver' | 'override' | 'template' | 'internal_route' | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [editingInternalRoute, setEditingInternalRoute] = useState<InternalRoute | null>(null);
    const [overrideDate, setOverrideDate] = useState<string | null>(null);
    const [viewDate, setViewDate] = useState(new Date());

    // Mutations
    const saveDriverMutation = useMutation({
        mutationFn: saveDriver,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['drivers'] }); showToast('تم حفظ بيانات السائق.'); setModal(null); }
    });
    const deleteDriverMutation = useMutation({
        mutationFn: deleteDriver,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['drivers'] }); showToast('تم حذف السائق.'); }
    });
    const saveInternalRouteMutation = useMutation({
        mutationFn: saveInternalRoute,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['internalRoutes'] }); showToast('تم حفظ المسار.'); setModal(null); }
    });
    const deleteInternalRouteMutation = useMutation({
        mutationFn: deleteInternalRoute,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['internalRoutes'] }); showToast('تم حذف المسار.'); }
    });
    const saveOverrideMutation = useMutation({
        mutationFn: saveScheduleOverride,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['scheduleOverrides'] }); showToast('تم حفظ الجدول المخصص.'); setModal(null); }
    });
    const deleteOverrideMutation = useMutation({
        mutationFn: deleteScheduleOverride,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['scheduleOverrides'] }); showToast('تم إعادة تعيين اليوم.'); setModal(null); }
    });
    const saveScheduleMutation = useMutation({
        mutationFn: saveWeeklySchedule,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['weeklySchedule'] }); showToast('تم حفظ القالب الأسبوعي.'); setModal(null); }
    });

    const startOfWeek = getStartOfWeek(viewDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(day.getDate() + i);
        return day;
    });

    const openDriverModal = (driver: Driver | null) => { setEditingDriver(driver); setModal('driver'); };
    const openOverrideModal = (date: string) => { setOverrideDate(date); setModal('override'); };
    const openInternalRouteModal = (route: InternalRoute | null) => { setEditingInternalRoute(route); setModal('internal_route'); };

    const confirmDeleteDriver = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا السائق؟')) deleteDriverMutation.mutate(id); };
    const confirmDeleteInternalRoute = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) deleteInternalRouteMutation.mutate(id); };

    const getDriversForDay = (dateString: string): { drivers: ScheduleDriver[], isOverride: boolean } => {
        const override = scheduleOverrides.find(o => o.date === dateString);
        if (override) return { drivers: override.drivers, isOverride: true };
        
        const dayName = new Date(dateString).toLocaleString('ar-EG', { weekday: 'long' });
        const scheduleDay = weeklySchedule.find(d => d.day === dayName);
        return { drivers: scheduleDay?.drivers || [], isOverride: false };
    };

    return (
        <QueryStateWrapper queries={[driversQuery, internalRoutesQuery, weeklyScheduleQuery, overridesQuery, supervisorsQuery]}>
            <div className="space-y-8">
                <h2 className="text-2xl font-bold mb-4">المشرفون والسائقون</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-1 space-y-4">
                        <SupervisorCard
                            name={supervisor.name}
                            phone={supervisor.phone}
                            title="مشرف الباصات الداخلية"
                            icon={<UserCircleIcon className="w-10 h-10 text-cyan-500" />}
                            canManage={canManage}
                            onEdit={() => alert('Edit supervisor functionality placeholder')}
                        />
                    </div>
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="font-semibold text-gray-800 dark:text-white">قائمة السائقين</h3>
                            {canManage && <button onClick={() => openDriverModal(null)} className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-cyan-600"><PlusIcon className="w-4 h-4"/>إضافة</button>}
                        </div>
                        {internalDrivers.length > 0 ? (
                            <ul className="space-y-2">
                                {internalDrivers.map(driver => (
                                    <li key={driver.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <div className="flex items-center gap-3"><img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full object-cover"/><span className="font-medium">{driver.name}</span></div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono text-gray-500">{driver.phone}</span>
                                            {canManage && <><button onClick={() => openDriverModal(driver)}><PencilSquareIcon className="w-4 h-4 text-blue-500"/></button><button onClick={() => confirmDeleteDriver(driver.id)}><TrashIcon className="w-4 h-4 text-red-500"/></button></>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-sm text-gray-500 py-4">لم يتم إضافة سائقين بعد.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">خطوط السير الداخلية</h2>
                        {canManage && <button onClick={() => openInternalRouteModal(null)} className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-cyan-600"><PlusIcon className="w-4 h-4"/>إضافة مسار</button>}
                    </div>
                    
                    {internalRoutes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {internalRoutes.map(route => (
                                <div key={route.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4 relative group">
                                    {canManage && <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openInternalRouteModal(route)} className="p-1 rounded-full bg-slate-200 dark:bg-slate-700"><PencilSquareIcon className="w-4 h-4 text-blue-500"/></button><button onClick={() => confirmDeleteInternalRoute(route.id)} className="p-1 rounded-full bg-slate-200 dark:bg-slate-700"><TrashIcon className="w-4 h-4 text-red-500"/></button></div>}
                                     <div>
                                        <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">المواعيد: {route.timings.join(' | ')}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>المحطات:</h4>
                                        <ol className="list-decimal list-inside text-sm space-y-1">
                                            {route.stops.map(stop => <li key={stop}>{stop}</li>)}
                                        </ol>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<BusIcon className="w-16 h-16 text-slate-400"/>} title="لا توجد مسارات داخلية" message="ابدأ بإضافة أول مسار للباصات الداخلية."/>
                    )}
                </div>
                
                 <div>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">عرض الجدول الأسبوعي</h2>
                             {canManage && <button onClick={() => setModal('template')} className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md hover:bg-slate-300">تعديل القالب</button>}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <button onClick={() => setViewDate(d => new Date(d.setDate(d.getDate() - 7)))} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
                            <button onClick={() => setViewDate(new Date())} className="font-semibold px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300">هذا الأسبوع</button>
                            <button onClick={() => setViewDate(d => new Date(d.setDate(d.getDate() + 7)))} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
                            <span className="font-semibold text-gray-700 dark:text-gray-300 hidden sm:block">{startOfWeek.toLocaleDateString('ar-EG', {day:'numeric', month:'short'})} - {endOfWeek.toLocaleDateString('ar-EG', {day:'numeric', month:'short', year: 'numeric'})}</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full text-right">
                            <thead>
                                <tr className="text-sm text-gray-600 dark:text-gray-400">
                                    <th className="p-3">اليوم</th><th className="p-3">التاريخ</th><th className="p-3">السائقون المناوبون</th><th className="p-3">الحالة</th>{canManage && <th className="p-3">إجراء</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {daysOfWeek.map(day => {
                                    const dateString = day.toISOString().split('T')[0];
                                    const dayName = day.toLocaleDateString('ar-EG', { weekday: 'long' });
                                    const { drivers, isOverride } = getDriversForDay(dateString);

                                    return (
                                    <tr key={dateString} className="border-t border-slate-200 dark:border-slate-700">
                                        <td className="p-3 font-semibold text-gray-800 dark:text-white">{dayName}</td>
                                        <td className="p-3 text-gray-600 dark:text-gray-300">{day.toLocaleDateString('ar-EG', { day: '2-digit', month: 'long' })}</td>
                                        <td className="p-3 text-gray-800 dark:text-gray-200">{drivers.length > 0 ? drivers.map(d => d.name).join('، ') : 'لا يوجد'}</td>
                                        <td className="p-3">
                                             <span className={`px-2 py-1 text-xs font-medium rounded-full ${isOverride ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}>
                                                {isOverride ? 'جدول مخصص' : 'قالب أسبوعي'}
                                            </span>
                                        </td>
                                        {canManage && <td className="p-3"><button onClick={() => openOverrideModal(dateString)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"><PencilSquareIcon className="w-5 h-5"/></button></td>}
                                    </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">نظرة عامة شهرية</h2>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                        <TransportationCalendar 
                            weeklySchedule={weeklySchedule}
                            scheduleOverrides={scheduleOverrides}
                            onDayClick={canManage ? openOverrideModal : undefined} 
                        />
                    </div>
                </div>

                {canManage && <>
                    <Modal isOpen={modal === 'driver'} onClose={() => setModal(null)} title={editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}>
                        <DriverForm onSave={(d) => saveDriverMutation.mutate(d)} onClose={() => setModal(null)} driver={editingDriver} />
                    </Modal>
                    <Modal isOpen={modal === 'internal_route'} onClose={() => setModal(null)} title={editingInternalRoute ? 'تعديل المسار الداخلي' : 'إضافة مسار داخلي جديد'}>
                        <InternalRouteForm onSave={(r) => saveInternalRouteMutation.mutate(r)} onClose={() => setModal(null)} route={editingInternalRoute} />
                    </Modal>
                    <Modal isOpen={modal === 'override'} onClose={() => setModal(null)} title={`تعديل جدول يوم: ${overrideDate}`}>
                        {overrideDate && <ScheduleOverrideForm 
                            date={overrideDate} 
                            initialDrivers={getDriversForDay(overrideDate).drivers}
                            allDrivers={internalDrivers}
                            onSave={(o) => saveOverrideMutation.mutate(o)} 
                            onReset={(d) => deleteOverrideMutation.mutate(d)} 
                            onClose={() => setModal(null)} 
                        />}
                    </Modal>
                    <Modal isOpen={modal === 'template'} onClose={() => setModal(null)} title="تعديل قالب الجدول الأسبوعي">
                        <WeeklyTemplateForm 
                            initialSchedule={weeklySchedule}
                            drivers={internalDrivers}
                            onSave={(s) => saveScheduleMutation.mutate(s)} 
                            onClose={() => setModal(null)} 
                        />
                    </Modal>
                </>}
            </div>
        </QueryStateWrapper>
    );
};

const ExternalTransportTab = () => {
    const queryClient = useQueryClient();
    const canManage = useHasPermission(['مسؤول النقل']);
    const showToast = useStore((state) => state.showToast);

    const routesQuery = useQuery({ queryKey: ['externalRoutes'], queryFn: getExternalRoutes });
    const supervisorsQuery = useQuery({ queryKey: ['supervisors'], queryFn: getSupervisors });

    const externalRoutes = routesQuery.data || [];
    const supervisor = supervisorsQuery.data?.external || { name: '', phone: '' };

    const saveRouteMutation = useMutation({
        mutationFn: saveExternalRoute,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['externalRoutes'] }); showToast('تم حفظ المسار.'); setIsModalOpen(false); }
    });
    const deleteRouteMutation = useMutation({
        mutationFn: deleteExternalRoute,
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['externalRoutes'] }); showToast('تم حذف المسار.'); }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<ExternalRoute | null>(null);
    
    const openRouteModal = (route: ExternalRoute | null) => { setEditingRoute(route); setIsModalOpen(true); };
    const confirmDeleteRoute = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) deleteRouteMutation.mutate(id); };

    return (
        <QueryStateWrapper queries={[routesQuery, supervisorsQuery]}>
            <div className="space-y-8">
                <SupervisorCard
                    name={supervisor.name}
                    phone={supervisor.phone}
                    title="مشرف الباصات الخارجية"
                    icon={<UserCircleIcon className="w-10 h-10 text-purple-500" />}
                    canManage={canManage}
                    onEdit={() => alert('Edit supervisor functionality placeholder')}
                />

                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">خطوط الباصات الخارجية</h2>
                    {canManage && <button onClick={() => openRouteModal(null)} className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold px-3 py-1 rounded-md hover:bg-cyan-600"><PlusIcon className="w-4 h-4"/>إضافة خط</button>}
                </div>

                {externalRoutes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {externalRoutes.map(route => (
                            <div key={route.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4 relative group">
                                {canManage && <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => openRouteModal(route)} className="p-1 rounded-full bg-slate-200 dark:bg-slate-700"><PencilSquareIcon className="w-4 h-4 text-blue-500"/></button><button onClick={() => confirmDeleteRoute(route.id)} className="p-1 rounded-full bg-slate-200 dark:bg-slate-700"><TrashIcon className="w-4 h-4 text-red-500"/></button></div>}
                                 <div>
                                    <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">المواعيد: {route.timings.join(' | ')}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>نقطة الانتظار:</h4>
                                    <p className="text-sm">{route.waitingPoint}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState icon={<BusIcon className="w-16 h-16 text-slate-400"/>} title="لا توجد خطوط خارجية" message="ابدأ بإضافة أول خط باص خارجي."/>
                )}
                
                {canManage && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoute ? 'تعديل خط السير' : 'إضافة خط سير جديد'}><RouteForm onSave={(r) => saveRouteMutation.mutate(r)} onClose={() => setIsModalOpen(false)} route={editingRoute} /></Modal>}
            </div>
        </QueryStateWrapper>
    );
};

const TransportationPage: React.FC = () => {
    useDocumentTitle('إدارة النقل | Helio');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <BusIcon className="w-8 h-8" />
                إدارة النقل
            </h1>
            <div className="border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex gap-4" aria-label="Tabs">
                    <TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton>
                    <TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton>
                </nav>
            </div>
            <div>
                {activeTab === 'internal' && <InternalTransportTab />}
                {activeTab === 'external' && <ExternalTransportTab />}
            </div>
        </div>
    );
};

export default TransportationPage;