import React from 'react';
import { useMarketplaceContext } from '../../context/MarketplaceContext';
import { useAppContext } from '../../context/AppContext';
import { useUIContext } from '../../context/UIContext';
import { CheckCircleIcon, XCircleIcon, TagIcon, BriefcaseIcon, ArchiveBoxIcon } from '../common/Icons';
import EmptyState from '../common/EmptyState';

const ReviewQueueTab: React.FC = () => {
    const { forSaleItems, jobs, handleApproveItem, handleRejectItem } = useMarketplaceContext();
    const { lostAndFoundItems, handleApproveLostAndFoundItem, handleRejectLostAndFoundItem } = useAppContext();
    const { showToast } = useUIContext();

    const pendingSale = forSaleItems.filter(item => item.status === 'pending');
    const pendingJobs = jobs.filter(item => item.status === 'pending');
    const pendingLostFound = lostAndFoundItems.filter(item => item.moderationStatus === 'pending');

    const totalPending = pendingSale.length + pendingJobs.length + pendingLostFound.length;

    const handleApproval = (type: 'sale' | 'job' | 'lostfound', id: number, action: 'approve' | 'reject') => {
        if (type === 'sale') {
            action === 'approve' ? handleApproveItem('sale', id) : handleRejectItem('sale', id);
        } else if (type === 'job') {
            action === 'approve' ? handleApproveItem('job', id) : handleRejectItem('job', id);
        } else {
            action === 'approve' ? handleApproveLostAndFoundItem(id) : handleRejectLostAndFoundItem(id);
        }
        showToast(`تم ${action === 'approve' ? 'الموافقة على' : 'رفض'} العنصر بنجاح!`);
    };
    
    const ItemCard = ({ item, type, onAction }: { item: any, type: 'sale' | 'job' | 'lostfound', onAction: (id: number, action: 'approve' | 'reject') => void }) => (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    {type === 'sale' && <TagIcon className="w-5 h-5 text-cyan-500" />}
                    {type === 'job' && <BriefcaseIcon className="w-5 h-5 text-purple-500" />}
                    {type === 'lostfound' && <ArchiveBoxIcon className="w-5 h-5 text-amber-500" />}
                    <h3 className="font-bold">{item.title || item.itemName}</h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-400 mt-2">تاريخ الطلب: {item.creationDate || item.date}</p>
            </div>
            <div className="flex-shrink-0 flex sm:flex-col items-center justify-end gap-2">
                <button onClick={() => onAction(item.id, 'approve')} className="flex items-center justify-center gap-2 w-24 p-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md"><CheckCircleIcon className="w-5 h-5" /> موافقة</button>
                <button onClick={() => onAction(item.id, 'reject')} className="flex items-center justify-center gap-2 w-24 p-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md"><XCircleIcon className="w-5 h-5" /> رفض</button>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold">عناصر بانتظار المراجعة ({totalPending})</h2>
            {totalPending > 0 ? (
                <div className="space-y-4">
                    {pendingSale.map(item => <div key={`sale-${item.id}`}><ItemCard item={item} type="sale" onAction={(id, action) => handleApproval('sale', id, action)} /></div>)}
                    {pendingJobs.map(item => <div key={`job-${item.id}`}><ItemCard item={item} type="job" onAction={(id, action) => handleApproval('job', id, action)} /></div>)}
                    {pendingLostFound.map(item => <div key={`lf-${item.id}`}><ItemCard item={item} type="lostfound" onAction={(id, action) => handleApproval('lostfound', id, action)} /></div>)}
                </div>
            ) : (
                <EmptyState icon={<CheckCircleIcon className="w-16 h-16 text-slate-400" />} title="لا توجد طلبات للمراجعة" message="كل شيء على ما يرام! لا توجد عناصر جديدة بانتظار موافقتك." />
            )}
        </div>
    );
};

export default ReviewQueueTab;