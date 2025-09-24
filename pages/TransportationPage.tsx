import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, PencilSquareIcon, CheckCircleIcon, XMarkIcon, PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import { useTransportationContext } from '../context/TransportationContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import type { Driver, ExternalRoute, WeeklyScheduleItem, Supervisor, ScheduleDriver } from '../types';

// --- HELPER & FORM COMPONENTS ---

const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button onClick={onClick} className={`px-6 py-3 font-semibold rounded-t-lg transition-colors focus:outline-none ${active ? 'bg-white dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500' : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'}`}>
        {children}
    </button>
);

const DriverForm: React.FC<{ driver: Driver | null; onSave: (driver: Omit<Driver, 'id'> & { id?: number }) => void; onClose: () => void; }> = ({ driver, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const [avatar, setAvatar] = useState<string[]>([]);
    useEffect(() => {
        if (driver) {
            setFormData({ name: driver.name, phone: driver.phone });
            setAvatar([driver.avatar]);
        } else {
            setFormData({ name: '', phone: '' });
            setAvatar([]);
        }
    }, [driver]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, ...formData, avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}` });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم السائق</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">رقم الهاتف</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="الصورة الرمزية" />
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button></div>
        </form>
    );
};

const RouteForm: React.FC<{ route: ExternalRoute | null; onSave: (route: Omit<ExternalRoute, 'id'> & { id?: number }) => void; onClose: () => void; }> = ({ route, onSave, onClose }) => {
    const [formData, setFormData] = useState({ name: '', timings: '', waitingPoint: '' });
    useEffect(() => {
        if (route) {
            setFormData({ name: route.name, timings: route.timings.join('\n'), waitingPoint: route.waitingPoint });
        } else {
             setFormData({ name: '', timings: '', waitingPoint: '' });
        }
    }, [route]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id, name: formData.name, waitingPoint: formData.waitingPoint, timings: formData.timings.split('\n').filter(t => t.trim()) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المسار</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">نقطة الانتظار</label><input type="text" value={formData.waitingPoint} onChange={(e) => setFormData({ ...formData, waitingPoint: e.target.value })} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المواعيد (كل موعد في سطر)</label><textarea value={formData.timings} onChange={(e) => setFormData({ ...formData, timings: e.target.value })} required rows={4} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button></div>
        </form>
    );
};

const ScheduleCalendar: React.FC = () => {
    const { transportation, handleSaveOverride, handleResetOverride, handleSaveSchedule } = useTransportationContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول الباصات']);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [isDayModalOpen, setDayModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isWeekModalOpen, setWeekModalOpen] = useState(false);

    const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    
    const { monthDays, firstDayOfMonth } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
        return { monthDays: days, firstDayOfMonth: firstDay.getDay() };
    }, [currentDate]);

    const getDriversForDate = useCallback((date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        const override = transportation.scheduleOverrides.find(o => o.date === dateString);
        if (override) {
            return override.drivers;
        }
        const dayName = daysOfWeek[date.getDay()];
        const scheduleDay = transportation.weeklySchedule.find(d => d.day === dayName);
        return scheduleDay ? scheduleDay.drivers : [];
    }, [transportation.scheduleOverrides, transportation.weeklySchedule, daysOfWeek]);

    const changeMonth = (offset: number) => {
        setCurrentDate(d => {
            const newDate = new Date(d);
            newDate.setMonth(d.getMonth() + offset);
            return newDate;
        });
    };
    
    const handleDayClick = (date: Date) => {
        if (!canManage) return;
        setSelectedDate(date);
        setDayModalOpen(true);
    };

    const DayScheduleModal: React.FC<{ date: Date; onClose: () => void; }> = ({ date, onClose }) => {
        const initialDrivers = getDriversForDate(date);
        const [selectedDrivers, setSelectedDrivers] = useState<ScheduleDriver[]>(initialDrivers);

        const handleDriverToggle = (driver: ScheduleDriver) => {
            setSelectedDrivers(prev => {
                const isSelected = prev.some(d => d.name === driver.name);
                if (isSelected) {
                    return prev.filter(d => d.name !== driver.name);
                } else {
                    return [...prev, driver];
                }
            });
        };
        
        const handleSave = () => {
            const dateString = date.toISOString().split('T')[0];
            handleSaveOverride({ date: dateString, drivers: selectedDrivers });
            showToast('تم حفظ التعديل بنجاح!');
            onClose();
        };

        const handleReset = () => {
            const dateString = date.toISOString().split('T')[0];
            handleResetOverride(dateString);
            showToast('تمت إعادة اليوم إلى القالب الأسبوعي.');
            onClose();
        };

        return (
            <div className="space-y-4">
                <h4 className="font-bold">اختر السائقين المناوبين:</h4>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 rounded-md">
                    {transportation.internalDrivers.map(driver => {
                        const isSelected = selectedDrivers.some(d => d.name === driver.name);
                        return (
                            <button
                                key={driver.id}
                                onClick={() => handleDriverToggle({ name: driver.name, phone: driver.phone })}
                                className={`p-2 rounded-md text-sm border ${isSelected ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                            >
                                {driver.name}
                            </button>
                        );
                    })}
                </div>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md">إعادة إلى القالب</button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ</button>
                    </div>
                </div>
            </div>
        );
    };

    const WeeklyScheduleModal: React.FC<{ onClose: () => void; }> = ({ onClose }) => {
        const [schedule, setSchedule] = useState(transportation.weeklySchedule);
        
        const handleDriverToggle = (day: string, driver: ScheduleDriver) => {
            setSchedule(prev => prev.map(d => {
                if (d.day === day) {
                    const isSelected = d.drivers.some(dr => dr.name === driver.name);
                    const newDrivers = isSelected ? d.drivers.filter(dr => dr.name !== driver.name) : [...d.drivers, driver];
                    return { ...d, drivers: newDrivers };
                }
                return d;
            }));
        };

        const handleSave = () => {
            handleSaveSchedule(schedule);
            showToast('تم حفظ القالب الأسبوعي بنجاح!');
            onClose();
        };

        return (
            <div className="space-y-4">
                {schedule.map(dayItem => (
                    <div key={dayItem.day} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-bold mb-2">{dayItem.day}</h4>
                        <div className="flex flex-wrap gap-2">
                            {transportation.internalDrivers.map(driver => {
                                const isSelected = dayItem.drivers.some(d => d.name === driver.name);
                                return (
                                    <button
                                        key={driver.id}
                                        onClick={() => handleDriverToggle(dayItem.day, { name: driver.name, phone: driver.phone })}
                                        className={`px-3 py-1 rounded-full text-xs border ${isSelected ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                                    >
                                        {driver.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
                 <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ القالب</button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                <h2 className="text-xl font-bold flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6" /> جدول المناوبات الشهري</h2>
                {canManage && (
                    <button onClick={() => setWeekModalOpen(true)} className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        إدارة القالب الأسبوعي
                    </button>
                )}
            </div>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
                <span className="font-bold text-lg">{currentDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-500 dark:text-gray-400">
                {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border border-transparent"></div>)}
                {monthDays.map(date => {
                    const drivers = getDriversForDate(date);
                    const isOverride = transportation.scheduleOverrides.some(o => o.date === date.toISOString().split('T')[0]);
                    return (
                        <div key={date.toString()} onClick={() => handleDayClick(date)} className={`h-28 border border-slate-200 dark:border-slate-700 rounded-md p-2 text-right overflow-y-auto ${canManage ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}`}>
                            <span className={`font-bold text-sm ${isOverride ? 'text-cyan-500' : ''}`}>{date.getDate()}</span>
                            <ul className="text-xs mt-1 space-y-1">
                                {drivers.map((d, i) => <li key={i} className="bg-slate-100 dark:bg-slate-700 p-1 rounded-sm truncate">{d.name}</li>)}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {selectedDate && <Modal isOpen={isDayModalOpen} onClose={() => setDayModalOpen(false)} title={`تعديل جدول يوم: ${selectedDate.toLocaleDateString('ar-EG')}`}><DayScheduleModal date={selectedDate} onClose={() => setDayModalOpen(false)} /></Modal>}
            <Modal isOpen={isWeekModalOpen} onClose={() => setWeekModalOpen(false)} title="إدارة القالب الأسبوعي للمناوبات"><WeeklyScheduleModal onClose={() => setWeekModalOpen(false)} /></Modal>
        </div>
    );
};

// Main Page Component
const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const { transportation, handleSaveDriver, handleDeleteDriver, handleSaveRoute, handleDeleteRoute, handleSaveSupervisor } = useTransportationContext();
    const { showToast } = useUIContext();
    const canManage = useHasPermission(['مسؤول الباصات']);
    
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [isEditingInternal, setIsEditingInternal] = useState(false);
    const [isEditingExternal, setIsEditingExternal] = useState(false);

    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<ExternalRoute | null>(null);

    const handleSaveAndCloseDriver = (driverData: Omit<Driver, 'id'> & { id?: number }) => {
        const isNew = !driverData.id;
        handleSaveDriver(driverData);
        setIsDriverModalOpen(false);
        showToast(isNew ? 'تم إضافة السائق بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    };
    const confirmDeleteDriver = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول.')) {
            handleDeleteDriver(id);
            showToast('تم حذف السائق بنجاح!');
        }
    };
    const handleSaveAndCloseRoute = (routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        const isNew = !routeData.id;
        handleSaveRoute(routeData);
        setIsRouteModalOpen(false);
        showToast(isNew ? 'تم إضافة المسار بنجاح!' : 'تم حفظ التعديلات بنجاح!');
    };
    const confirmDeleteRoute = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            handleDeleteRoute(id);
            showToast('تم حذف المسار بنجاح!');
        }
    };
    const handleSaveSupervisorAndClose = (type: 'internal' | 'external', supervisor: Supervisor) => {
        handleSaveSupervisor(type, supervisor);
        type === 'internal' ? setIsEditingInternal(false) : setIsEditingExternal(false);
        showToast('تم حفظ بيانات المشرف بنجاح!');
    };

    const SupervisorCard: React.FC<{ supervisor: Supervisor; onSave: (supervisor: Supervisor) => void; isEditing: boolean; setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; title: string; }> = ({ supervisor, onSave, isEditing, setIsEditing, title }) => {
        const [editedInfo, setEditedInfo] = useState(supervisor);
        useEffect(() => setEditedInfo(supervisor), [supervisor]);

        return (
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 flex-grow">
                    <UserCircleIcon className="w-10 h-10 text-cyan-500 flex-shrink-0" />
                    {isEditing ? (
                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input type="text" value={editedInfo.name} onChange={(e) => setEditedInfo({ ...editedInfo, name: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 text-sm focus:ring-2 focus:ring-cyan-500" />
                             <input type="text" value={editedInfo.phone} onChange={(e) => setEditedInfo({ ...editedInfo, phone: e.target.value })} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-md p-2 text-sm font-mono focus:ring-2 focus:ring-cyan-500" />
                        </div>
                    ) : (
                        <div><h3 className="font-bold text-gray-800 dark:text-white">{supervisor.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{title}</p></div>
                    )}
                </div>
                 <div className="flex items-center gap-2 ml-4">
                    {isEditing ? (
                        <><button onClick={() => onSave(editedInfo)} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><CheckCircleIcon className="w-5 h-5"/></button><button onClick={() => setIsEditing(false)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XMarkIcon className="w-5 h-5"/></button></>
                    ) : (
                        <>
                            <CallButton phone={supervisor.phone} />
                            {canManage && <button onClick={() => setIsEditing(true)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilSquareIcon className="w-5 h-5"/></button>}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline"><ArrowLeftIcon className="w-5 h-5" /><span>العودة إلى لوحة التحكم</span></button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><BusIcon className="w-8 h-8" />إدارة الباصات</h1>

            <div className="border-b border-gray-200 dark:border-slate-700"><nav className="-mb-px flex gap-4" aria-label="Tabs"><TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton><TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton></nav></div>

            <div>
                {activeTab === 'internal' && (
                    <div className="space-y-8">
                        <SupervisorCard supervisor={transportation.internalSupervisor} onSave={(s) => handleSaveSupervisorAndClose('internal', s)} isEditing={isEditingInternal} setIsEditing={setIsEditingInternal} title="مشرف الباصات الداخلية" />
                        
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">قائمة السائقين</h2>
                                {canManage && <button onClick={() => { setEditingDriver(null); setIsDriverModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4"/><span>إضافة سائق</span></button>}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <tbody>
                                        {transportation.internalDrivers.map(driver => (
                                            <tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3"><div className="flex items-center gap-3"><img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/><span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span></div></td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td>
                                                <td className="p-3"><div className="flex gap-2">{canManage && <><button onClick={() => { setEditingDriver(driver); setIsDriverModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilSquareIcon className="w-5 h-5"/></button><button onClick={() => confirmDeleteDriver(driver.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button></>}<CallButton phone={driver.phone} /></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <ScheduleCalendar />
                    </div>
                )}
                {activeTab === 'external' && (
                    <div className="space-y-8">
                        <SupervisorCard supervisor={transportation.externalSupervisor} onSave={(s) => handleSaveSupervisorAndClose('external', s)} isEditing={isEditingExternal} setIsEditing={setIsEditingExternal} title="مشرف الباصات الخارجية" />
                        {canManage && <div className="flex justify-end"><button onClick={() => { setEditingRoute(null); setIsRouteModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4"/><span>إضافة مسار</span></button></div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transportation.externalRoutes.map(route => (
                                <div key={route.id} className="group relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
                                     {canManage && <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingRoute(route); setIsRouteModalOpen(true); }} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50"><PencilSquareIcon className="w-4 h-4" /></button>
                                        <button onClick={() => confirmDeleteRoute(route.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-4 h-4" /></button>
                                    </div>}
                                    <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                    <div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المواعيد:</h4><div className="flex flex-wrap gap-2">{route.timings.map(time => (<span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>))}</div></div>
                                    <div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>مكان الانتظار:</h4><p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isDriverModalOpen} onClose={() => setIsDriverModalOpen(false)} title={editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}><DriverForm driver={editingDriver} onSave={handleSaveAndCloseDriver} onClose={() => setIsDriverModalOpen(false)}/></Modal>
            <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title={editingRoute ? 'تعديل المسار' : 'إضافة مسار جديد'}><RouteForm route={editingRoute} onSave={handleSaveAndCloseRoute} onClose={() => setIsRouteModalOpen(false)} /></Modal>
        </div>
    );
};

export default TransportationPage;
