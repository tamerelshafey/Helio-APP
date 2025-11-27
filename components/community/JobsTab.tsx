import React, { useState, useMemo } from 'react';
import type { JobPosting, AppUser, MarketplaceItemStatus } from '../../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getJobs, deleteJob } from '../../api/marketplaceApi';
import { getUsers } from '../../api/usersApi';
import { useStore } from '../../store';
import KpiCard from '../common/KpiCard';
import TabButton from '../common/TabButton';
import EmptyState from '../common/EmptyState';
import { BriefcaseIcon, TrashIcon, MapPinIcon } from '../common/Icons';
import StatusBadge from '../common/StatusBadge';
import QueryStateWrapper from '../common/QueryStateWrapper';

const JobsTab: React.FC = () => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);

    const jobsQuery = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
    const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers });

    const jobs = jobsQuery.data || [];
    const users = usersQuery.data || [];

    const [activeSubTab, setActiveSubTab] = useState<MarketplaceItemStatus>('approved');

    const deleteJobMutation = useMutation({
        mutationFn: deleteJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            showToast('تم حذف إعلان الوظيفة بنجاح!');
        }
    });

    const getUserById = (id: number) => users.find(u => u.id === id);
    const filteredItems = useMemo(() => jobs.filter(item => item.status === activeSubTab), [jobs, activeSubTab]);
    const stats = useMemo(() => ({
        approved: jobs.filter(i => i.status === 'approved').length,
        expired: jobs.filter(i => i.status === 'expired').length,
        total: jobs.length
    }), [jobs]);

    const handleDeleteClick = (id: number) => { 
        if (window.confirm('هل أنت متأكد من حذف إعلان هذه الوظيفة نهائياً؟')) { 
            deleteJobMutation.mutate(id);
        } 
    };

    const JobCard: React.FC<{ job: JobPosting; author?: AppUser }> = ({ job, author }) => (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold">{job.title}</h3><StatusBadge status={job.status} /></div>
                <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2">{job.companyName}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4"><span className="flex items-center gap-1"><MapPinIcon className="w-4 h-4"/>{job.location}</span><span>•</span><span>{job.jobType}</span></div>
                <p className="text-sm flex-grow">{job.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t mt-2">
                    <p><strong>بواسطة:</strong> {author?.name || 'غير معروف'}</p>
                    <p><strong>للتواصل:</strong> {job.contactInfo}</p>
                    <p><strong>تاريخ النشر:</strong> {job.creationDate}</p>
                    {job.expiryDate && <p><strong>ينتهي في:</strong> {job.expiryDate}</p>}
                </div>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center gap-2">
                <button onClick={() => handleDeleteClick(job.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
            </div>
        </div>
    );

    return (
        <QueryStateWrapper queries={[jobsQuery, usersQuery]}>
            <div className="animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KpiCard title="إجمالي الوظائف" value={stats.total.toString()} icon={<BriefcaseIcon className="w-8 h-8 text-cyan-400" />} />
                    <KpiCard title="الوظائف الموافق عليها" value={stats.approved.toString()} icon={<BriefcaseIcon className="w-8 h-8 text-green-400" />} />
                    <KpiCard title="الوظائف المنتهية" value={stats.expired.toString()} icon={<BriefcaseIcon className="w-8 h-8 text-red-400" />} />
                </div>
                <div className="flex flex-wrap gap-2">
                    <TabButton active={activeSubTab === 'approved'} onClick={() => setActiveSubTab('approved')}>الموافق عليه</TabButton>
                    <TabButton active={activeSubTab === 'rejected'} onClick={() => setActiveSubTab('rejected')}>المرفوض</TabButton>
                    <TabButton active={activeSubTab === 'expired'} onClick={() => setActiveSubTab('expired')}>منتهي الصلاحية</TabButton>
                </div>
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => <JobCard key={item.id} job={item} author={getUserById(item.authorId)} />)}
                    </div>
                ) : <EmptyState icon={<BriefcaseIcon className="w-16 h-16 text-slate-400" />} title="لا توجد وظائف" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
            </div>
        </QueryStateWrapper>
    );
};

export default JobsTab;
