import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, setUserAccountType } from '../../api/usersApi';
import { getServices } from '../../api/servicesApi';
import { useStore } from '../../store';
import { ArrowTrendingDownIcon } from '../common/Icons';
import { ServiceProviderTableSkeleton } from '../common/SkeletonLoader';
import QueryStateWrapper from '../common/QueryStateWrapper';

const ServiceProvidersTab: React.FC = () => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);
    const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const servicesQuery = useQuery({ queryKey: ['services'], queryFn: getServices });
    
    const { data: users = [] } = usersQuery;
    const { data: services = [] } = servicesQuery;
    
    const setUserAccountTypeMutation = useMutation({
        mutationFn: setUserAccountType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast('تم تحديث نوع الحساب بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });

    const providers = useMemo(() => users.filter(u => u.accountType === 'service_provider'), [users]);

    return (
        <div className="animate-fade-in overflow-x-auto">
            <QueryStateWrapper queries={[usersQuery, servicesQuery]} loader={<ServiceProviderTableSkeleton />}>
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">مقدم الخدمة</th>
                            <th scope="col" className="px-6 py-3">الخدمات المرتبطة</th>
                            <th scope="col" className="px-6 py-3">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {providers.map(provider => {
                            const linkedServices = services.filter(s => s.providerId === provider.id);
                            return (
                                <tr key={provider.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">
                                        <Link to={`/dashboard/users/${provider.id}`} className="flex items-center gap-3 group">
                                            <img src={provider.avatar} alt={provider.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">{provider.name}</div>
                                                <div className="text-xs">{provider.email}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        {linkedServices.length > 0 ? (
                                            <ul className="text-xs space-y-1">
                                                {linkedServices.map(s => <li key={s.id}>- {s.name}</li>)}
                                            </ul>
                                        ) : <span className="text-xs text-gray-400">لا يوجد</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setUserAccountTypeMutation.mutate({ userId: provider.id, accountType: 'user' })} className="p-2 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/50 rounded-md" title="إلغاء الترقية إلى مستخدم عادي"><ArrowTrendingDownIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {providers.length === 0 && <p className="text-center py-8">لا يوجد مقدمو خدمات بعد.</p>}
            </QueryStateWrapper>
        </div>
    );
};

export default ServiceProvidersTab;