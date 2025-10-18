import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, PlusIcon,
    PencilSquareIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon
} from '../components/common/Icons';
import { useTransportationContext } from '../context/TransportationContext';
import type { Driver, ExternalRoute, Supervisor, ScheduleOverride, WeeklyScheduleItem } from '../types';
import Modal from '../components/common/Modal';
import TabButton from '../components/common/TabButton';
import { useHasPermission } from '../context/AuthContext';
import { useUIContext } from '../context/UIContext';
import ImageUploader from '../components/common/ImageUploader';
import EmptyState from '../components/common/EmptyState';
import TransportationCalendar from '../components/transportation/TransportationCalendar';
import DriverForm from '../components/transportation/DriverForm';
import RouteForm from '../components/transportation/RouteForm';
import ScheduleOverrideForm from '../components/transportation/ScheduleOverrideForm';
import WeeklyTemplateForm from '../components/transportation/WeeklyTemplateForm';

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

const TransportationPage: React.FC = () => {
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

// Gets the date for the Friday of the given date's week
const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay(); // Sunday - 0, ... Friday - 5, Saturday - 6
    const diff = d.getDate() - (day + 2) % 7;
    return new Date(d.setDate(diff));
};

const InternalTransportTab: React.FC = () => {
    const { transportation, handleSaveDriver, handleDeleteDriver, handleSaveSupervisor, handleSaveSchedule, handleSaveOverride, handleResetOverride } = useTransportationContext();
    const { internalSupervisor, internalDrivers, weeklySchedule, scheduleOverrides } = transportation;
    const canManage = useHasPermission(['مسؤول النقل']);
    const { showToast } = useUIContext();

    const [modal, setModal] = useState<'driver' | 'override' | 'template' | null>(null);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [overrideDate, setOverrideDate] = useState<string | null>(null);

    const [viewDate, setViewDate] = useState(new Date());

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
    
    const confirmDeleteDriver = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول الزمنية.')) {
            handleDeleteDriver(id);
            showToast('تم حذف السائق.');
        }
    };
    
    const handleSaveAndCloseDriver = (driver: Omit<Driver, 'id'> & { id?: number }) => {
        handleSaveDriver(driver);
        setModal(null);
        showToast('تم حفظ بيانات السائق.');
    };
    
    const handleSaveAndCloseOverride = (override: ScheduleOverride) => {
        handleSaveOverride(override);
        setModal(null);
        showToast('تم حفظ الجدول المخصص.');
    };

    const handleResetAndCloseOverride = (date: string) => {
        handleResetOverride(date);
        setModal(null);
        showToast('تمت إعادة تعيين اليوم إلى القالب الأسبوعي.');
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-4">المشرفون والسائقون</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 space-y-4">
                    <SupervisorCard
                        name={internalSupervisor.name}
                        phone={internalSupervisor.phone}
                        title="مشرف الباصات الداخلية"
                        icon={<UserCircleIcon className="w-10 h-10 text-cyan-500" />}
                        canManage={canManage}
                        onEdit={() => alert('Edit supervisor functionality to be added')}
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
                                const override = scheduleOverrides.find(o => o.date === dateString);
                                const drivers = override ? override.drivers : weeklySchedule.find(d => d.day === dayName)?.drivers || [];
                                const status: 'template' | 'override' = override ? 'override' : 'template';

                                return (
                                <tr key={dateString} className="border-t border-slate-200 dark:border-slate-700">
                                    <td className="p-3 font-semibold text-gray-800 dark:text-white">{dayName}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-300">{day.toLocaleDateString('ar-EG', { day: '2-digit', month: 'long' })}</td>
                                    <td className="p-3 text-gray-800 dark:text-gray-200">{drivers.length > 0 ? drivers.map(d => d.name).join('، ') : 'لا يوجد'}</td>
                                    <td className="p-3">
                                         <span className={`px-2 py-1 text-xs font-medium rounded-full ${status === 'override' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300'}`}>
                                            {status === 'override' ? 'جدول مخصص' : 'قالب أسبوعي'}
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
                    <TransportationCalendar onDayClick={canManage ? openOverrideModal : undefined} />
                </div>
            </div>

            {canManage && <>
                <Modal isOpen={modal === 'driver'} onClose={() => setModal(null)} title={editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}>
                    <DriverForm onSave={handleSaveAndCloseDriver} onClose={() => setModal(null)} driver={editingDriver} />
                </Modal>
                <Modal isOpen={modal === 'override'} onClose={() => setModal(null)} title={`تعديل جدول يوم: ${overrideDate}`}>
                    {overrideDate && <ScheduleOverrideForm date={overrideDate} onSave={handleSaveAndCloseOverride} onReset={handleResetAndCloseOverride} onClose={() => setModal(null)} drivers={internalDrivers} />}
                </Modal>
                <Modal isOpen={modal === 'template'} onClose={() => setModal(null)} title="تعديل قالب الجدول الأسبوعي">
                    <WeeklyTemplateForm onSave={(s: WeeklyScheduleItem[]) => { handleSaveSchedule(s); setModal(null); showToast('تم حفظ القالب الأسبوعي.'); }} onClose={() => setModal(null)} drivers={internalDrivers} />
                </Modal>
            </>}
        </div>
    );
};

const ExternalTransportTab = () => {
    const { transportation, handleSaveRoute, handleDeleteRoute } = useTransportationContext();
    const { externalSupervisor, externalRoutes } = transportation;
    const canManage = useHasPermission(['مسؤول النقل']);
    const { showToast } = useUIContext();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<ExternalRoute | null>(null);
    
    const openRouteModal = (route: ExternalRoute | null) => { setEditingRoute(route); setIsModalOpen(true); };
    const confirmDeleteRoute = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            handleDeleteRoute(id);
            showToast('تم حذف المسار.');
        }
    };
    const handleSaveAndCloseRoute = (route: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        handleSaveRoute(route);
        setIsModalOpen(false);
        showToast('تم حفظ المسار.');
    };

    return (
        <div className="space-y-8">
            <SupervisorCard
                name={externalSupervisor.name}
                phone={externalSupervisor.phone}
                title="مشرف الباصات الخارجية"
                icon={<UserCircleIcon className="w-10 h-10 text-purple-500" />}
                canManage={canManage}
                onEdit={() => alert('Edit supervisor functionality to be added')}
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
            
            {canManage && <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingRoute ? 'تعديل خط السير' : 'إضافة خط سير جديد'}><RouteForm onSave={handleSaveAndCloseRoute} onClose={() => setIsModalOpen(false)} route={editingRoute} /></Modal>}
        </div>
    );
};

export default TransportationPage;