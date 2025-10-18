import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import KpiCard from '../common/KpiCard';
import { BusIcon, UserGroupIcon, MapPinIcon, CalendarDaysIcon, PhoneIcon } from '../common/Icons';
import { useTransportationContext } from '../../context/TransportationContext';

const TransportationManagerDashboard: React.FC = () => {
    const { transportation } = useTransportationContext();

    const stats = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.toLocaleString('ar-EG', { weekday: 'long' });
        const todayDateString = today.toISOString().split('T')[0];
        
        const override = transportation.scheduleOverrides.find(o => o.date === todayDateString);
        const driversOnDuty = override 
            ? override.drivers 
            : transportation.weeklySchedule.find(d => d.day === dayOfWeek)?.drivers || [];

        return {
            internalDriversCount: transportation.internalDrivers.length,
            externalRoutesCount: transportation.externalRoutes.length,
            driversOnDuty
        };
    }, [transportation]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="سائقو الباصات الداخلية" value={stats.internalDriversCount.toString()} icon={<UserGroupIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="خطوط الباصات الخارجية" value={stats.externalRoutesCount.toString()} icon={<MapPinIcon className="w-8 h-8 text-purple-400" />} />
                <KpiCard title="سائقون مناوبون اليوم" value={stats.driversOnDuty.length.toString()} icon={<CalendarDaysIcon className="w-8 h-8 text-amber-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">السائقون المناوبون اليوم ({stats.driversOnDuty.length})</h3>
                    {stats.driversOnDuty.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.driversOnDuty.map(driver => (
                                <li key={driver.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{driver.name}</span>
                                    <a href={`tel:${driver.phone}`} className="flex items-center gap-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md">
                                        <PhoneIcon className="w-4 h-4" />
                                        <span>{driver.phone}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">لا يوجد سائقون مناوبون اليوم.</p>
                    )}
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">إجراءات سريعة</h3>
                    <Link to="/transportation" className="flex flex-col items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-8 py-4 rounded-lg hover:bg-cyan-600 transition-colors">
                        <BusIcon className="w-8 h-8"/>
                        <span>إدارة النقل الكاملة</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TransportationManagerDashboard;
