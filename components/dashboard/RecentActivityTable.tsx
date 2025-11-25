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
  const iconClasses = "w-5 h-5 text-white";
  const bgClasses: Record<Activity['type'], string> = {
    NEW_SERVICE: 'bg-blue-500',
    EMERGENCY_REPORT: 'bg-red-500',
    NEWS_PUBLISHED: 'bg-purple-500',
    NEW_PROPERTY: 'bg-green-500',
  };
  const typeMap: { [key in Activity['type']]: React.ReactNode } = {
    NEW_SERVICE: <WrenchScrewdriverIcon className={iconClasses} />,
    EMERGENCY_REPORT: <ShieldExclamationIcon className={iconClasses} />,
    NEWS_PUBLISHED: <NewspaperIcon className={iconClasses} />,
    NEW_PROPERTY: <BuildingOffice2Icon className={iconClasses} />,
  };
  return <div className={`flex items-center justify-center w-10 h-10 rounded-full ring-8 ring-slate-100 dark:ring-slate-800 ${bgClasses[type]}`}>{typeMap[type]}</div>;
};

const RecentActivityTable: React.FC<{ activities: Activity[] }> = ({ activities }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span className="absolute top-5 right-5 -mr-px h-full w-0.5 bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
              ) : null}
              <div className="relative flex items-start space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {activity.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivityTable;