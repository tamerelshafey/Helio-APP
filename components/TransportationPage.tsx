import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, BusIcon, CalendarDaysIcon, MapPinIcon } from './Icons';

// Mock Data
const internalSupervisor = { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' };
const externalSupervisor = { name: 'أ. حسين فهمي', phone: '015-4321-0987' };

const internalDrivers = [
    { id: 1, name: 'أحمد المصري', phone: '010-1111-2222', avatar: 'https://picsum.photos/200/200?random=1' },
    { id: 2, name: 'خالد عبدالله', phone: '011-2222-3333', avatar: 'https://picsum.photos/200/200?random=3' },
    { id: 3, name: 'ياسر القحطاني', phone: '015-3333-4444', avatar: 'https://picsum.photos/200/200?random=7' },
    { id: 4, name: 'سعيد العويران', phone: '012-4444-5555', avatar: 'https://picsum.photos/200/200?random=8' },
];

const weeklySchedule = [
    { day: 'الأحد', driverName: 'أحمد المصري', phone: '010-1111-2222' },
    { day: 'الإثنين', driverName: 'خالد عبدالله', phone: '011-2222-3333' },
    { day: 'الثلاثاء', driverName: 'ياسر القحطاني', phone: '015-3333-4444' },
    { day: 'الأربعاء', driverName: 'سعيد العويران', phone: '012-4444-5555' },
    { day: 'الخميس', driverName: 'أحمد المصري', phone: '010-1111-2222' },
    { day: 'الجمعة', driverName: 'خالد عبدالله', phone: '011-2222-3333' },
    { day: 'السبت', driverName: 'ياسر القحطاني', phone: '015-3333-4444' },
];

const externalRoutes = [
    { 
        id: 1, 
        name: 'هليوبوليس الجديدة <> ميدان رمسيس', 
        timings: ['07:00 ص', '09:00 ص', '02:00 م', '05:00 م'], 
        waitingPoint: 'أمام البوابة الرئيسية للمدينة' 
    },
    { 
        id: 2, 
        name: 'هليوبوليس الجديدة <> التجمع الخامس', 
        timings: ['08:00 ص', '11:00 ص', '03:00 م', '06:00 م'], 
        waitingPoint: 'بجوار مول سيتي بلازا' 
    },
    { 
        id: 3, 
        name: 'هليوبوليس الجديدة <> مدينة نصر', 
        timings: ['07:30 ص', '10:30 ص', '01:30 م', '04:30 م'], 
        waitingPoint: 'أمام محطة الوقود' 
    },
];

const CallButton: React.FC<{ phone: string }> = ({ phone }) => (
    <a href={`tel:${phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors text-sm">
        <PhoneIcon className="w-4 h-4" />
        <span>اتصال</span>
    </a>
);

const SupervisorCard: React.FC<{ name: string; phone: string; title: string }> = ({ name, phone, title }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <UserCircleIcon className="w-10 h-10 text-cyan-500" />
            <div>
                <h3 className="font-bold text-gray-800 dark:text-white">{name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            </div>
        </div>
        <CallButton phone={phone} />
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 font-semibold rounded-t-lg transition-colors focus:outline-none ${
            active
                ? 'bg-white dark:bg-slate-800 text-cyan-500 border-b-2 border-cyan-500'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
        }`}
    >
        {children}
    </button>
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
                إدارة الباصات
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-slate-700">
                <nav className="-mb-px flex gap-4" aria-label="Tabs">
                    <TabButton active={activeTab === 'internal'} onClick={() => setActiveTab('internal')}>الباصات الداخلية</TabButton>
                    <TabButton active={activeTab === 'external'} onClick={() => setActiveTab('external')}>الباصات الخارجية</TabButton>
                </nav>
            </div>

            {/* Content */}
            <div>
                {activeTab === 'internal' && (
                    <div className="space-y-8">
                        <SupervisorCard name={internalSupervisor.name} phone={internalSupervisor.phone} title="مشرف الباصات الداخلية" />
                        
                        <div>
                            <h2 className="text-xl font-bold mb-4">قائمة السائقين</h2>
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead className="text-sm text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="p-3">السائق</th>
                                            <th className="p-3">رقم الهاتف</th>
                                            <th className="p-3">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {internalDrivers.map(driver => (
                                            <tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={driver.avatar} alt={driver.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                                        <span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{driver.phone}</td>
                                                <td className="p-3"><CallButton phone={driver.phone} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDaysIcon className="w-6 h-6" /> الجدول الأسبوعي</h2>
                             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md overflow-x-auto">
                                <table className="w-full text-right">
                                     <thead className="text-sm text-gray-600 dark:text-gray-400">
                                        <tr>
                                            <th className="p-3">اليوم</th>
                                            <th className="p-3">السائق المناوب</th>
                                            <th className="p-3">رقم الهاتف</th>
                                            <th className="p-3">إجراء</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {weeklySchedule.map(item => (
                                            <tr key={item.day} className="border-t border-slate-200 dark:border-slate-700">
                                                <td className="p-3 font-semibold text-gray-800 dark:text-white">{item.day}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300">{item.driverName}</td>
                                                <td className="p-3 text-gray-600 dark:text-gray-300 font-mono">{item.phone}</td>
                                                <td className="p-3"><CallButton phone={item.phone} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'external' && (
                    <div className="space-y-8">
                        <SupervisorCard name={externalSupervisor.name} phone={externalSupervisor.phone} title="مشرف الباصات الخارجية" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {externalRoutes.map(route => (
                                <div key={route.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
                                    <h3 className="font-bold text-lg text-cyan-600 dark:text-cyan-400">{route.name}</h3>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">المواعيد المتاحة:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {route.timings.map(time => (
                                                <span key={time} className="bg-slate-200 dark:bg-slate-700 text-xs font-mono px-2 py-1 rounded">{time}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                                           <MapPinIcon className="w-4 h-4"/>
                                           مكان الانتظار:
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{route.waitingPoint}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransportationPage;