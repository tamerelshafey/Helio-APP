import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import KpiCard from '../common/KpiCard';
import UserActivityChart from './UserActivityChart';
import RecentActivityTable from './RecentActivityTable';
import AlertsPanel from './AlertsPanel';
import UsersToVerify from './UsersToVerify';
import Footer from '../common/Footer';
import { UserIcon, WrenchScrewdriverIcon, HomeModernIcon, UserGroupIcon, NewspaperIcon, Bars3Icon, ChatBubbleOvalLeftIcon } from '../common/Icons';
import { useServicesContext } from '../../context/ServicesContext';
import TopServicesChart from './TopServicesChart';
import CategoryDistributionChart from './CategoryDistributionChart';
import { getDashboardStats, getUserGrowth, getRecentActivities, getAlerts, getPendingUsers } from '../../api/dashboardApi';
import { GeneralDashboardSkeleton } from '../common/SkeletonLoader';


const GeneralDashboard: React.FC = () => {
    // Keep contexts for full data lists required by some child components or for links
    const { services, categories } = useServicesContext();

    const { data: statsData, isLoading: isLoadingStats } = useQuery({ 
        queryKey: ['dashboardStats'], 
        queryFn: getDashboardStats 
    });

    const { data: userGrowthData, isLoading: isLoadingUserGrowth } = useQuery({
        queryKey: ['userGrowth'],
        queryFn: getUserGrowth
    });
    
    const { data: recentActivities, isLoading: isLoadingActivities } = useQuery({
        queryKey: ['recentActivities'],
        queryFn: getRecentActivities
    });
    
    const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
        queryKey: ['alerts'],
        queryFn: getAlerts
    });
    
    const { data: pendingUsers, isLoading: isLoadingPendingUsers } = useQuery({
        queryKey: ['pendingUsers'],
        queryFn: getPendingUsers
    });
    
    const isLoading = isLoadingStats || isLoadingUserGrowth || isLoadingActivities || isLoadingAlerts || isLoadingPendingUsers;

    const firstServiceLink = (categories.length > 0 && categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0])
        ? `/services/subcategory/${categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0].id}`
        : '/services-overview';

    const kpiData = React.useMemo(() => {
      if (!statsData) return [];
      return [
        { title: "إجمالي الخدمات", value: statsData.services.total.toString(), change: `+${statsData.services.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: firstServiceLink, changeType: 'positive' as const },
        { title: "إجمالي العقارات", value: statsData.properties.total.toString(), change: `+${statsData.properties.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/properties", changeType: 'positive' as const },
        { title: "إجمالي المستخدمين", value: statsData.users.total.toString(), change: `+${statsData.users.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/users", changeType: 'positive' as const },
        { title: "منشورات المجتمع", value: statsData.community.total.toString(), change: `+${statsData.community.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <ChatBubbleOvalLeftIcon className="w-8 h-8 text-fuchsia-400" />, to: "/community", changeType: 'positive' as const },
        { title: "الأخبار والإشعارات", value: statsData.content.total.toString(), change: `+${statsData.content.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/news", changeType: 'positive' as const },
      ];
  }, [statsData, firstServiceLink]);


  if (isLoading || kpiData.length === 0) {
      return <GeneralDashboardSkeleton />;
  }

  return (
    <>
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-6">
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
            <UserActivityChart data={userGrowthData || []} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopServicesChart services={services} />
            <CategoryDistributionChart services={services} categories={categories} />
          </div>
        </div>
        
        {/* Right column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><Bars3Icon className="w-6 h-6 mr-2" /> أحدث الأنشطة</h3>
            <RecentActivityTable activities={recentActivities || []} />
          </div>
          <AlertsPanel alerts={alerts || []} />
          <UsersToVerify users={pendingUsers || []} />
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default GeneralDashboard;