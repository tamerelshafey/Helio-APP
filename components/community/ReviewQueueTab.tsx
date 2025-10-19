import React from 'react';
import { useMarketplaceContext } from '../../context/MarketplaceContext';
import { useAppContext } from '../../context/AppContext';
import { useCommunityContext } from '../../context/CommunityContext';
import { useUserManagementContext } from '../../context/UserManagementContext';
import { useUIContext } from '../../context/UIContext';
import { 
    CheckCircleIcon, XCircleIcon, TagIcon, BriefcaseIcon, ArchiveBoxIcon,
    DocumentDuplicateIcon, ChatBubbleOvalLeftIcon, TrashIcon
} from '../common/Icons';
import EmptyState from '../common/EmptyState';
import { useMemo } from 'react';

const ReviewQueueTab: React.FC = () => {
    const { forSaleItems, jobs, handleApproveItem, handleRejectItem } = useMarketplaceContext();
    const { lostAndFoundItems, handleApproveLostAndFoundItem, handleRejectLostAndFoundItem } = useAppContext();
    const { 
        communityPosts, handleDismissPostReports, handleDeletePost, 
        handleDismissCommentReports, handleDeleteComment 
    } = useCommunityContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();

    const pendingSale = useMemo(() => forSaleItems.filter(item => item.status === 'pending'), [forSaleItems]);
    const pendingJobs = useMemo(() => jobs.filter(item => item.status === 'pending'), [jobs]);
    const pendingLostFound = useMemo(() => lostAndFoundItems.filter(item => item.moderationStatus === 'pending'), [lostAndFoundItems]);
    const reportedPosts = useMemo(() => communityPosts.filter(p => p.reports && p.reports.length > 0), [communityPosts]);
    const reportedComments = useMemo(() => 
        communityPosts.flatMap(post => 
            post.comments
                .filter(c => c.reports && c.reports.length > 0)
                .map(c => ({ ...c, postContent: post.content, postId: post.id }))
        ), 
    [communityPosts]);

    const totalPending = pendingSale.length + pendingJobs.length + pendingLostFound.length + reportedPosts.length + reportedComments.length;

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
    
    // FIX: Changed component definition to use React.FC to allow for key prop.
    const ItemCard: React.FC<{ item: any, type: 'sale' | 'job' | 'lostfound', onAction: (id: number, action: 'approve' | 'reject') => void }> = ({ item, type, onAction }) => (
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
    
    // FIX: Changed component definition to use React.FC to allow for key prop.
    const ReportedItemCard: React.FC<{ item: any, type: 'post' | 'comment', onDismiss: () => void, onDelete: () => void }> = ({ item, type, onDismiss, onDelete }) => {
        const author = users.find(u => u.id === item.authorId);
        return (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4 border-l-4 border-red-500">
                <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                        {type === 'post' ? <DocumentDuplicateIcon className="w-5 h-5 text-red-500" /> : <ChatBubbleOvalLeftIcon className="w-5 h-5 text-red-500" />}
                        <h3 className="font-bold">{type === 'post' ? 'منشور مُبلغ عنه' : 'تعليق مُبلغ عنه'}</h3>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-slate-700 p-2 rounded-md">{item.content}</p>
                    {type === 'comment' && <p className="text-xs text-gray-400 mt-1">على المنشور: "{item.postContent.substring(0, 50)}..."</p>}
                    <p className="text-xs text-gray-500 mt-2">بواسطة: {author?.name || 'مستخدم'} | عدد البلاغات: {item.reports?.length || 0}</p>
                </div>
                <div className="flex-shrink-0 flex sm:flex-col items-center justify-end gap-2">
                    <button onClick={onDismiss} className="flex items-center justify-center gap-2 w-24 p-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"><CheckCircleIcon className="w-5 h-5" /> تجاهل</button>
                    <button onClick={onDelete} className="flex items-center justify-center gap-2 w-24 p-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md"><TrashIcon className="w-5 h-5" /> حذف</button>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-xl font-bold">عناصر بانتظار المراجعة ({totalPending})</h2>
            {totalPending > 0 ? (
                <div className="space-y-4">
                    {reportedPosts.map(post => <ReportedItemCard key={`post-report-${post.id}`} item={post} type="post" onDismiss={() => { handleDismissPostReports(post.id); showToast('تم تجاهل بلاغات المنشور.'); }} onDelete={() => { handleDeletePost(post.id); showToast('تم حذف المنشور.'); }} />)}
                    {reportedComments.map(comment => <ReportedItemCard key={`comment-report-${comment.id}`} item={comment} type="comment" onDismiss={() => { handleDismissCommentReports(comment.postId, comment.id); showToast('تم تجاهل بلاغات التعليق.'); }} onDelete={() => { handleDeleteComment(comment.postId, comment.id); showToast('تم حذف التعليق.'); }} />)}
                    {pendingSale.map(item => <ItemCard key={`sale-${item.id}`} item={item} type="sale" onAction={(id, action) => handleApproval('sale', id, action)} />)}
                    {pendingJobs.map(item => <ItemCard key={`job-${item.id}`} item={item} type="job" onAction={(id, action) => handleApproval('job', id, action)} />)}
                    {pendingLostFound.map(item => <ItemCard key={`lf-${item.id}`} item={item} type="lostfound" onAction={(id, action) => handleApproval('lostfound', id, action)} />)}
                </div>
            ) : (
                <EmptyState icon={<CheckCircleIcon className="w-16 h-16 text-slate-400" />} title="لا توجد طلبات للمراجعة" message="كل شيء على ما يرام! لا توجد عناصر جديدة بانتظار موافقتك." />
            )}
        </div>
    );
};

export default ReviewQueueTab;
