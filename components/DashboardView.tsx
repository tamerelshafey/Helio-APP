import React from 'react';
import { Link } from 'react-router-dom';
import KpiCard from './KpiCard';
import UserActivityChart from './UserActivityChart';
import PropertyMap from './PropertyMap';
import RecentActivityTable from './RecentActivityTable';
import AlertsPanel from './AlertsPanel';
import UsersToVerify from './UsersToVerify';
import Footer from './Footer';
import { UserIcon, MapIcon, WrenchScrewdriverIcon, ShieldExclamationIcon, HomeModernIcon, UserGroupIcon, BusIcon, NewspaperIcon, Bars3Icon } from './Icons';
import { useContentContext } from '../context/ContentContext';
import { useServicesContext } from '../context/ServicesContext';
import { usePropertiesContext } from '../context/PropertiesContext';

const DashboardView: React.FC = () => {
  const { news, notifications } = useContentContext();
  const { properties } = usePropertiesContext();
  const { categories } = useServicesContext();
  
  const firstServiceLink = (categories.length > 0 && categories[0].subCategories.length > 0)
    ? `/services/subcategory/${categories[0].subCategories[0].id}`
    : '/';

  const kpiData = [
    { title: "إجمالي الخدمات", value: "2,350", change: "+50", changeLabel: "أضيف هذا الشهر", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: firstServiceLink, changeType: 'positive' as const },
    { title: "إجمالي العقارات", value: properties.length.toString(), change: "+3", changeLabel: "أضيف هذا الشهر", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/properties", changeType: 'positive' as const },
    { title: "إجمالي المستخدمين", value: "850", change: "+80", changeLabel: "جديد هذا الشهر", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/users", changeType: 'positive' as const },
    { title: "استخدام الباصات", value: "1,240 رحلة", change: "+150", changeLabel: "هذا الأسبوع", icon: <BusIcon className="w-8 h-8 text-purple-400" />, to: "/transportation", changeType: 'positive' as const },
    { title: "الأخبار والإشعارات", value: (news.length + notifications.length).toString(), change: "+5", changeLabel: "هذا الأسبوع", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/news", changeType: 'positive' as const },
    { title: "بلاغات الطوارئ", value: "28 بلاغ", change: "قبل 12 د", changeLabel: "آخر بلاغ", icon: <ShieldExclamationIcon className="w-8 h-8 text-rose-400" />, to: "/emergency", changeType: 'neutral' as const },
  ];

  return (
    <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {kpiData.map((kpi, index) => (
          <Link to={kpi.to} key={index} className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 rounded-xl">
            <KpiCard 
              title={kpi.title} 
              value={kpi.value} 
              change={kpi.change}
              changeLabel={kpi.changeLabel}
              icon={kpi.icon} 
              changeType={kpi.changeType}
            />
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left/Center column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><UserIcon className="w-6 h-6 mr-2" /> نمو المستخدمين الشهري</h3>
            <UserActivityChart />
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><MapIcon className="w-6 h-6 mr-2" /> خريطة الخدمات والمرافق في هليوبوليس</h3>
            <PropertyMap />
          </div>
        </div>
        
        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><Bars3Icon className="w-6 h-6 mr-2" /> أحدث الأنشطة</h3>
            <RecentActivityTable />
          </div>
          <AlertsPanel />
          <UsersToVerify />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default DashboardView;