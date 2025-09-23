import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/AppContext';
import { EyeIcon } from '../common/Icons';

const TopServicesChart: React.FC = () => {
    const { services } = useAppContext();

    const topViewed = useMemo(() => 
        [...services]
            .sort((a, b) => b.views - a.views)
            .slice(0, 5)
            .map(s => ({ name: s.name, المشاهدات: s.views })), 
        [services]
    );

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <EyeIcon className="w-6 h-6" />
                الخدمات الأكثر مشاهدة
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topViewed} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#9ca3af" 
                        tick={{ fontSize: 12 }} 
                        width={80} 
                        tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            borderColor: '#334155',
                            borderRadius: '0.5rem' 
                        }}
                    />
                    <Bar dataKey="المشاهدات" fill="#8b5cf6" barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopServicesChart;
