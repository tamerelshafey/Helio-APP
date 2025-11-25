import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../context/AuthContext';
import KpiCard from '../common/KpiCard';
import UserActivityChart from './UserActivityChart';
import RecentActivityTable from './RecentActivityTable';
import AlertsPanel from './AlertsPanel';
import UsersToVerify from './UsersToVerify';
import Footer from '../common/Footer';
import { UserIcon, WrenchScrewdriverIcon, HomeModernIcon, UserGroupIcon, NewspaperIcon, Bars3Icon, ChatBubbleOvalLeftIcon, SparklesIcon } from '../common/Icons';
import { getDashboardStats, getUserGrowth, getRecentActivities, getAlerts, getPendingUsers } from '../../api/dashboardApi';
import { GeneralDashboardSkeleton } from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import ContentOverviewChart from './ContentOverviewChart';


const GeneralDashboard: React.FC = () => {
    const { currentUser } = useAuthContext();

    const { data: statsData, isLoading: isLoadingStats } = useQuery({ 
        queryKey: ['dashboardStats'], 
        queryFn: getDashboardStats 
    });

    const { data: userGrowthData, isLoading: isLoadingUserGrowth } = useQuery({
        queryKey: ['userGrowth'],
        queryFn: getUserGrowth
    });
    
    const { data: recentActivities, isLoading: isLoadingActivities, isError: isErrorActivities, refetch: refetchActivities } = useQuery({
        queryKey: ['recentActivities'],
        queryFn: getRecentActivities,
        retry: false,
    });
    
    const { data: alerts, isLoading: isLoadingAlerts } = useQuery({
        queryKey: ['alerts'],
        queryFn: getAlerts
    });
    
    const { data: pendingUsers, isLoading: isLoadingPendingUsers } = useQuery({
        queryKey: ['pendingUsers'],
        queryFn: getPendingUsers
    });
    
    const isLoading = isLoadingStats || isLoadingUserGrowth || isLoadingAlerts || isLoadingPendingUsers || isLoadingActivities;

    const kpiData = React.useMemo(() => {
      if (!statsData) return [];
      return [
        { title: "إجمالي الخدمات", value: statsData.services.total.toString(), change: `+${statsData.services.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: "/dashboard/services-overview", changeType: 'positive' as const },
        { title: "إجمالي العقارات", value: statsData.properties.total.toString(), change: `+${statsData.properties.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/dashboard/properties", changeType: 'positive' as const },
        { title: "إجمالي المستخدمين", value: statsData.users.total.toString(), change: `+${statsData.users.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/dashboard/users", changeType: 'positive' as const },
        { title: "منشورات المجتمع", value: statsData.community.total.toString(), change: `+${statsData.community.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <ChatBubbleOvalLeftIcon className="w-8 h-8 text-fuchsia-400" />, to: "/dashboard/community", changeType: 'positive' as const },
        { title: "الأخبار والإشعارات", value: statsData.content.total.toString(), change: `+${statsData.content.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/dashboard/news", changeType: 'positive' as const },
      ];
  }, [statsData]);

  if (isLoading || kpiData.length === 0) {
      return <GeneralDashboardSkeleton />;
  }
  
  const today = new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-l from-cyan-500 to-purple-500 text-white shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">أهلاً بك مجدداً، {currentUser?.name || 'مدير النظام'}!</h2>
                    <p className="text-sm opacity-90 mt-1">{today}</p>
                </div>
                <SparklesIcon className="w-10 h-10 opacity-50" />
            </div>
        </div>

        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Center column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><UserIcon className="w-6 h-6 mr-2 rtl:ml-2" /> نمو المستخدمين الشهري</h3>
                    <UserActivityChart data={userGrowthData || []} />
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><Bars3Icon className="w-6 h-6 mr-2 rtl:ml-2" /> أحدث الأنشطة</h3>
                    {isLoadingActivities ? (
                        <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div></div>
                    ) : isErrorActivities ? (
                        <ErrorState message="فشل تحميل آخر الأنشطة." onRetry={refetchActivities} />
                    ) : (
                        <RecentActivityTable activities={recentActivities || []} />
                    )}
                </div>
            </div>
            
            {/* Right column */}
            <div className="flex flex-col gap-8">
                {statsData && <ContentOverviewChart stats={statsData} />}
                <AlertsPanel alerts={alerts || []} />
                <UsersToVerify users={pendingUsers || []} />
            </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default GeneralDashboard;