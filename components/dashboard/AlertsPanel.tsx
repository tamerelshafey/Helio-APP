import React from 'react';
import type { Alert } from '../../types';
import { BellAlertIcon, UserPlusIcon, BuildingOffice2Icon } from '../common/Icons';

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `قبل دقيقة`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `قبل ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
};


const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
    const iconClasses = "w-5 h-5";
    switch(type) {
        case 'new_inquiry':
            return <BellAlertIcon className={`${iconClasses} text-yellow-500`} />;
        case 'user_registered':
            return <UserPlusIcon className={`${iconClasses} text-blue-500`} />;
        case 'property_listed':
            return <BuildingOffice2Icon className={`${iconClasses} text-green-500`} />;
        default:
            return <BellAlertIcon className={iconClasses} />;
    }
}

const AlertsPanel: React.FC<{ alerts: Alert[] }> = ({ alerts }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">تنبيهات فورية</h3>
            <div className="space-y-4">
                {alerts.length > 0 ? alerts.map(alert => (
                    <div key={alert.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full">
                           <AlertIcon type={alert.type} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{alert.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatRelativeTime(alert.time)}</p>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-sm text-gray-500 py-4">لا توجد تنبيهات جديدة.</p>
                )}
            </div>
             <button className="mt-4 w-full text-cyan-500 dark:text-cyan-400 hover:underline text-sm font-medium">
                عرض كل التنبيهات
            </button>
        </div>
    );
};

export default AlertsPanel;