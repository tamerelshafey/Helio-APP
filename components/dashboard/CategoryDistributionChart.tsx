import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useServicesContext } from '../../context/ServicesContext';
import { ChartPieIcon } from '../common/Icons';

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const CategoryDistributionChart: React.FC = () => {
    const { services, categories } = useServicesContext();

    const chartData = useMemo(() => {
        const serviceCounts: { [subCategoryId: number]: number } = {};
        for (const service of services) {
            serviceCounts[service.subCategoryId] = (serviceCounts[service.subCategoryId] || 0) + 1;
        }

        const categoryCounts: { [categoryName: string]: number } = {};
        for (const category of categories) {
            if (category.name === "المدينة والجهاز") continue;
            let count = 0;
            for (const sub of category.subCategories) {
                count += serviceCounts[sub.id] || 0;
            }
            if(count > 0) {
                categoryCounts[category.name] = count;
            }
        }
        
        return Object.keys(categoryCounts).map(name => ({ name, value: categoryCounts[name] }));

    }, [services, categories]);

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
            <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ChartPieIcon className="w-6 h-6" />
                توزيع فئات الخدمات
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                            borderColor: '#334155',
                            borderRadius: '0.5rem' 
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CategoryDistributionChart;