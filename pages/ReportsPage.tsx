import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeftIcon, StarIcon, EyeIcon, ChatBubbleOvalLeftIcon, WrenchScrewdriverIcon, ChartPieIcon, ChartBarIcon, HomeModernIcon, NewspaperIcon, MagnifyingGlassIcon, StarIconOutline } from '../components/common/Icons';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Service, Property, News } from '../types';

const KpiCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 rtl:space-x-reverse">
        <div className="p-3 bg-cyan-100 dark:bg-cyan-900/50 rounded-full">{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }> = ({ active, onClick, children, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-md transition-colors focus:outline-none text-sm ${
            active
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-200/50 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {icon}
        {children}
    </button>
);

const ServiceReports: React.FC<{ data: Service[] }> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const kpiData = useMemo(() => {
        if (data.length === 0) return { total: 0, avgRating: 'N/A', totalReviews: 0, topFav: 'N/A' };
        const total = data.length;
        const servicesWithReviews = data.filter(s => s.reviews.length > 0);
        const avgRating = servicesWithReviews.length > 0 ? (servicesWithReviews.reduce((acc, s) => acc + s.rating, 0) / servicesWithReviews.length).toFixed(1) : '0.0';
        const totalReviews = data.reduce((acc, s) => acc + s.reviews.length, 0);
        const topFav = [...data].filter(s => s.isFavorite).sort((a,b) => b.rating - a.rating)[0]?.name || 'لا يوجد';
        return { total, avgRating, totalReviews, topFav };
    }, [data]);

    const topRated = useMemo(() => [...data].sort((a, b) => b.rating - a.rating).slice(0, 5).map(s => ({ name: s.name, التقييم: s.rating })), [data]);
    const mostViewed = useMemo(() => [...data].sort((a, b) => b.views - a.views).slice(0, 5).map(s => ({ name: s.name, المشاهدات: s.views })), [data]);

    const searchedData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [data, searchTerm]);

    const Rating: React.FC<{ rating: number }> = ({ rating }) => (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className={`w-4 h-4 ${ i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600' }`} />
            ))}
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="إجمالي الخدمات" value={kpiData.total} icon={<WrenchScrewdriverIcon className="w-6 h-6 text-cyan-500"/>} />
                <KpiCard title="متوسط التقييم" value={kpiData.avgRating} icon={<StarIcon className="w-6 h-6 text-yellow-500"/>} />
                <KpiCard title="إجمالي التقييمات" value={kpiData.totalReviews} icon={<ChatBubbleOvalLeftIcon className="w-6 h-6 text-purple-500"/>} />
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
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem' }}/>
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
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem' }}/>
                            <Bar dataKey="المشاهدات" fill="#8b5cf6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300">بيانات الخدمات التفصيلية</h3>
                    <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                        <input type="text" placeholder="بحث في الخدمات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                    </div>
                </div>
                <div className="overflow-x-auto">
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
                            {searchedData.map(service => (
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
                    {searchedData.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">لا توجد بيانات تطابق البحث.</div>}
                </div>
            </div>
        </div>
    );
};

const PropertyReports: React.FC<{ data: Property[] }> = ({ data }) => {
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

    const TypeBadge: React.FC<{ type: 'sale' | 'rent' }> = ({ type }) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${ type === 'sale' ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
            {type === 'sale' ? 'بيع' : 'إيجار'}
        </span>
    );

    return (
         <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="إجمالي العقارات" value={kpiData.total} icon={<HomeModernIcon className="w-6 h-6 text-amber-500"/>} />
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
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem' }}/>
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
                                    <td className="px-6 py-4"><TypeBadge type={prop.type} /></td>
                                    <td className="px-6 py-4 font-mono">{prop.price.toLocaleString()} جنيه</td>
                                    <td className="px-6 py-4">{prop.views}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {searchedData.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">لا توجد بيانات تطابق البحث.</div>}
                </div>
            </div>
        </div>
    );
};

const NewsReports: React.FC<{ data: News[] }> = ({ data }) => {
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

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <KpiCard title="إجمالي المقالات" value={kpiData.total} icon={<NewspaperIcon className="w-6 h-6 text-sky-500"/>} />
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
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '0.5rem' }}/>
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
                    {searchedData.length === 0 && <div className="text-center py-8 text-gray-500 dark:text-gray-400">لا توجد بيانات تطابق البحث.</div>}
                </div>
            </div>
        </div>
    );
};

const ReportsPage: React.FC = () => {
    const navigate = useNavigate();
    const { services, properties, news } = useAppContext();
    const [activeTab, setActiveTab] = useState<'services' | 'properties' | 'news'>('services');
    
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
        switch (activeTab) {
            case 'services': return <ServiceReports data={filteredServices} />;
            case 'properties': return <PropertyReports data={filteredProperties} />;
            case 'news': return <NewsReports data={filteredNews} />;
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
                 <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex gap-2">
                        <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<WrenchScrewdriverIcon className="w-5 h-5"/>}>الخدمات</TabButton>
                        <TabButton active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon={<HomeModernIcon className="w-5 h-5"/>}>العقارات</TabButton>
                        <TabButton active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<NewspaperIcon className="w-5 h-5"/>}>الأخبار</TabButton>
                    </div>
                    <div className="flex-grow border-t md:border-t-0 md:border-r border-slate-200 dark:border-slate-700 mt-4 pt-4 md:mt-0 md:pt-0 md:mr-4 md:pr-4 flex flex-col sm:flex-row gap-4 items-center">
                         <label className="text-sm font-semibold">عرض البيانات من:</label>
                         <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500"/>
                         <label className="text-sm font-semibold">إلى:</label>
                         <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-slate-100 dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500"/>
                    </div>
                </div>
                
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;