import React, { useMemo, useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContentContext } from '../context/ContentContext';
import { useServicesContext } from '../context/ServicesContext';
import { usePropertiesContext } from '../context/PropertiesContext';
import { useAuthContext } from '../context/AuthContext';
import { useTransportationContext } from '../context/TransportationContext';
import { 
    ArrowLeftIcon, StarIcon, EyeIcon, ChatBubbleOvalLeftIcon, WrenchScrewdriverIcon, ChartPieIcon, 
    ChartBarIcon, HomeModernIcon, NewspaperIcon, MagnifyingGlassIcon, StarIconOutline, DocumentChartBarIcon,
    TruckIcon, UserGroupIcon, MapPinIcon, CalendarDaysIcon
} from '../components/common/Icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Service, Property, News, Category, AdminUserRole, Driver, ExternalRoute } from '../types';
import KpiCard from '../components/common/KpiCard';
import TabButton from '../components/common/TabButton';
import { useUIContext } from '../context/UIContext';
import EmptyState from '../components/common/EmptyState';
import Rating from '../components/DashboardView';

const ServiceReports: React.FC<{ data: Service[]; categories: Category[] }> = ({ data, categories }) => {
    const { isDarkMode } = useUIContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<number>(0); // 0 for 'All'
    
    const filteredData = useMemo(() => {
        let servicesToFilter = data;
        if (categoryFilter !== 0) {
            const subCategoryIds = categories.find(c => c.id === categoryFilter)?.subCategories.map(sc => sc.id) || [];
            servicesToFilter = data.filter(s => subCategoryIds.includes(s.subCategoryId));
        }
        if (!searchTerm) return servicesToFilter;
        return servicesToFilter.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, categoryFilter, searchTerm, categories]);

    const kpiData = useMemo(() => {
        if (filteredData.length === 0) return { total: 0, avgRating: 'N/A', totalReviews: 0, topFav: 'N/A' };
        const total = filteredData.length;
        const servicesWithReviews = filteredData.filter(s => s.reviews.length > 0);
        const avgRating = servicesWithReviews.length > 0 ? (servicesWithReviews.reduce((acc, s) => acc + s.rating, 0) / servicesWithReviews.length).toFixed(1) : '0.0';
        const totalReviews = filteredData.reduce((acc, s) => acc + s.reviews.length, 0);
        const topFav = [...filteredData].filter(s => s.isFavorite).sort((a,b) => b.rating - a.rating)[0]?.name || 'لا يوجد';
        return { total, avgRating, totalReviews, topFav };
    }, [filteredData]);

    const topRated = useMemo(() => [...filteredData].sort((a, b) => b.rating - a.rating).slice(0, 5).map(s => ({ name: s.name, التقييم: s.rating })), [filteredData]);
    const mostViewed = useMemo(() => [...filteredData].sort((a, b) => b.views - a.views).slice(0, 5).map(s => ({ name: s.name, المشاهدات: s.views })), [filteredData]);

    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي الخدمات" value={kpiData.total.toString()} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-cyan-500"/>} />
                <KpiCard title="متوسط التقييم" value={kpiData.avgRating} icon={<StarIcon className="w-6 h-6 text-yellow-500"/>} />
                <KpiCard title="إجمالي التقييمات" value={kpiData.totalReviews.toString()} icon={<ChatBubbleOvalLeftIcon className="w-6 h-6 text-purple-500"/>} />
                <KpiCard title="الأكثر تفضيلاً" value={kpiData.topFav} icon={<EyeIcon className="w-6 h-6 text-pink-500"/>} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                     <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">الخدمات الأعلى تقييماً</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topRated} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} width={80} />
                            <Tooltip contentStyle={tooltipStyle}/>
                            <Bar dataKey="التقييم" fill="#06b6d4" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">الخدمات الأكثر مشاهدة</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={mostViewed} layout="vertical" margin={{ top: 5, right: 20, left: 80, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                            <XAxis type="number" stroke="#9ca3af" />
                            <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} width={80} />
                            <Tooltip contentStyle={tooltipStyle}/>
                            <Bar dataKey="المشاهدات" fill="#8b5cf6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">بيانات الخدمات التفصيلية</h3>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <select value={categoryFilter} onChange={e => setCategoryFilter(Number(e.target.value))} className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                            <option value="0">كل الفئات</option>
                            {categories.filter(c => c.name !== "المدينة والجهاز").map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
                        <div className="relative w-full sm:w-auto">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                            <input type="text" placeholder="بحث في الخدمات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {filteredData.length > 0 ? (
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">الخدمة</th>
                                    <th scope="col" className="px-6 py-3">التقييم</th>
                                    <th scope="col" className="px-6 py-3">المراجعات</th>
                                    <th scope="col" className="px-6 py-3">المشاهدات</th>
                                    <th scope="col" className="px-6 py-3">مفضلة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(service => (
                                    <tr key={service.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{service.name}</td>
                                        <td className="px-6 py-4"><Rating rating={service.rating} /></td>
                                        <td className="px-6 py-4">{service.reviews.length}</td>
                                        <td className="px-6 py-4">{service.views}</td>
                                        <td className="px-6 py-4 text-center">{service.isFavorite ? <StarIcon className="w-5 h-5 text-yellow-400"/> : <StarIconOutline className="w-5 h-5 text-gray-400"/>}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-8">
                            <EmptyState
                                icon={<MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />}
                                title="لا توجد بيانات"
                                message="لم يتم العثور على خدمات تطابق معايير البحث الحالية."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const PropertyTypeBadge: React.FC<{ type: 'sale' | 'rent' }> = memo(({ type }) => (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${ type === 'sale' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
        {type === 'sale' ? 'بيع' : 'إيجار'}
    </span>
));

const PropertyReports: React.FC<{ data: Property[] }> = ({ data }) => {
    const { isDarkMode } = useUIContext();
    const [searchTerm, setSearchTerm] = useState('');
    
    const kpiData = useMemo(() => {
        const total = data.length;
        const forSale = data.filter(p => p.type === 'sale');
        const forRent = data.filter(p => p.type === 'rent');
        const avgSalePrice = forSale.length > 0 ? (forSale.reduce((acc, p) => acc + p.price, 0) / forSale.length).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }) : 'N/A';
        const avgRentPrice = forRent.length > 0 ? (forRent.reduce((acc, p) => acc + p.price, 0) / forRent.length).toLocaleString('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }) : 'N/A';
        return { total, avgSalePrice, avgRentPrice };
    }, [data]);

    const propertyTypes = useMemo(() => [
        { name: 'للبيع', value: data.filter(p => p.type === 'sale').length },
        { name: 'للإيجار', value: data.filter(p => p.type === 'rent').length },
    ], [data]);
    
    const searchedData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);
    
    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
         <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="إجمالي العقارات" value={kpiData.total.toString()} icon={<HomeModernIcon className="w-6 h-6 text-amber-500"/>} />
                <KpiCard title="متوسط سعر البيع" value={kpiData.avgSalePrice} icon={<ChartBarIcon className="w-6 h-6 text-green-500"/>} />
                <KpiCard title="متوسط سعر الإيجار" value={kpiData.avgRentPrice} icon={<ChartBarIcon className="w-6 h-6 text-indigo-500"/>} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">توزيع أنواع العقارات</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={propertyTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            <Cell fill="#06b6d4" />
                            <Cell fill="#8b5cf6" />
                        </Pie>
                        <Tooltip contentStyle={tooltipStyle}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">بيانات العقارات التفصيلية</h3>
                    <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="بحث في العقارات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {searchedData.length > 0 ? (
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">العنوان</th>
                                    <th scope="col" className="px-6 py-3">النوع</th>
                                    <th scope="col" className="px-6 py-3">السعر</th>
                                    <th scope="col" className="px-6 py-3">المشاهدات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedData.map(prop => (
                                    <tr key={prop.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{prop.title}</td>
                                        <td className="px-6 py-4"><PropertyTypeBadge type={prop.type} /></td>
                                        <td className="px-6 py-4 font-mono">{prop.price.toLocaleString()} جنيه</td>
                                        <td className="px-6 py-4">{prop.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="py-8">
                            <EmptyState
                                icon={<MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />}
                                title="لا توجد بيانات"
                                message="لم يتم العثور على عقارات تطابق معايير البحث الحالية."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewsReports: React.FC<{ data: News[] }> = ({ data }) => {
    const { isDarkMode } = useUIContext();
    const [searchTerm, setSearchTerm] = useState('');
    
    const kpiData = useMemo(() => {
        const total = data.length;
        const totalViews = data.reduce((acc, n) => acc + n.views, 0);
        const mostViewed = [...data].sort((a,b) => b.views - a.views)[0];
        return { total, totalViews: totalViews.toLocaleString(), mostViewed: mostViewed?.title || 'N/A' };
    }, [data]);
    
    const mostViewedNews = useMemo(() => [...data].sort((a, b) => b.views - a.views).slice(0, 5).map(n => ({ name: n.title, المشاهدات: n.views })), [data]);

     const searchedData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(n => n.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);

    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="إجمالي المقالات" value={kpiData.total.toString()} icon={<NewspaperIcon className="w-6 h-6 text-sky-500"/>} />
                <KpiCard title="مجموع المشاهدات" value={kpiData.totalViews} icon={<EyeIcon className="w-6 h-6 text-red-500"/>} />
                <KpiCard title="المقال الأكثر قراءة" value={kpiData.mostViewed} icon={<StarIcon className="w-6 h-6 text-yellow-500"/>} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">المقالات الأكثر مشاهدة</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mostViewedNews} layout="vertical" margin={{ top: 5, right: 20, left: 150, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                        <XAxis type="number" stroke="#9ca3af" />
                        <YAxis type="category" dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} width={150} />
                        <Tooltip contentStyle={tooltipStyle}/>
                        <Bar dataKey="المشاهدات" fill="#ef4444" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">بيانات الأخبار التفصيلية</h3>
                    <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="بحث في الأخبار..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {searchedData.length > 0 ? (
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">العنوان</th>
                                    <th scope="col" className="px-6 py-3">الكاتب</th>
                                    <th scope="col" className="px-6 py-3">التاريخ</th>
                                    <th scope="col" className="px-6 py-3">المشاهدات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchedData.map(item => (
                                    <tr key={item.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{item.title}</td>
                                        <td className="px-6 py-4">{item.author}</td>
                                        <td className="px-6 py-4">{item.date}</td>
                                        <td className="px-6 py-4">{item.views}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="py-8">
                            <EmptyState
                                icon={<MagnifyingGlassIcon className="w-12 h-12 text-slate-400" />}
                                title="لا توجد بيانات"
                                message="لم يتم العثور على أخبار تطابق معايير البحث الحالية."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TransportationReports: React.FC = () => {
    const { transportation } = useTransportationContext();
    const { internalDrivers, externalRoutes, weeklySchedule, scheduleOverrides } = transportation;
    const { isDarkMode } = useUIContext();
    const [driverSearch, setDriverSearch] = useState('');

    const kpiData = useMemo(() => {
        const totalDrivers = internalDrivers.length;
        const totalRoutes = externalRoutes.length;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentOverrides = scheduleOverrides.filter(o => new Date(o.date) >= thirtyDaysAgo).length;
        return { totalDrivers, totalRoutes, recentOverrides };
    }, [internalDrivers, externalRoutes, scheduleOverrides]);

    const weeklyDistribution = useMemo(() => {
        return weeklySchedule.map(day => ({
            name: day.day,
            'عدد السائقين': day.drivers.length
        }));
    }, [weeklySchedule]);

    const filteredDrivers = useMemo(() => {
        if (!driverSearch) return internalDrivers;
        return internalDrivers.filter(d => 
            d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
            d.phone.includes(driverSearch)
        );
    }, [internalDrivers, driverSearch]);
    
    const tooltipStyle = isDarkMode 
        ? { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }
        : { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="إجمالي السائقين الداخليين" value={kpiData.totalDrivers.toString()} icon={<UserGroupIcon className="w-6 h-6 text-cyan-500"/>} />
                <KpiCard title="إجمالي الخطوط الخارجية" value={kpiData.totalRoutes.toString()} icon={<MapPinIcon className="w-6 h-6 text-purple-500"/>} />
                <KpiCard title="أيام الجداول المخصصة (آخر 30 يوم)" value={kpiData.recentOverrides.toString()} icon={<CalendarDaysIcon className="w-6 h-6 text-amber-500"/>} />
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">توزيع السائقين على مدار الأسبوع (القالب)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" allowDecimals={false} />
                        <Tooltip contentStyle={tooltipStyle}/>
                        <Legend />
                        <Bar dataKey="عدد السائقين" fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">قائمة السائقين</h3>
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                            <input type="text" placeholder="بحث..." value={driverSearch} onChange={(e) => setDriverSearch(e.target.value)} className="w-full sm:w-48 bg-slate-100 dark:bg-slate-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                        </div>
                    </div>
                    <div className="overflow-y-auto max-h-80">
                        {filteredDrivers.length > 0 ? (
                            <table className="w-full text-sm text-right">
                                <tbody>
                                    {filteredDrivers.map(driver => (
                                        <tr key={driver.id} className="border-t border-slate-200 dark:border-slate-700">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <img src={driver.avatar} alt={driver.name} className="w-8 h-8 rounded-full" />
                                                    <span className="font-semibold text-gray-800 dark:text-white">{driver.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-left font-mono">{driver.phone}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-center py-4 text-gray-500">لا يوجد سائقون.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">قائمة الخطوط الخارجية</h3>
                    <div className="overflow-y-auto max-h-80">
                       {externalRoutes.length > 0 ? (
                           <ul className="space-y-3">
                             {externalRoutes.map(route => (
                                <li key={route.id} className="p-3 rounded-md bg-slate-50 dark:bg-slate-700/50">
                                    <p className="font-bold text-gray-800 dark:text-white">{route.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">المواعيد: {route.timings.join(' | ')}</p>
                                </li>
                             ))}
                           </ul>
                       ) : (
                           <p className="text-center py-4 text-gray-500">لا توجد خطوط خارجية.</p>
                       )}
                    </div>
                </div>
            </div>
        </div>
    );
};

type ReportTab = 'services' | 'properties' | 'news' | 'transportation';

const tabConfig: { key: ReportTab; label: string; icon: React.ReactNode; roles: AdminUserRole[] }[] = [
    { key: 'services', label: 'الخدمات', icon: <WrenchScrewdriverIcon className="w-5 h-5"/>, roles: ['مسؤول ادارة الخدمات'] },
    { key: 'properties', label: 'العقارات', icon: <HomeModernIcon className="w-5 h-5"/>, roles: ['مسؤول العقارات'] },
    { key: 'news', label: 'الأخبار', icon: <NewspaperIcon className="w-5 h-5"/>, roles: ['مسؤول المحتوى'] },
    { key: 'transportation', label: 'النقل', icon: <TruckIcon className="w-5 h-5"/>, roles: ['مسؤول النقل'] },
];

const ReportsPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuthContext();
    const { news } = useContentContext();
    const { services, categories } = useServicesContext();
    const { properties } = usePropertiesContext();

    const availableTabs = useMemo(() => {
        if (!currentUser) return [];
        if (currentUser.roles.includes('مدير عام')) return tabConfig;
        return tabConfig.filter(tab => tab.roles.some(role => currentUser.roles.includes(role)));
    }, [currentUser]);

    const [activeTab, setActiveTab] = useState<ReportTab | undefined>(availableTabs[0]?.key);
    
    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find(t => t.key === activeTab)) {
            setActiveTab(availableTabs[0].key);
        } else if (availableTabs.length === 0) {
            setActiveTab(undefined);
        }
    }, [availableTabs, activeTab]);

    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const thirtyDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split('T')[0];
    }, []);

    const [startDate, setStartDate] = useState(thirtyDaysAgo);
    const [endDate, setEndDate] = useState(today);

    const filteredServices = useMemo(() => services.filter(s => s.creationDate >= startDate && s.creationDate <= endDate), [services, startDate, endDate]);
    const filteredProperties = useMemo(() => properties.filter(p => p.creationDate >= startDate && p.creationDate <= endDate), [properties, startDate, endDate]);
    const filteredNews = useMemo(() => news.filter(n => n.date >= startDate && n.date <= endDate), [news, startDate, endDate]);

    const renderContent = () => {
        if (!activeTab) return null;
        switch (activeTab) {
            case 'services': return <ServiceReports data={filteredServices} categories={categories} />;
            case 'properties': return <PropertyReports data={filteredProperties} />;
            case 'news': return <NewsReports data={filteredNews} />;
            case 'transportation': return <TransportationReports />;
            default: return null;
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى لوحة التحكم</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">تقارير مخصصة</h1>

            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg space-y-6">
                 {availableTabs.length > 0 ? (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex gap-2">
                                {availableTabs.map(tab => (
                                    <TabButton key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} icon={tab.icon}>
                                        {tab.label}
                                    </TabButton>
                                ))}
                            </div>
                            <div className="flex-grow border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-700 mt-4 pt-4 md:mt-0 md:pt-0 md:mr-4 md:pr-4 flex flex-col sm:flex-row gap-4 items-center">
                                <label className="text-sm font-semibold">عرض البيانات من:</label>
                                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500"/>
                                <label className="text-sm font-semibold">إلى:</label>
                                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full sm:w-auto bg-slate-100 dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500"/>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                            {renderContent()}
                        </div>
                    </>
                ) : (
                    <EmptyState
                        icon={<DocumentChartBarIcon className="w-16 h-16 text-slate-400" />}
                        title="لا توجد تقارير متاحة"
                        message="لا تملك الصلاحيات اللازمة لعرض أي تقارير."
                    />
                )}
            </div>
        </div>
    );
};

export default ReportsPage;