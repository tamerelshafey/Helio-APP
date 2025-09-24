import React, { memo } from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  changeLabel?: string;
  icon: React.ReactNode;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeLabel, icon, changeType = 'positive' }) => {
  const cardClasses = "bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] h-full cursor-pointer";

  const changeColor = {
    positive: 'text-green-500',
    negative: 'text-red-500',
    neutral: 'text-gray-500'
  }[changeType];

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between text-gray-500">
        <p className="font-medium">{title}</p>
        {icon}
      </div>
      <div className="mt-4 text-right">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {change && changeLabel && (
          <div className="flex items-baseline space-x-1 rtl:space-x-reverse text-sm mt-1">
            <span className={`font-semibold ${changeColor}`}>
              {change}
            </span>
            <span className="text-gray-500">{changeLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(KpiCard);