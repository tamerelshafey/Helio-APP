import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartPieIcon } from '../common/Icons';
import { useStore } from '../../store';

interface ContentOverviewChartProps {
    stats: {
        services: { total: number };
        properties: { total: number };
        content: { total: number };
        community: { total: number };
    };
}

const COLORS = ['#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899'];

const ContentOverviewChart: React.FC<ContentOverviewChartProps> = ({ stats }) => {
    const isDarkMode = useStore((state) => state.isDarkMode);

    const data = [
        { name: 'الخدمات', value: stats.services.total },
        { name: 'العقارات', value: stats.properties.total },
        { name: 'الأخبار والإشعارات', value: stats.content.total },
        { name: 'منشورات المجتمع', value: stats.community.total },
    ];

    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6" />
                نظرة عامة على المحتوى
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle}/>
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ContentOverviewChart;