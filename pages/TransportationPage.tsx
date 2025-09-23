import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, PencilSquareIcon, CheckCircleIcon, XMarkIcon, PlusIcon, TrashIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';

// --- TYPES ---
interface Driver {
    id: number;
    name: string;
    phone: string;
    avatar: string;
}
interface ScheduleDriver {
    name: string;
    phone: string;
}
interface WeeklyScheduleItem {
    day: string;
    drivers: ScheduleDriver[];
}
interface ExternalRoute {
    id: number;
    name: string;
    timings: string[];
    waitingPoint: string;
}

// --- INITIAL DATA ---
const initialInternalSupervisor = { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' };
const initialExternalSupervisor = { name: 'أ. حسين فهمي', phone: '015-4321-0987' };
const initialInternalDrivers: Driver[] = [
    { id: 1, name: 'أحمد المصري', phone: '010-1111-2222', avatar: 'https://picsum.photos/200/200?random=1' },
    { id: 2, name: 'خالد عبدالله', phone: '011-2222-3333', avatar: 'https://picsum.photos/200/200?random=3' },
    { id: 3, name: 'ياسر القحطاني', phone: '015-3333-4444', avatar: 'https://picsum.photos/200/200?random=7' },
    { id: 4, name: 'سعيد العويران', phone: '012-4444-5555', avatar: 'https://picsum.photos/200/200?random=8' },
];
const initialWeeklySchedule: WeeklyScheduleItem[] = [
    { day: 'الأحد', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] },
    { day: 'الإثنين', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }, { name: 'سعيد العويران', phone: '012-4444-5555' }] },
    { day: 'الثلاثاء', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
    { day: 'الأربعاء', drivers: [{ name: 'سعيد العويران', phone: '012-4444-5555' }] },
    { day: 'الخميس', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }, { name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
    { day: 'الجمعة', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] },
    { day: 'السبت', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
];
const initialExternalRoutes: ExternalRoute[] = [
    { id: 1, name: 'هليوبوليس الجديدة <> ميدان رمسيس', timings: ['07:00 ص', '09:00 ص', '02:00 م', '05:00 م'], waitingPoint: 'أمام البوابة الرئيسية للمدينة' },
    { id: 2, name: 'هليوبوليس الجديدة <> التجمع الخامس', timings: ['08:00 ص', '11:00 ص', '03:00 م', '06:00 م'], waitingPoint: 'بجوار مول سيتي بلازا' },
    { id: 3, name: 'هليوبوليس الجديدة <> مدينة نصر', timings: ['07:30 ص', '10:30 ص', '01:30 م', '04:30 م'], waitingPoint: 'أمام محطة الوقود' },
];


// --- HELPER COMPONENTS ---
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
        }
    }, [driver]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, ...formData, avatar: avatar[0] || 'https://picsum.photos/200/200?random=10' });
        onClose();
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
        }
    }, [route]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: route?.id, name: formData.name, waitingPoint: formData.waitingPoint, timings: formData.timings.split('\n').filter(t => t.trim()) });
        onClose();
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

