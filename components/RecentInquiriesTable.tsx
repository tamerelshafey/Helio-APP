import React from 'react';
import type { Activity } from '../types';
import { WrenchScrewdriverIcon, ShieldExclamationIcon, NewspaperIcon, BuildingOffice2Icon } from './Icons';

const mockActivities: Activity[] = [
  { id: '2', type: 'EMERGENCY_REPORT', description: 'بلاغ طوارئ: انقطاع مياه في الحي الأول لمدة ساعة', time: 'قبل 12 دقيقة', user: { name: 'فاطمة الزهراء', avatarUrl: 'https://picsum.photos/102' } },
  { id: '3', type: 'NEWS_PUBLISHED', description: 'تم نشر خبر جديد: موعد افتتاح النادي الاجتماعي للسكان', time: 'قبل 30 دقيقة' },
  { id: '1', type: 'NEW_SERVICE', description: 'تمت إضافة خدمة جديدة: صيدلية العزبي (خدمة 24 ساعة)', time: 'قبل ساعة', user: { name: 'أحمد محمود', avatarUrl: 'https://picsum.photos/101' } },
  { id: '4', type: 'NEW_PROPERTY', description: 'تمت إضافة عقار جديد: شقة للإيجار في كمبوند "لايف بارك"', time: 'قبل 3 ساعات', user: { name: 'خالد العتيبي', avatarUrl: 'https://picsum.photos/103' } },
];

const ActivityIcon: React.FC<{ type: Activity['type'] }> = ({ type }) => {
  const iconClasses = "w-6 h-6";
  const typeMap = {
    NEW_SERVICE: <WrenchScrewdriverIcon className={`${iconClasses} text-blue-500`} />,
    EMERGENCY_REPORT: <ShieldExclamationIcon className={`${iconClasses} text-red-500`} />,
    NEWS_PUBLISHED: <NewspaperIcon className={`${iconClasses} text-purple-500`} />,
    NEW_PROPERTY: <BuildingOffice2Icon className={`${iconClasses} text-green-500`} />,
  };
  return <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full">{typeMap[type]}</div>;
};

const RecentActivityTable: React.FC = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {mockActivities.map((activity) => (
            <tr key={activity.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
              <td className="px-4 py-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <ActivityIcon type={activity.type} />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{activity.description}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.user && `بواسطة ${activity.user.name} • `}{activity.time}
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