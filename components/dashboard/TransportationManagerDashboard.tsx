import React from 'react';
import { Link } from 'react-router-dom';
import KpiCard from '../KpiCard';
import { BusIcon, UserGroupIcon, MapIcon, PhoneIcon, UserCircleIcon, CalendarDaysIcon } from '../Icons';

// Mock data since context is not available
const mockData = {
    internalDrivers: [ { id: 1, name: 'أحمد المصري' }, { id: 2, name: 'خالد عبدالله' }, { id: 3, name: 'ياسر القحطاني' } ],
    externalRoutes: [ { id: 1, name: 'هليوبوليس الجديدة <> ميدان رمسيس' }, { id: 2, name: 'هليوبوليس الجديدة <> التجمع الخامس' }, { id: 3, name: 'هليوبوليس الجديدة <> مدينة نصر' } ],
    weeklySchedule: [ { day: 'الأحد', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] }, { day: 'الإثنين', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] }, { day: 'الثلاثاء', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] }, { day: 'الأربعاء', drivers: [{ name: 'سعيد العويران', phone: '012-4444-5555' }] }, { day: 'الخميس', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] }, { day: 'الجمعة', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] }, { day: 'السبت', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] } ],
    internalSupervisor: { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' },
    externalSupervisor: { name: 'أ. حسين فهمي', phone: '015-4321-0987' }
};

const TransportationManagerDashboard: React.FC = () => {
    const transportation = mockData;

    const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long' });
    const todaySchedule = transportation.weeklySchedule.find(d => d.day === today);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <KpiCard title="إجمالي السائقين" value={transportation.internalDrivers.length.toString()} icon={<UserGroupIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="المسارات الخارجية" value={transportation.externalRoutes.length.toString()} icon={<MapIcon className="w-8 h-8 text-purple-400" />} />
                <KpiCard title="مناوبة اليوم" value={`${todaySchedule?.drivers.length || 0} سائق`} icon={<CalendarDaysIcon className="w-8 h-8 text-amber-400" />} />
                <Link to="/transportation" className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 rounded-xl">
                    <KpiCard title="إدارة النقل" value="عرض" changeLabel="الانتقال لصفحة الإدارة" icon={<BusIcon className="w-8 h-8 text-lime-400" />} />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Supervisors and Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Supervisors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">مشرف الباصات الداخلية</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <UserCircleIcon className="w-10 h-10 text-cyan-500" />
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">{transportation.internalSupervisor.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{transportation.internalSupervisor.phone}</p>
                                    </div>
                                </div>
                                <a href={`tel:${transportation.internalSupervisor.phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>اتصال</span>
                                </a>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">مشرف الباصات الخارجية</h3>
                            <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <UserCircleIcon className="w-10 h-10 text-purple-500" />
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-white">{transportation.externalSupervisor.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{transportation.externalSupervisor.phone}</p>
                                    </div>
                                </div>
                                <a href={`tel:${transportation.externalSupervisor.phone}`} className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm">
                                    <PhoneIcon className="w-4 h-4" />
                                    <span>اتصال</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    {/* Today's Schedule */}
                     <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">مناوبة اليوم: {today}</h3>
                        {todaySchedule && todaySchedule.drivers.length > 0 ? (
                            <ul className="space-y-3">
                                {todaySchedule.drivers.map((driver, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{driver.name}</span>
                                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{driver.phone}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا يوجد سائقين مناوبين اليوم.</p>
                        )}
                    </div>
                </div>

                {/* Latest Drivers & Routes */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">أحدث السائقين المضافين</h3>
                        <ul className="space-y-2">
                            {transportation.internalDrivers.slice(0, 3).map(driver => (
                                <li key={driver.id} className="text-sm text-gray-600 dark:text-gray-300">{driver.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">أحدث المسارات المضافة</h3>
                        <ul className="space-y-2">
                            {transportation.externalRoutes.slice(0, 3).map(route => (
                                <li key={route.id} className="text-sm text-gray-600 dark:text-gray-300">{route.name}</li>
                            ))}
                        </ul>
                    </div>
                    <Link to="/transportation" className="block w-full text-center bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-600 transition-colors">
                        الانتقال إلى الإدارة الكاملة للنقل
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TransportationManagerDashboard;