// --- MAIN COMPONENT ---
const TransportationPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    
    // States
    const [internalSupervisor, setInternalSupervisor] = useState(initialInternalSupervisor);
    const [externalSupervisor, setExternalSupervisor] = useState(initialExternalSupervisor);
    const [isEditingInternal, setIsEditingInternal] = useState(false);
    const [isEditingExternal, setIsEditingExternal] = useState(false);
    const [internalDrivers, setInternalDrivers] = useState<Driver[]>(initialInternalDrivers);
    const [schedule, setSchedule] = useState<WeeklyScheduleItem[]>(initialWeeklySchedule);
    const [editedSchedule, setEditedSchedule] = useState(schedule);
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);
    const [externalRoutes, setExternalRoutes] = useState<ExternalRoute[]>(initialExternalRoutes);

    // Modal States
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<ExternalRoute | null>(null);

    // --- CRUD Handlers ---

    // Drivers
    const handleSaveDriver = (driverData: Omit<Driver, 'id'> & { id?: number }) => {
        setInternalDrivers(prev => {
            if (driverData.id) {
                // Update driver and cascade changes to schedule
                const oldDriver = prev.find(d => d.id === driverData.id);
                if (oldDriver && (oldDriver.name !== driverData.name || oldDriver.phone !== driverData.phone)) {
                    setSchedule(s => s.map(day => ({ ...day, drivers: day.drivers.map(d => d.name === oldDriver.name ? { name: driverData.name, phone: driverData.phone } : d) })));
                }
                return prev.map(d => d.id === driverData.id ? { ...d, ...driverData, id: d.id } : d);
            } else {
                const newDriver = { ...driverData, id: Date.now() };
                return [newDriver, ...prev];
            }
        });
    };
    const handleDeleteDriver = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السائق؟ سيتم إزالته من جميع الجداول.')) {
            const driverToRemove = internalDrivers.find(d => d.id === id);
            if(driverToRemove) {
                 setSchedule(s => s.map(day => ({ ...day, drivers: day.drivers.filter(d => d.name !== driverToRemove.name) })));
            }
            setInternalDrivers(prev => prev.filter(d => d.id !== id));
        }
    };

    // Routes
    const handleSaveRoute = (routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        setExternalRoutes(prev => {
            if (routeData.id) {
                return prev.map(r => r.id === routeData.id ? { ...r, ...routeData, id: r.id } : r);
            } else {
                return [{ ...routeData, id: Date.now() }, ...prev];
            }
        });
    };
    const handleDeleteRoute = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المسار؟')) {
            setExternalRoutes(prev => prev.filter(r => r.id !== id));
        }
    };

    // Schedule
    const handleEditScheduleToggle = () => {
        if (isEditingSchedule) {
            setSchedule(editedSchedule);
        } else {
            setEditedSchedule(JSON.parse(JSON.stringify(schedule)));
        }
        setIsEditingSchedule(!isEditingSchedule);
    };
    const handleCancelEditSchedule = () => setIsEditingSchedule(false);
    const handleScheduleDriverChange = (day: string, driverIndex: number, newDriverName: string) => {
        const driver = internalDrivers.find(d => d.name === newDriverName);
        if (!driver) return;
        setEditedSchedule(prev => prev.map(item => item.day === day ? { ...item, drivers: item.drivers.map((d, i) => i === driverIndex ? { name: newDriverName, phone: driver.phone } : d) } : item));
    };
    const handleAddDriverToSchedule = (day: string) => setEditedSchedule(prev => prev.map(item => item.day === day ? { ...item, drivers: [...item.drivers, { name: internalDrivers[0].name, phone: internalDrivers[0].phone }] } : item));
    const handleRemoveDriverFromSchedule = (day: string, driverIndex: number) => setEditedSchedule(prev => prev.map(item => item.day === day ? { ...item, drivers: item.drivers.filter((_, i) => i !== driverIndex) } : item));

    // --- Component Logic ---
    const getWeekRange = () => {
        const now = new Date();
        const first = now.getDate() - now.getDay();
        const last = first + 6;
        const firstday = new Date(new Date().setDate(first)).toLocaleDateString('ar-EG-u-nu-latn', { day: '2-digit', month: 'long' });
        const lastday = new Date(new Date().setDate(last)).toLocaleDateString('ar-EG-u-nu-latn', { day: '2-digit', month: 'long' });
        return { firstday, lastday };
    };
    const { firstday, lastday } = getWeekRange();
    const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const todayIndex = new Date().getDay();
    
    // Supervisor Card Component (defined inside to easily access state setters)
    const SupervisorCard: React.FC<{ supervisor: { name: string, phone: string }; setSupervisor: React.Dispatch<React.SetStateAction<{ name: string, phone: string }>>; isEditing: boolean; setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; title: string; }> = ({ supervisor, setSupervisor, isEditing, setIsEditing, title }) => {
        const [editedInfo, setEditedInfo] = useState(supervisor);
        const handleSave = () => { setSupervisor(editedInfo); setIsEditing(false); };
        const handleCancel = () => { setEditedInfo(supervisor); setIsEditing(false); };
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
                        <><button onClick={handleSave} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-full"><CheckCircleIcon className="w-5 h-5"/></button><button onClick={handleCancel} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><XMarkIcon className="w-5 h-5"/></button></>
                    ) : (
                        <><CallButton phone={supervisor.phone} /><button onClick={() => { setIsEditing(true); setEditedInfo(supervisor); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full"><PencilSquareIcon className="w-5 h-5"/></button></>
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
                        <SupervisorCard supervisor={internalSupervisor} setSupervisor={setInternalSupervisor} isEditing={isEditingInternal} setIsEditing={setIsEditingInternal} title="مشرف الباصات الداخلية" />
                        
                        <div>
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">قائمة السائقين</h2><button onClick={() => { setEditingDriver(null); setIsDriverModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4" /><span>إضافة سائق</span></button></div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead><tr><th className="p-3">السائق</th><th className="p-3">رقم الهاتف</th><th className="p-3">إجراءات</th></tr></thead>
                                    <tbody>
                                        {internalDrivers.map(driver => (
                                            <tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3"><div className="flex items-center gap-3"><img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/><span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span></div></td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td>
                                                <td className="p-3"><div className="flex items-center gap-2"><CallButton phone={driver.phone} /><button onClick={() => { setEditingDriver(driver); setIsDriverModalOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5"/></button><button onClick={() => handleDeleteDriver(driver.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5"/></button></div></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6" />الجدول الأسبوعي</h2><div className="flex gap-2"><button onClick={handleEditScheduleToggle} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors text-sm"><PencilSquareIcon className="w-4 h-4" /><span>{isEditingSchedule ? 'حفظ' : 'تعديل'}</span></button>{isEditingSchedule && (<button onClick={handleCancelEditSchedule} className="bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm">إلغاء</button>)}</div></div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md">
                                <div className="text-center mb-4"><h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">{`الأسبوع: ${firstday} - ${lastday}`}</h3></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
                                    {(isEditingSchedule ? editedSchedule : schedule).map((item, index) => (
                                        <div key={item.day} className={`p-3 rounded-lg min-h-[150px] ${index === todayIndex ? 'bg-cyan-50 dark:bg-cyan-900/50 border-2 border-cyan-500' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                            <h4 className={`font-bold text-center border-b pb-2 mb-2 ${index === todayIndex ? 'text-cyan-600 dark:text-cyan-300 border-cyan-300' : 'text-gray-700 dark:text-gray-300 border-slate-200 dark:border-slate-600'}`}>{item.day}</h4>
                                            <div className="flex flex-col gap-2">
                                                {item.drivers.map((driver, driverIndex) => (
                                                    <div key={driverIndex} className="text-xs p-1 rounded">
                                                        {isEditingSchedule ? (
                                                            <div className="flex items-center gap-1">
                                                                <select value={driver.name} onChange={(e) => handleScheduleDriverChange(item.day, driverIndex, e.target.value)} className="w-full text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-cyan-500">{internalDrivers.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}</select>
                                                                <button onClick={() => handleRemoveDriverFromSchedule(item.day, driverIndex)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full"><TrashIcon className="w-3 h-3"/></button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">{driver.name}</div>
                                                        )}
                                                    </div>
                                                ))}
                                                {isEditingSchedule && (<button onClick={() => handleAddDriverToSchedule(item.day)} className="flex items-center justify-center gap-1 text-xs text-cyan-600 hover:text-cyan-700 py-1 mt-1 w-full bg-cyan-100 dark:bg-cyan-900/50 rounded"><PlusIcon className="w-3 h-3"/> إضافة</button>)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'external' && (
                    <div className="space-y-8">
                        <SupervisorCard supervisor={externalSupervisor} setSupervisor={setExternalSupervisor} isEditing={isEditingExternal} setIsEditing={setIsEditingExternal} title="مشرف الباصات الخارجية" />
                        <div className="flex justify-end"><button onClick={() => { setEditingRoute(null); setIsRouteModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4"/><span>إضافة مسار</span></button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {externalRoutes.map(route => (
                                <div key={route.id} className="group relative bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
                                     <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingRoute(route); setIsRouteModalOpen(true); }} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50"><PencilSquareIcon className="w-4 h-4" /></button>
                                        <button onClick={() => handleDeleteRoute(route.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                    <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                    <div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المواعيد:</h4><div className="flex flex-wrap gap-2">{route.timings.map(time => (<span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>))}</div></div>
                                    <div><h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>مكان الانتظار:</h4><p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <Modal isOpen={isDriverModalOpen} onClose={() => setIsDriverModalOpen(false)} title={editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}><DriverForm driver={editingDriver} onSave={handleSaveDriver} onClose={() => setIsDriverModalOpen(false)}/></Modal>
            <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title={editingRoute ? 'تعديل المسار' : 'إضافة مسار جديد'}><RouteForm route={editingRoute} onSave={handleSaveRoute} onClose={() => setIsRouteModalOpen(false)} /></Modal>
        </div>
    );
};

export default TransportationPage;
