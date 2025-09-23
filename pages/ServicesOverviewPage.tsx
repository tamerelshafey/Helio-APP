import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeftIcon, ChevronDownIcon, RectangleGroupIcon, Squares2X2Icon, HeartIcon, CakeIcon, AcademicCapIcon, ShoppingBagIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon, CarIcon, GiftIcon, PaintBrushIcon } from '../components/common/Icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const iconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    HeartIcon, CakeIcon, AcademicCapIcon, ShoppingBagIcon, DevicePhoneMobileIcon, BoltIcon, SparklesIcon, WrenchScrewdriverIcon, CarIcon, Squares2X2Icon, GiftIcon, PaintBrushIcon
};

const getIcon = (name: string, props: React.SVGProps<SVGSVGElement>) => {
    const IconComponent = iconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : <Squares2X2Icon {...props} />;
};


const ServicesOverviewPage: React.FC = () => {
    const navigate = useNavigate();
    const { services, categories } = useAppContext();
    const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

    const categoryData = useMemo(() => {
        const serviceCounts: { [subCategoryId: number]: number } = {};
        for (const service of services) {
            serviceCounts[service.subCategoryId] = (serviceCounts[service.subCategoryId] || 0) + 1;
        }

        return categories
            .filter(cat => cat.name !== "المدينة والجهاز") // Exclude the non-service category
            .map(cat => {
                const subCategoriesWithCounts = cat.subCategories.map(sub => ({
                    ...sub,
                    count: serviceCounts[sub.id] || 0,
                }));
                const totalCount = subCategoriesWithCounts.reduce((sum, sub) => sum + sub.count, 0);
                return {
                    ...cat,
                    totalCount,
                    subCategories: subCategoriesWithCounts,
                };
            });
    }, [categories, services]);

    const chartData = useMemo(() => {
        return categoryData.map(cat => ({
            name: cat.name,
            value: cat.totalCount,
        })).filter(item => item.value > 0);
    }, [categoryData]);
    
    const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

    const handleToggleCategory = (id: number) => {
        setOpenCategoryId(openCategoryId === id ? null : id);
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                <RectangleGroupIcon className="w-8 h-8"/>
                هيكل الخدمات
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">توزيع الخدمات</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem' }}/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">قائمة الفئات التفصيلية</h2>
                     <div className="space-y-2">
                        {categoryData.map(category => (
                            <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                <button onClick={() => handleToggleCategory(category.id)} className="w-full flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-right">
                                    <div className="flex items-center gap-3">
                                        {getIcon(category.icon, { className: "w-6 h-6 text-cyan-500" })}
                                        <span className="font-semibold text-lg text-gray-800 dark:text-white">{category.name}</span>
                                        <span className="text-sm font-mono px-2 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full">{category.totalCount}</span>
                                    </div>
                                    <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${openCategoryId === category.id ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openCategoryId === category.id ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                    <ul className="p-4 pr-12 space-y-2">
                                        {category.subCategories.map(sub => (
                                            <li key={sub.id}>
                                                <Link to={`/services/subcategory/${sub.id}`} className="flex justify-between items-center p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                                                    <span className="text-gray-700 dark:text-gray-300">{sub.name}</span>
                                                    <span className="font-bold font-mono text-lg text-cyan-600 dark:text-cyan-400">{sub.count}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicesOverviewPage;