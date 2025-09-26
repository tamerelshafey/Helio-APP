import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, PencilSquareIcon, PlusIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/common/Icons';
import { useTransportationContext } from '../context/TransportationContext';
import { useUIContext } from '../context/UIContext';
import { useHasPermission } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import TabButton from '../components/common/TabButton';
import type { Driver, WeeklyScheduleItem, ScheduleDriver, ScheduleOverride, ExternalRoute, Supervisor } from '../types';

// Helper Components
const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

// Form Modals
const SupervisorForm: React.FC<{ supervisor: Supervisor; onSave: (supervisor: Supervisor) => void; onClose: () => void; }> = ({ supervisor, onSave, onClose }) => {
    const [name, setName] = useState(supervisor.name);
    const [phone, setPhone] = useState(supervisor.phone);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ name, phone }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">الاسم</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div><label className="block text-sm font-medium">رقم الهاتف</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" /></div>
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button></div>
        </form>
    );
};

const DriverForm: React.FC<{ driver: Driver | null; onSave: (driver: Omit<Driver, 'id'> & { id?: number }) => void; onClose: () => void; }> = ({ driver, onSave, onClose }) => {
    const [name, setName] = useState(driver?.name || '');
    const [phone, setPhone] = useState(driver?.phone || '');
    const [avatar, setAvatar] = useState<string[]>(driver?.avatar ? [driver.avatar] : []);
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave({ id: driver?.id, name, phone, avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}` }); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium">الاسم</label><input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
            <div><label className="block text-sm font-medium">رقم الهاتف</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
            <ImageUploader initialImages={avatar} onImagesChange={setAvatar} multiple={false} label="صورة السائق" />
            <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button></div>
        </form>
    );
};

// Calendar & Schedule Components
const ScheduleTemplateModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    schedule: WeeklyScheduleItem[];
    drivers: Driver[];
    onSave: (newSchedule: WeeklyScheduleItem[]) => void;
}> = ({ isOpen, onClose, schedule, drivers, onSave }) => {
    const [localSchedule, setLocalSchedule] = useState<WeeklyScheduleItem[]>([]);
    
    React.useEffect(() => {
        setLocalSchedule(JSON.parse(JSON.stringify(schedule))); // Deep copy to avoid mutation
    }, [schedule, isOpen]);

    const handleDriverToggle = (dayName: string, driver: ScheduleDriver) => {
        setLocalSchedule(currentSchedule => {
            return currentSchedule.map(dayItem => {
                if (dayItem.day === dayName) {
                    const driverExists = dayItem.drivers.some(d => d.name === driver.name);
                    const newDrivers = driverExists
                        ? dayItem.drivers.filter(d => d.name !== driver.name)
                        : [...dayItem.drivers, driver];
                    return { ...dayItem, drivers: newDrivers };
                }
                return dayItem;
            });
        });
    };
    
    const handleSubmit = () => {
        onSave(localSchedule);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="تعديل قالب الجدول الأسبوعي">
            <div className="space-y-4">
                {localSchedule.map(day => (
                    <div key={day.day} className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
                        <h4 className="font-bold mb-2">{day.day}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {drivers.map(driver => (
                                <label key={driver.id} className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={day.drivers.some(d => d.name === driver.name)}
                                        onChange={() => handleDriverToggle(day.day, { name: driver.name, phone: driver.phone })}
                                        className="form-checkbox h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                                    />
                                    {driver.name}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                    <button onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ القالب</button>
                </div>
            </div>
        </Modal>
    );
};

const OverrideDayModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    override: ScheduleOverride | undefined;
    drivers: Driver[];
    scheduleTemplate: WeeklyScheduleItem[];
    onSave: (override: ScheduleOverride) => void;
    onReset: (date: string) => void;
}> = ({ isOpen, onClose, date, override, drivers, scheduleTemplate, onSave, onReset }) => {
    const [selectedDrivers, setSelectedDrivers] = useState<ScheduleDriver[]>([]);
    const dateString = date?.toISOString().split('T')[0] || '';

    React.useEffect(() => {
        if(date) {
            const dayOfWeek = date.toLocaleDateString('ar-EG', { weekday: 'long' });
            const defaultDrivers = scheduleTemplate.find(d => d.day === dayOfWeek)?.drivers || [];
            setSelectedDrivers(override ? override.drivers : defaultDrivers);
        }
    }, [date, override, scheduleTemplate, isOpen]);
    
    if (!date) return null;

    const handleDriverToggle = (driver: ScheduleDriver) => {
        setSelectedDrivers(currentDrivers => {
            const driverExists = currentDrivers.some(d => d.name === driver.name);
            return driverExists
                ? currentDrivers.filter(d => d.name !== driver.name)
                : [...currentDrivers, driver];
        });
    };

    const handleSave = () => { onSave({ date: dateString, drivers: selectedDrivers }); };
    const handleReset = () => { onReset(dateString); };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`تعديل جدول يوم: ${date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}`}>
            <div className="space-y-4">
                 <div className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50">
                    <h4 className="font-bold mb-2">اختر السائقين المناوبين لهذا اليوم</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {drivers.map(driver => (
                            <label key={driver.id} className="flex items-center gap-2 text-sm p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedDrivers.some(d => d.name === driver.name)}
                                    onChange={() => handleDriverToggle({ name: driver.name, phone: driver.phone })}
                                    className="form-checkbox h-4 w-4 rounded text-cyan-600 focus:ring-cyan-500"
                                />
                                {driver.name}
                            </label>
                        ))}
                    </div>
                 </div>
                 <div className="flex justify-between gap-3 pt-4">
                    <button onClick={handleReset} className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900/50 rounded-md hover:bg-red-200">إعادة للجدول الافتراضي</button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">حفظ التعديل</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ARABIC_WEEK_DAYS_ORDER = ['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

const ScheduleCalendar: React.FC<{
    overrides: ScheduleOverride[];
    onDayClick: (date: Date) => void;
}> = ({ overrides, onDayClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToPrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    
    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startOffset = (firstDayOfMonth - 5 + 7) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const grid: (number | null)[] = [];
        for (let i = 0; i < startOffset; i++) { grid.push(null); }
        for (let day = 1; day <= daysInMonth; day++) { grid.push(day); }
        return grid;
    }, [currentDate]);

    const hasOverride = (day: number) => {
        const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return overrides.some(o => o.date === dateString);
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPrevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRightIcon className="w-5 h-5"/></button>
                <h3 className="font-bold text-lg">{ARABIC_MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeftIcon className="w-5 h-5"/></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {ARABIC_WEEK_DAYS_ORDER.map(day => <div key={day} className="font-semibold text-gray-500 dark:text-gray-400 py-2">{day}</div>)}
                {calendarGrid.map((day, index) => (
                    <div key={index} className="py-1 flex justify-center items-center">
                        {day && (
                            <button
                                onClick={() => onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                    hasOverride(day) 
                                    ? 'bg-cyan-500 text-white font-bold' 
                                    : 'hover:bg-cyan-100 dark:hover:bg-cyan-900/50'
                                }`}
                            >
                                {day}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main Page Component
const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const { transportation, handleSaveDriver, handleDeleteDriver, handleSaveSupervisor, handleSaveSchedule, handleSaveOverride, handleResetOverride } = useTransportationContext();
    const canManage = useHasPermission(['مسؤول النقل']);
    const { showToast } = useUIContext();
    
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    const [modalState, setModalState] = useState<{ type: 'driver' | 'supervisor' | 'template' | 'override' | null; data?: any }>({ type: null });

    const handleOpenModal = (type: 'driver' | 'supervisor' | 'template' | 'override', data?: any) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null });

    const handleSaveAndCloseDriver = (driver: Omit<Driver, 'id'> & { id?: number }) => { handleSaveDriver(driver); showToast(driver.id ? 'تم تعديل بيانات السائق!' : 'تم إضافة سائق جديد!'); handleCloseModal(); };
    const confirmDeleteDriver = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا السائق؟')) { handleDeleteDriver(id); showToast('تم حذف السائق!'); } };
    const handleSaveAndCloseSupervisor = (type: 'internal' | 'external', supervisor: Supervisor) => { handleSaveSupervisor(type, supervisor); showToast('تم تعديل بيانات المشرف!'); handleCloseModal(); };
    const handleSaveTemplate = (newSchedule: WeeklyScheduleItem[]) => { handleSaveSchedule(newSchedule); showToast('تم حفظ قالب الجدول الأسبوعي!'); handleCloseModal(); };
    const handleSaveDayOverride = (override: ScheduleOverride) => { handleSaveOverride(override); showToast(`تم حفظ التعديل ليوم ${override.date}`); handleCloseModal(); };
    const handleResetDayOverride = (date: string) => { handleResetOverride(date); showToast(`تمت إعادة تعيين جدول يوم ${date}`); handleCloseModal(); };
    
    const SupervisorCard: React.FC<{ supervisor: Supervisor; title: string; onEdit: () => void; }> = ({ supervisor, title, onEdit }) => (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3"><UserCircleIcon className="w-10 h-10 text-cyan-500" /><div><h3 className="font-bold text-gray-800 dark:text-white">{supervisor.name}</h3><p className="text-sm text-gray-500 dark:text-gray-400">{title}</p></div></div>
            <div className="flex items-center gap-2">{canManage && <button onClick={onEdit} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilSquareIcon className="w-5 h-5"/></button>}<CallButton phone={supervisor.phone} /></div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline"><ArrowLeftIcon className="w-5 h-5" /><span>العودة</span></button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3"><BusIcon className="w-8 h-8" />إدارة النقل</h1>
            <div className="border-b border-gray-200 dark:border-slate-700"><nav className="-mb-px flex gap-4" aria-label="Tabs"><TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton><TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton></nav></div>
            
            <div>
                {activeTab === 'internal' && (
                    <div className="space-y-8 animate-fade-in">
                        <SupervisorCard supervisor={transportation.internalSupervisor} title="مشرف الباصات الداخلية" onEdit={() => handleOpenModal('supervisor', { type: 'internal', data: transportation.internalSupervisor })} />
                        
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">قائمة السائقين</h2>{canManage && <button onClick={() => handleOpenModal('driver', null)} className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg"><PlusIcon className="w-4 h-4"/> إضافة سائق</button>}</div>
                            <div className="overflow-x-auto"><table className="w-full text-right"><thead><tr className="text-sm text-gray-600 dark:text-gray-400"><th className="p-3">السائق</th><th className="p-3">رقم الهاتف</th><th className="p-3">إجراء</th></tr></thead><tbody>{transportation.internalDrivers.map(driver => (<tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700"><td className="p-3"><div className="flex items-center gap-3"><img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/><span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span></div></td><td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td><td className="p-3 flex items-center gap-1">{canManage && (<><button onClick={() => handleOpenModal('driver', driver)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilSquareIcon className="w-5 h-5"/></button><button onClick={() => confirmDeleteDriver(driver.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-5 h-5"/></button></>)}<CallButton phone={driver.phone} /></td></tr>))}</tbody></table></div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6" /> قالب الجدول الأسبوعي</h2>{canManage && <button onClick={() => handleOpenModal('template')} className="flex items-center gap-2 text-sm bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg"><PencilSquareIcon className="w-4 h-4"/> تعديل القالب</button>}</div>
                            <div className="space-y-2">{transportation.weeklySchedule.map(item => (<div key={item.day} className="flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-700/50"><span className="font-semibold text-gray-800 dark:text-white">{item.day}</span><div className="flex flex-wrap gap-2 justify-end">{item.drivers.length > 0 ? item.drivers.map((d, i) => <span key={i} className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-full">{d.name}</span>) : <span className="text-xs text-gray-400">لا يوجد</span>}</div></div>))}</div>
                        </div>
                        
                        {canManage && (<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"><h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6 text-purple-500" /> تعديلات الجدول المخصصة</h2><p className="text-sm text-gray-500 dark:text-gray-400 mb-4">استخدم التقويم لوضع جدول مخصص ليوم معين بدلاً من الجدول الأسبوعي.</p><ScheduleCalendar overrides={transportation.scheduleOverrides} onDayClick={(date) => handleOpenModal('override', date)} /></div>)}
                    </div>
                )}
                {activeTab === 'external' && (
                    <div className="space-y-8 animate-fade-in">
                        <SupervisorCard supervisor={transportation.externalSupervisor} title="مشرف الباصات الخارجية" onEdit={() => handleOpenModal('supervisor', { type: 'external', data: transportation.externalSupervisor })}/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{transportation.externalRoutes.map(route => (<div key={route.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4"><h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3><div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المواعيد:</h4><div className="flex flex-wrap gap-2">{route.timings.map(time => <span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>)}</div></div><div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>مكان الانتظار:</h4><p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p></div></div>))}</div>
                    </div>
                )}
            </div>
            
            {/* Modals */}
            {modalState.type === 'driver' && <Modal isOpen={true} onClose={handleCloseModal} title={modalState.data ? 'تعديل سائق' : 'إضافة سائق'}><DriverForm driver={modalState.data} onSave={handleSaveAndCloseDriver} onClose={handleCloseModal}/></Modal>}
            {modalState.type === 'supervisor' && <Modal isOpen={true} onClose={handleCloseModal} title="تعديل بيانات المشرف"><SupervisorForm supervisor={modalState.data.data} onSave={(sup) => handleSaveAndCloseSupervisor(modalState.data.type, sup)} onClose={handleCloseModal}/></Modal>}
            {modalState.type === 'template' && <ScheduleTemplateModal isOpen={true} onClose={handleCloseModal} schedule={transportation.weeklySchedule} drivers={transportation.internalDrivers} onSave={handleSaveTemplate}/>}
            {modalState.type === 'override' && <OverrideDayModal isOpen={true} onClose={handleCloseModal} date={modalState.data} override={transportation.scheduleOverrides.find(o => o.date === modalState.data?.toISOString().split('T')[0])} drivers={transportation.internalDrivers} scheduleTemplate={transportation.weeklySchedule} onSave={handleSaveDayOverride} onReset={handleResetDayOverride} />}
        </div>
    );
};

export default TransportationPage;
