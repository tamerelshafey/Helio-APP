import React from 'react';
import type { Alert } from '../types';
import { BellAlertIcon, UserPlusIcon, BuildingStorefrontIcon } from './Icons';

const mockAlerts: Alert[] = [
    { id: '1', message: 'طلب جديد من محمد علي لعقار #5432', time: 'قبل دقيقتين', type: 'new_inquiry' },
    { id: '2', message: 'مستخدم جديد سجل: سارة عبدالله', time: 'قبل 15 دقيقة', type: 'user_registered' },
    { id: '3', message: 'تم إدراج عقار جديد في حي النرجس', time: 'قبل ساعة', type: 'property_listed' },
];

const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
    const iconClasses = "w-5 h-5";
    switch(type) {
        case 'new_inquiry':
            return <BellAlertIcon className={`${iconClasses} text-yellow-500`} />;
        case 'user_registered':
            return <UserPlusIcon className={`${iconClasses} text-blue-500`} />;
        case 'property_listed':
            return <BuildingStorefrontIcon className={`${iconClasses} text-green-500`} />;
        default:
            return <BellAlertIcon className={iconClasses} />;
    }
}

const AlertsPanel: React.FC = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">تنبيهات فورية</h3>
            <div className="space-y-4">
                {mockAlerts.map(alert => (
                    <div key={alert.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full">
                           <AlertIcon type={alert.type} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                        </div>
                    </div>
                ))}
            </div>
             <button className="mt-4 w-full text-cyan-500 dark:text-cyan-400 hover:underline text-sm font-medium">
                عرض كل التنبيهات
            </button>
        </div>
    );
};

export default AlertsPanel;