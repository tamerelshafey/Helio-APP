import React from 'react';
import { Link } from 'react-router-dom';
import KpiCard from '../common/KpiCard';
import UserActivityChart from './UserActivityChart';
import RecentActivityTable from './RecentActivityTable';
import AlertsPanel from './AlertsPanel';
import UsersToVerify from './UsersToVerify';
import Footer from '../common/Footer';
import { UserIcon, WrenchScrewdriverIcon, HomeModernIcon, UserGroupIcon, NewspaperIcon, Bars3Icon, ChatBubbleOvalLeftIcon, TagIcon } from '../common/Icons';
import { useContentContext } from '../../context/ContentContext';
import { useServicesContext } from '../../context/ServicesContext';
import { usePropertiesContext } from '../../context/PropertiesContext';
import { useUserManagementContext } from '../../context/UserManagementContext';
import { useCommunityContext } from '../../context/CommunityContext';
import TopServicesChart from './TopServicesChart';
import CategoryDistributionChart from './CategoryDistributionChart';

const GeneralDashboard: React.FC = () => {
  const { news, notifications } = useContentContext();
  const { properties } = usePropertiesContext();
  const { services, categories } = useServicesContext();
  const { users } = useUserManagementContext();
  const { communityPosts, discussionCircles } = useCommunityContext();
  
  const thirtyDaysAgo = React.useMemo(() => {
      const date = new Date();
      date.setDate(date.getDate() - 30);
      return date;
  }, []);

  const firstServiceLink = (categories.length > 0 && categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0])
    ? `/services/subcategory/${categories.find(c => c.name !== "المدينة والجهاز")?.subCategories[0].id}`
    : '/services-overview';

  const kpiData = React.useMemo(() => {
      const newServicesCount = services.filter(s => new Date(s.creationDate) >= thirtyDaysAgo).length;
      const newPropertiesCount = properties.filter(p => new Date(p.creationDate) >= thirtyDaysAgo).length;
      const newUsersCount = users.filter(u => new Date(u.joinDate) >= thirtyDaysAgo).length;
      const newNewsAndNotifsCount = news.filter(n => new Date(n.date) >= thirtyDaysAgo).length + notifications.filter(n => new Date(n.startDate) >= thirtyDaysAgo).length;
      const newPostsCount = communityPosts.filter(p => new Date(p.timestamp) >= thirtyDaysAgo).length;
      
      const buySellCircle = discussionCircles.find(c => c.name === 'البيع والشراء');
      const buySellPosts = buySellCircle ? communityPosts.filter(p => p.circleId === buySellCircle.id) : [];
      const newBuySellPostsCount = buySellCircle ? buySellPosts.filter(p => new Date(p.timestamp) >= thirtyDaysAgo).length : 0;
      
      return [
        { title: "إجمالي الخدمات", value: services.length.toString(), change: `+${newServicesCount}`, changeLabel: "آخر 30 يوم", icon: <WrenchScrewdriverIcon className="w-8 h-8 text-cyan-400" />, to: firstServiceLink, changeType: 'positive' as const },
        { title: "إجمالي العقارات", value: properties.length.toString(), change: `+${newPropertiesCount}`, changeLabel: "آخر 30 يوم", icon: <HomeModernIcon className="w-8 h-8 text-amber-400" />, to: "/properties", changeType: 'positive' as const },
        { title: "إجمالي المستخدمين", value: users.length.toString(), change: `+${newUsersCount}`, changeLabel: "آخر 30 يوم", icon: <UserGroupIcon className="w-8 h-8 text-lime-400" />, to: "/users", changeType: 'positive' as const },
        { title: "منشورات المجتمع", value: communityPosts.length.toString(), change: `+${newPostsCount}`, changeLabel: "آخر 30 يوم", icon: <ChatBubbleOvalLeftIcon className="w-8 h-8 text-fuchsia-400" />, to: "/community", changeType: 'positive' as const },
        { title: "البيع والشراء", value: buySellPosts.length.toString(), change: `+${newBuySellPostsCount}`, changeLabel: "آخر 30 يوم", icon: <TagIcon className="w-8 h-8 text-teal-400" />, to: "/community", changeType: 'positive' as const },
        { title: "الأخبار والإشعارات", value: (news.length + notifications.length).toString(), change: `+${newNewsAndNotifsCount}`, changeLabel: "آخر 30 يوم", icon: <NewspaperIcon className="w-8 h-8 text-indigo-400" />, to: "/news", changeType: 'positive' as const },
      ];
  }, [categories, properties, news, notifications, services, users, communityPosts, discussionCircles, thirtyDaysAgo, firstServiceLink]);


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

export default GeneralDashboard;