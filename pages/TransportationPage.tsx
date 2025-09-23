import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon, PencilSquareIcon, CheckCircleIcon, XMarkIcon, PlusIcon, TrashIcon } from '../components/common/Icons';
import Modal from '../components/common/Modal';
import ImageUploader from '../components/common/ImageUploader';
import { useAppContext } from '../context/AppContext';
import type { Driver, ExternalRoute, WeeklyScheduleItem, Supervisor } from '../types';

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
        } else {
            setFormData({ name: '', phone: '' });
            setAvatar([]);
        }
    }, [driver]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: driver?.id, ...formData, avatar: avatar[0] || `https://picsum.photos/200/200?random=${Date.now()}` });
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
        } else {
             setFormData({ name: '', timings: '', waitingPoint: '' });
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
    const { 
        transportation, handleSaveDriver, handleDeleteDriver, 
        handleSaveRoute, handleDeleteRoute, handleSaveSchedule, handleSaveSupervisor
    } = useAppContext();
    
    const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
    
    const [isEditingInternal, setIsEditingInternal] = useState(false);
    const [isEditingExternal, setIsEditingExternal] = useState(false);
    
    const [editedSchedule, setEditedSchedule] = useState<WeeklyScheduleItem[]>(transportation.weeklySchedule);
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);
    
    // Modal States
    const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [editingRoute, setEditingRoute] = useState<ExternalRoute | null>(null);

    useEffect(() => {
        setEditedSchedule(transportation.weeklySchedule);
    }, [transportation.weeklySchedule]);
    

    // --- CRUD Handlers ---
    const handleSaveAndCloseDriver = (driverData: Omit<Driver, 'id'> & { id?: number }) => {
        handleSaveDriver(driverData);
        setIsDriverModalOpen(false);
    };
    const handleSaveAndCloseRoute = (routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => {
        handleSaveRoute(routeData);
        setIsRouteModalOpen(false);
    };

    // Schedule
    const handleEditScheduleToggle = () => {
        if (isEditingSchedule) {
            handleSaveSchedule(editedSchedule);
        } else {
            setEditedSchedule(JSON.parse(JSON.stringify(transportation.weeklySchedule)));
        }
        setIsEditingSchedule(!isEditingSchedule);
    };
    const handleCancelEditSchedule = () => setIsEditingSchedule(false);
    const handleScheduleDriverChange = (day: string, driverIndex: number, newDriverName: string) => {
        const driver = transportation.internalDrivers.find(d => d.name === newDriverName);
        if (!driver) return;
        setEditedSchedule(prev => prev.map(item => item.day === day ? { ...item, drivers: item.drivers.map((d, i) => i === driverIndex ? { name: newDriverName, phone: driver.phone } : d) } : item));
    };
    const handleAddDriverToSchedule = (day: string) => {
        if (transportation.internalDrivers.length === 0) return;
        setEditedSchedule(prev => prev.map(item => item.day === day ? { ...item, drivers: [...item.drivers, { name: transportation.internalDrivers[0].name, phone: transportation.internalDrivers[0].phone }] } : item));
    };
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
    const todayIndex = new Date().getDay();
    
    // Supervisor Card Component
    const SupervisorCard: React.FC<{ supervisor: Supervisor; onSave: (supervisor: Supervisor) => void; isEditing: boolean; setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; title: string; }> = ({ supervisor, onSave, isEditing, setIsEditing, title }) => {
        const [editedInfo, setEditedInfo] = useState(supervisor);
        const handleSave = () => { onSave(editedInfo); setIsEditing(false); };
        const handleCancel = () => { setEditedInfo(supervisor); setIsEditing(false); };
        
        useEffect(() => {
            setEditedInfo(supervisor);
        }, [supervisor]);

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
                        <SupervisorCard supervisor={transportation.internalSupervisor} onSave={(s) => handleSaveSupervisor('internal', s)} isEditing={isEditingInternal} setIsEditing={setIsEditingInternal} title="مشرف الباصات الداخلية" />
                        
                        <div>
                            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">قائمة السائقين</h2><button onClick={() => { setEditingDriver(null); setIsDriverModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4" /><span>إضافة سائق</span></button></div>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead><tr><th className="p-3">السائق</th><th className="p-3">رقم الهاتف</th><th className="p-3">إجراءات</th></tr></thead>
                                    <tbody>
                                        {transportation.internalDrivers.map(driver => (
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
                                    {(isEditingSchedule ? editedSchedule : transportation.weeklySchedule).map((item, index) => (
                                        <div key={item.day} className={`p-3 rounded-lg min-h-[150px] ${index === todayIndex ? 'bg-cyan-50 dark:bg-cyan-900/50 border-2 border-cyan-500' : 'bg-slate-50 dark:bg-slate-700/50'}`}>
                                            <h4 className={`font-bold text-center border-b pb-2 mb-2 ${index === todayIndex ? 'text-cyan-600 dark:text-cyan-300 border-cyan-300' : 'text-gray-700 dark:text-gray-300 border-slate-200 dark:border-slate-600'}`}>{item.day}</h4>
                                            <div className="flex flex-col gap-2">
                                                {item.drivers.map((driver, driverIndex) => (
                                                    <div key={driverIndex} className="text-xs p-1 rounded">
                                                        {isEditingSchedule ? (
                                                            <div className="flex items-center gap-1">
                                                                <select value={driver.name} onChange={(e) => handleScheduleDriverChange(item.day, driverIndex, e.target.value)} className="w-full text-xs bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded py-1 px-1 focus:outline-none focus:ring-1 focus:ring-cyan-500">{transportation.internalDrivers.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}</select>
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
                        <SupervisorCard supervisor={transportation.externalSupervisor} onSave={(s) => handleSaveSupervisor('external', s)} isEditing={isEditingExternal} setIsEditing={setIsEditingExternal} title="مشرف الباصات الخارجية" />
                        <div className="flex justify-end"><button onClick={() => { setEditingRoute(null); setIsRouteModalOpen(true); }} className="flex items-center gap-2 bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"><PlusIcon className="w-4 h-4"/><span>إضافة مسار</span></button></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transportation.externalRoutes.map(route => (
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
            <Modal isOpen={isDriverModalOpen} onClose={() => setIsDriverModalOpen(false)} title={editingDriver ? 'تعديل بيانات السائق' : 'إضافة سائق جديد'}><DriverForm driver={editingDriver} onSave={handleSaveAndCloseDriver} onClose={() => setIsDriverModalOpen(false)}/></Modal>
            <Modal isOpen={isRouteModalOpen} onClose={() => setIsRouteModalOpen(false)} title={editingRoute ? 'تعديل المسار' : 'إضافة مسار جديد'}><RouteForm route={editingRoute} onSave={handleSaveAndCloseRoute} onClose={() => setIsRouteModalOpen(false)} /></Modal>
        </div>
    );
};

export default TransportationPage;