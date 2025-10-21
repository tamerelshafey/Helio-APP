import React from 'react';
import type { Activity } from '../../types';
import { WrenchScrewdriverIcon, ShieldExclamationIcon, NewspaperIcon, BuildingOffice2Icon } from '../common/Icons';

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `قبل ${Math.round(seconds)} ثانية`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `قبل ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
};

const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
  const iconClasses = "w-6 h-6";
  const typeMap: { [key in Activity['type']]: React.ReactNode } = {
    NEW_SERVICE: <WrenchScrewdriverIcon className={`${iconClasses} text-blue-500`} />,
    EMERGENCY_REPORT: <ShieldExclamationIcon className={`${iconClasses} text-red-500`} />,
    NEWS_PUBLISHED: <NewspaperIcon className={`${iconClasses} text-purple-500`} />,
    NEW_PROPERTY: <BuildingOffice2Icon className={`${iconClasses} text-green-500`} />,
  };
  return <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full">{typeMap[type]}</div>;
};

const RecentActivityTable: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <ActivityIcon type={activity.type} />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{activity.description}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(activity.time)}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;