import React, { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '../../store';
import KpiCard from '../common/KpiCard';
import RecentActivityTable from './RecentActivityTable';
import AlertsPanel from './AlertsPanel';
import UsersToVerify from './UsersToVerify';
import Footer from '../common/Footer';
import { UserIcon, WrenchScrewdriverIcon, HomeModernIcon, UserGroupIcon, NewspaperIcon, Bars3Icon, ChatBubbleOvalLeftIcon, SparklesIcon } from '../common/Icons';
import { getDashboardStats, getUserGrowth, getRecentActivities, getAlerts, getPendingUsers } from '../../api/dashboardApi';
import { getServices, getCategories } from '../../api/servicesApi';
import { GeneralDashboardSkeleton, ChartSkeleton } from '../common/SkeletonLoader';
import ErrorState from '../common/ErrorState';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Lazy load chart components
const UserActivityChart = lazy(() => import('./UserActivityChart'));
const ContentOverviewChart = lazy(() => import('./ContentOverviewChart'));
const TopServicesChart = lazy(() => import('./TopServicesChart'));
const CategoryDistributionChart = lazy(() => import('./CategoryDistributionChart'));


const GeneralDashboard: React.FC = () => {
    useDocumentTitle('لوحة التحكم | Helio');
    const currentUser = useStore((state) => state.currentUser);

    const { data: services = [], isLoading: isLoadingServices } = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

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
    
    const isLoading = isLoadingStats || isLoadingUserGrowth || isLoadingAlerts || isLoadingPendingUsers || isLoadingActivities || isLoadingServices || isLoadingCategories;

    const firstServiceLink = (categories.length > 0 && categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0])
        ? `/dashboard/services/subcategory/${categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0].id}`
        : '/dashboard/services-overview';

    const kpiData = React.useMemo(() => {
      if (!statsData) return [];
      return [
        { title: "إجمالي الخدمات", value: statsData.services.total.toString(), change: `+${statsData.services.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: firstServiceLink, changeType: 'positive' as const },
        { title: "إجمالي العقارات", value: statsData.properties.total.toString(), change: `+${statsData.properties.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/dashboard/properties", changeType: 'positive' as const },
        { title: "إجمالي المستخدمين", value: statsData.users.total.toString(), change: `+${statsData.users.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/dashboard/users", changeType: 'positive' as const },
        { title: "منشورات المجتمع", value: statsData.community.total.toString(), change: `+${statsData.community.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <ChatBubbleOvalLeftIcon className="w-8 h-8 text-fuchsia-400" />, to: "/dashboard/community", changeType: 'positive' as const },
        { title: "الأخبار والإشعارات", value: statsData.content.total.toString(), change: `+${statsData.content.newLast30Days}`, changeLabel: "آخر 30 يوم", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/dashboard/news", changeType: 'positive' as const },
      ];
  }, [statsData, firstServiceLink]);


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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left/Center column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><UserIcon className="w-6 h-6 mr-2 rtl:ml-2" /> نمو المستخدمين الشهري</h3>
                    <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div></div>}>
                        <UserActivityChart data={userGrowthData || []} />
                    </Suspense>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Suspense fallback={<ChartSkeleton />}>
                        <TopServicesChart services={services} />
                    </Suspense>
                    <Suspense fallback={<ChartSkeleton />}>
                        <CategoryDistributionChart services={services} categories={categories} />
                    </Suspense>
                </div>
            </div>
            
            {/* Right column */}
            <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center"><Bars3Icon className="w-6 h-6 mr-2 rtl:ml-2" /> أحدث الأنشطة</h3>
                    {isLoadingActivities ? (
                        <div className="flex justify-center items-center h-48"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div></div>
                    ) : isErrorActivities ? (
                        <ErrorState message="فشل تحميل آخر الأنشطة." onRetry={refetchActivities} />
                    ) : (
                        <RecentActivityTable activities={recentActivities || []} />
                    )}
                </div>
                <Suspense fallback={<ChartSkeleton />}>
                    {statsData && <ContentOverviewChart stats={statsData} />}
                </Suspense>
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