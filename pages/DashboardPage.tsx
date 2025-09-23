import React from 'react';
import { Link } from 'react-router-dom';
import KpiCard from '../components/common/KpiCard';
import UserActivityChart from '../components/dashboard/UserActivityChart';
import RecentActivityTable from '../components/dashboard/RecentActivityTable';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import UsersToVerify from '../components/dashboard/UsersToVerify';
import Footer from '../components/common/Footer';
import { UserIcon, MapIcon, WrenchScrewdriverIcon, ShieldExclamationIcon, HomeModernIcon, UserGroupIcon, BusIcon, NewspaperIcon, Bars3Icon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';
import PropertyManagerDashboard from '../components/dashboard/PropertyManagerDashboard';
import NewsManagerDashboard from '../components/dashboard/NewsManagerDashboard';
import TransportationManagerDashboard from '../components/dashboard/TransportationManagerDashboard';
import ServiceManagerDashboard from '../components/dashboard/ServiceManagerDashboard';
import TopServicesChart from '../components/dashboard/TopServicesChart';
import CategoryDistributionChart from '../components/dashboard/CategoryDistributionChart';

const GeneralDashboard: React.FC = () => {
  const { categories, properties, news, notifications, services, users } = useAppContext();
  
  const thirtyDaysAgo = React.useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
  }, []);

  const kpiData = React.useMemo(() => {
      const newServicesCount = services.filter(s => new Date(s.creationDate) >= thirtyDaysAgo).length;
      const newPropertiesCount = properties.filter(p => new Date(p.creationDate) >= thirtyDaysAgo).length;
      const newUsersCount = users.filter(u => new Date(u.joinDate) >= thirtyDaysAgo).length;
      const newNewsAndNotifsCount = news.filter(n => new Date(n.date) >= thirtyDaysAgo).length + notifications.filter(n => new Date(n.startDate) >= thirtyDaysAgo).length;

      const firstServiceLink = (categories.length > 0 && categories[0].subCategories.length > 0)
        ? `/services/subcategory/${categories[0].subCategories[0].id}`
        : '/services-overview';
      
      return [
          { title: "إجمالي الخدمات", value: services.length.toString(), change: `+${newServicesCount}`, changeLabel: "آخر 30 يوم", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: firstServiceLink, changeType: 'positive' as const },
          { title: "إجمالي العقارات", value: properties.length.toString(), change: `+${newPropertiesCount}`, changeLabel: "آخر 30 يوم", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/properties", changeType: 'positive' as const },
          { title: "إجمالي المستخدمين", value: users.length.toString(), change: `+${newUsersCount}`, changeLabel: "آخر 30 يوم", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/users", changeType: 'positive' as const },
          { title: "استخدام الباصات", value: "1,240 رحلة", change: "+150", changeLabel: "هذا الأسبوع", icon: <BusIcon className="w-8 h-8 text-purple-400" />, to: "/transportation", changeType: 'positive' as const },
          { title: "الأخبار والإشعارات", value: (news.length + notifications.length).toString(), change: `+${newNewsAndNotifsCount}`, changeLabel: "آخر 30 يوم", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/news", changeType: 'positive' as const },
          { title: "بلاغات الطوارئ", value: "28 بلاغ", change: "قبل 12 د", changeLabel: "آخر بلاغ", icon: <ShieldExclamationIcon className="w-8 h-8 text-rose-400" />, to: "/emergency", changeType: 'neutral' as const },
      ];
  }, [categories, properties, news, notifications, services, users, thirtyDaysAgo]);

  return (
    <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6">
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
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TopServicesChart />
              <CategoryDistributionChart />
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

const DashboardPage: React.FC = () => {
    const { currentUser } = useAppContext();

    if (currentUser?.role === 'مسؤول العقارات') {
        return <PropertyManagerDashboard />;
    }
    
    if (currentUser?.role === 'مسؤول الاخبار والاعلانات والاشعارات') {
        return <NewsManagerDashboard />;
    }

    if (currentUser?.role === 'مسؤول الباصات') {
        return <TransportationManagerDashboard />;
    }

    if (currentUser?.role === 'مسؤول ادارة الخدمات') {
        return <ServiceManagerDashboard />;
    }

    return <GeneralDashboard />;
};

export default DashboardPage;