import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, saveUser } from '../api/usersApi';
import { getServices } from '../api/servicesApi';
import { useCommunityContext } from '../context/CommunityContext';
import { useMarketplaceContext } from '../context/MarketplaceContext';
import { useOffersContext } from '../context/OffersContext';
import { ArrowLeftIcon, CalendarDaysIcon, WrenchScrewdriverIcon, DocumentDuplicateIcon, TagIcon, ChatBubbleOvalLeftIcon } from '../components/common/Icons';
import KpiCard from '../components/common/KpiCard';
import TabButton from '../components/common/TabButton';
import StatusBadge, { AccountTypeBadge } from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import QueryStateWrapper from '../components/common/QueryStateWrapper';

const UserDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();
    const numericUserId = Number(userId);
    const queryClient = useQueryClient();

    const userQuery = useQuery({ 
        queryKey: ['user', numericUserId], 
        queryFn: () => getUserById(numericUserId) 
    });
    const { data: user } = userQuery;
    
    const servicesQuery = useQuery({ queryKey: ['services'], queryFn: getServices });
    const { data: services = [] } = servicesQuery;
    const { communityPosts } = useCommunityContext();
    const { forSaleItems, jobs } = useMarketplaceContext();
    const { offerCodes } = useOffersContext();

    const [activeTab, setActiveTab] = useState('overview');

    const saveUserMutation = useMutation({
        mutationFn: saveUser,
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.setQueryData(['user', updatedUser.id], updatedUser);
        }
    });

    const userStats = useMemo(() => {
        if (!user) return null;
        return {
            services: user.accountType === 'service_provider' ? services.filter(s => s.providerId === user.id) : [],
            posts: communityPosts.filter(p => p.authorId === user.id),
            saleItems: forSaleItems.filter(i => i.authorId === user.id),
            jobItems: jobs.filter(j => j.authorId === user.id),
            offerCodes: offerCodes.filter(c => c.userId === user.id)
        };
    }, [user, services, communityPosts, forSaleItems, jobs, offerCodes]);

    const renderTabContent = () => {
        if (!user || !userStats) return null;
        
        switch(activeTab) {
            case 'services':
                return userStats.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userStats.services.map(s => <div key={s.id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg"><p className="font-bold">{s.name}</p><p className="text-sm text-gray-500">{s.address}</p></div>)}
                    </div>
                ) : <EmptyState icon={<WrenchScrewdriverIcon className="w-12 h-12 text-slate-400" />} title="لا توجد خدمات" message="هذا المستخدم لم يضف أي خدمات." />;
            case 'community':
                 return userStats.posts.length > 0 ? (
                    <div className="space-y-3">
                        {userStats.posts.map(p => <div key={p.id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg"><p className="font-semibold line-clamp-2">{p.content}</p><p className="text-xs text-gray-500 mt-1">{new Date(p.timestamp).toLocaleDateString()}</p></div>)}
                    </div>
                ) : <EmptyState icon={<ChatBubbleOvalLeftIcon className="w-12 h-12 text-slate-400" />} title="لا توجد منشورات" message="هذا المستخدم لم يشارك في دوائر النقاش." />;
            case 'marketplace':
                const allItems = [...userStats.saleItems, ...userStats.jobItems];
                 return allItems.length > 0 ? (
                    <div className="space-y-3">
                         {allItems.map(item => <div key={item.id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg"><p className="font-bold">{item.title}</p><StatusBadge status={item.status}/></div>)}
                    </div>
                ) : <EmptyState icon={<TagIcon className="w-12 h-12 text-slate-400" />} title="لا توجد إعلانات" message="هذا المستخدم لم يضف أي إعلانات في السوق." />;
            case 'offers':
                return userStats.offerCodes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {userStats.offerCodes.map(c => <div key={c.id} className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-center"><p className="font-mono font-bold text-lg">{c.code}</p><p className={`text-sm font-semibold ${c.isRedeemed ? 'text-red-500' : 'text-green-500'}`}>{c.isRedeemed ? 'تم الاستخدام' : 'لم يستخدم'}</p></div>)}
                    </div>
                ) : <EmptyState icon={<TagIcon className="w-12 h-12 text-slate-400" />} title="لا توجد أكواد" message="هذا المستخدم لم يطلب أي أكواد عروض." />;
            default: // overview
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">تعديل المعلومات</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="block text-sm font-medium mb-1">الاسم</label><input type="text" value={user.name} onChange={e => saveUserMutation.mutate({...user, name: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
                             <div><label className="block text-sm font-medium mb-1">البريد الإلكتروني</label><input type="email" value={user.email} onChange={e => saveUserMutation.mutate({...user, email: e.target.value})} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" /></div>
                             <div><label className="block text-sm font-medium mb-1">الحالة</label><select value={user.status} onChange={e => saveUserMutation.mutate({...user, status: e.target.value as any})} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2"><option value="active">مفعل</option><option value="pending">معلق</option><option value="banned">محظور</option></select></div>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate('/dashboard/users')} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة إلى قائمة المستخدمين</span>
            </button>
            <QueryStateWrapper queries={[userQuery, servicesQuery]}>
                {user && userStats ? (
                    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                            <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-cyan-200 dark:ring-cyan-700" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <StatusBadge status={user.status} />
                                    <AccountTypeBadge type={user.accountType} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
                            <KpiCard title="تاريخ الانضمام" value={user.joinDate} icon={<CalendarDaysIcon className="w-6 h-6"/>} />
                            <KpiCard title="الخدمات" value={userStats.services.length.toString()} icon={<WrenchScrewdriverIcon className="w-6 h-6"/>} />
                            <KpiCard title="المنشورات" value={userStats.posts.length.toString()} icon={<DocumentDuplicateIcon className="w-6 h-6"/>} />
                            <KpiCard title="العروض" value={userStats.offerCodes.length.toString()} icon={<TagIcon className="w-6 h-6"/>} />
                        </div>

                        <div className="border-b border-gray-200 dark:border-slate-700">
                            <nav className="-mb-px flex gap-4" aria-label="Tabs">
                                <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>نظرة عامة</TabButton>
                                {user.accountType === 'service_provider' && <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>الخدمات</TabButton>}
                                <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')}>نشاط المجتمع</TabButton>
                                <TabButton active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')}>إعلانات السوق</TabButton>
                                <TabButton active={activeTab === 'offers'} onClick={() => setActiveTab('offers')}>العروض</TabButton>
                            </nav>
                        </div>
                        <div className="py-6">
                            {renderTabContent()}
                        </div>
                    </div>
                ) : (
                     <div className="text-center p-8">
                        <h1 className="text-2xl font-bold">لم يتم العثور على المستخدم</h1>
                        <Link to="/dashboard/users" className="text-cyan-500 hover:underline mt-4">العودة إلى قائمة المستخدمين</Link>
                    </div>
                )}
            </QueryStateWrapper>
        </div>
    );
};

export default UserDetailPage;