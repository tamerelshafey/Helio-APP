import React, { useMemo } from 'react';
import type { Alert } from '../../types';
import { BellAlertIcon, UserPlusIcon, BuildingStorefrontIcon } from '../common/Icons';
import { useAppContext } from '../../context/AppContext';

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
            return <BuildingStorefrontIcon className={`${iconClasses} text-green-500`} />;
        default:
            return <BellAlertIcon className={iconClasses} />;
    }
}

const AlertsPanel: React.FC = () => {
    const { users, properties } = useAppContext();

    const alerts = useMemo(() => {
        const sortedUsers = [...users].sort((a,b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
        const sortedProperties = [...properties].sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

        const userAlerts: Alert[] = sortedUsers.slice(0, 2).map(user => ({
            id: `user-${user.id}`,
            message: `مستخدم جديد سجل: ${user.name}`,
            time: user.joinDate,
            type: 'user_registered'
        }));

        const propertyAlerts: Alert[] = sortedProperties.slice(0, 1).map(prop => ({
            id: `prop-${prop.id}`,
            message: `تم إدراج عقار جديد: ${prop.title.substring(0, 25)}...`,
            time: prop.creationDate,
            type: 'property_listed'
        }));
        
        return [...userAlerts, ...propertyAlerts].sort((a,b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    }, [users, properties]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">تنبيهات فورية</h3>
            <div className="space-y-4">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="p-2 bg-gray-100 rounded-full">
                           <AlertIcon type={alert.type} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                            <p className="text-xs text-gray-500">{formatRelativeTime(alert.time)}</p>
                        </div>
                    </div>
                ))}
            </div>
             <button className="mt-4 w-full text-cyan-500 hover:underline text-sm font-medium">
                عرض كل التنبيهات
            </button>
        </div>
    );
};

export default AlertsPanel;