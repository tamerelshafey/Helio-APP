import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useServicesContext } from '../../context/ServicesContext';
import KpiCard from '../common/KpiCard';
import { WrenchScrewdriverIcon, StarIcon, ChatBubbleOvalLeftIcon, ShieldExclamationIcon, RectangleGroupIcon, DocumentDuplicateIcon, EyeIcon, ChartPieIcon } from '../common/Icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUIContext } from '../../context/UIContext';

const ServiceManagerDashboard: React.FC = () => {
    const { emergencyContacts } = useAppContext();
    const { services, categories } = useServicesContext();
    const { isDarkMode } = useUIContext();
    const allReviews = useMemo(() => services.flatMap(s => s.reviews.map(r => ({...r, serviceName: s.name}))), [services]);

    const stats = useMemo(() => {
        const totalServices = services.length;
        const totalReviews = allReviews.length;
        const averageRating = totalReviews > 0 ? (services.reduce((sum, s) => {
            if (s.reviews.length > 0) {
                 return sum + s.reviews.reduce((rSum, r) => rSum + r.rating, 0);
            }
            return sum;
        }, 0) / totalReviews).toFixed(1) : '0.0';
        const totalEmergency = emergencyContacts.length;

        const topViewedServices = [...services].sort((a,b) => b.views - a.views).slice(0, 5);

        const serviceCountsPerCategory: { [key: string]: number } = {};
        services.forEach(service => {
            const category = categories.find(c => c.subCategories.some(sc => sc.id === service.subCategoryId));
            if (category && category.name !== "المدينة والجهاز") {
                serviceCountsPerCategory[category.name] = (serviceCountsPerCategory[category.name] || 0) + 1;
            }
        });
        const categoryDistribution = Object.keys(serviceCountsPerCategory).map(name => ({ name, value: serviceCountsPerCategory[name] })).filter(c => c.value > 0);

        const latestReviews = allReviews
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        
        return { totalServices, totalReviews, averageRating, totalEmergency, topViewedServices, categoryDistribution, latestReviews };
    }, [services, categories, emergencyContacts, allReviews]);

    const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    
    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي الخدمات" value={stats.totalServices.toString()} icon={<WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="متوسط التقييم العام" value={stats.averageRating} icon={<StarIcon className="w-8 h-8 text-amber-400" />} />
                <KpiCard title="إجمالي التقييمات" value={stats.totalReviews.toLocaleString()} icon={<ChatBubbleOvalLeftIcon className="w-8 h-8 text-purple-400" />} />
                <KpiCard title="أرقام الطوارئ" value={stats.totalEmergency.toString()} icon={<ShieldExclamationIcon className="w-8 h-8 text-rose-400" />} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><EyeIcon className="w-6 h-6"/> أكثر 5 خدمات مشاهدة</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={stats.topViewedServices} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" interval={0} />
                            <YAxis />
                            <Tooltip contentStyle={tooltipStyle}/>
                            <Bar dataKey="views" name="المشاهدات" fill="#06b6d4" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2"><ChartPieIcon className="w-6 h-6"/> توزيع الخدمات على الفئات</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={stats.categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false}>
                                {stats.categoryDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             {/* Quick Actions & Latest Reviews */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">أحدث التقييمات</h3>
                         <Link to="/reviews" className="text-sm text-cyan-500 hover:underline">عرض الكل</Link>
                    </div>
                    <ul className="space-y-3">
                        {stats.latestReviews.map(review => (
                            <li key={review.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <img src={review.avatar} alt={review.username} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-200">{review.username} <span className="text-xs text-gray-500">على "{review.serviceName}"</span></p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{review.comment}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">إجراءات سريعة</h3>
                    <Link to="/services-overview" className="block p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                        <RectangleGroupIcon className="w-8 h-8 text-cyan-500" />
                        <div><p className="font-bold">إدارة هيكل الخدمات</p><p className="text-sm text-gray-500 dark:text-gray-400">إدارة الفئات الرئيسية والفرعية.</p></div>
                    </Link>
                     <Link to="/city-services-guide" className="block p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                        <DocumentDuplicateIcon className="w-8 h-8 text-purple-500" />
                        <div><p className="font-bold">دليل خدمات الجهاز</p><p className="text-sm text-gray-500 dark:text-gray-400">إدارة الإجراءات والأوراق المطلوبة.</p></div>
                    </Link>
                     <Link to="/emergency" className="block p-4 bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-4">
                        <ShieldExclamationIcon className="w-8 h-8 text-rose-500" />
                        <div><p className="font-bold">أرقام الطوارئ</p><p className="text-sm text-gray-500 dark:text-gray-400">تحديث أرقام الطوارئ بالمدينة.</p></div>
                    </Link>
                </div>
             </div>
        </div>
    );
};

export default ServiceManagerDashboard;