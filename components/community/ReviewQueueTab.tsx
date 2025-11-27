import React, { useState, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSaleItems, getJobs, approveSaleItem, rejectSaleItem, approveJob, rejectJob } from '../../api/marketplaceApi';
import { getPosts, deletePost, deleteComment, dismissPostReports, dismissCommentReports, getLostAndFoundItems, approveLostAndFoundItem, rejectLostAndFoundItem } from '../../api/communityApi';
import { getUsers } from '../../api/usersApi';
import { useStore } from '../../store';
import { 
    CheckCircleIcon, XCircleIcon, TagIcon, BriefcaseIcon, ArchiveBoxIcon,
    DocumentDuplicateIcon, ChatBubbleOvalLeftIcon, TrashIcon, ShieldExclamationIcon, ChevronDownIcon
} from '../common/Icons';
import EmptyState from '../common/EmptyState';
import { ForSaleItem, JobPosting, LostAndFoundItem, AppUser } from '../../types';
import QueryStateWrapper from '../common/QueryStateWrapper';

// --- Reusable Section Component ---
const CollapsibleSection: React.FC<{
    title: string;
    icon: ReactNode;
    count: number;
    children: ReactNode;
    defaultOpen?: boolean;
}> = ({ title, icon, count, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (count === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-right"
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <h3 className="font-bold text-gray-800 dark:text-white">{title}</h3>
                    <span className="text-sm font-mono px-2 py-0.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-full">{count}</span>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    {children}
                </div>
            )}
        </div>
    );
};

// --- Specific Item Cards ---

const PendingItemCard: React.FC<{
    item: ForSaleItem | JobPosting | LostAndFoundItem;
    type: 'sale' | 'job' | 'lostfound';
    author?: AppUser;
    onAction: (type: 'sale' | 'job' | 'lostfound', id: number, action: 'approve' | 'reject') => void;
}> = ({ item, type, author, onAction }) => {
    const title = 'itemName' in item ? item.itemName : item.title;
    const date = 'creationDate' in item ? item.creationDate : item.date;
    const imageUrl = 'images' in item ? item.images[0] : ('imageUrl' in item ? item.imageUrl : undefined);
    
    return (
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start gap-4">
            {imageUrl && <img src={imageUrl} alt={title} className="w-full sm:w-24 h-24 object-cover rounded-md flex-shrink-0" />}
            <div className="flex-grow">
                <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{item.description}</p>
                <div className="text-xs text-gray-400 mt-2 flex items-center gap-4">
                    {author && <span><strong>بواسطة:</strong> {author.name}</span>}
                    <span><strong>تاريخ:</strong> {date}</span>
                    {'price' in item && <span className="font-bold text-cyan-600">السعر: {item.price} جنيه</span>}
                </div>
            </div>
            <div className="flex-shrink-0 flex sm:flex-col items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button onClick={() => onAction(type, item.id, 'approve')} className="w-full sm:w-28 flex items-center justify-center gap-2 p-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 rounded-md"><CheckCircleIcon className="w-5 h-5" /> موافقة</button>
                <button onClick={() => onAction(type, item.id, 'reject')} className="w-full sm:w-28 flex items-center justify-center gap-2 p-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md"><XCircleIcon className="w-5 h-5" /> رفض</button>
            </div>
        </div>
    );
};

const ReportedContentCard: React.FC<{
    item: any;
    type: 'post' | 'comment';
    author?: AppUser;
    onDismiss: () => void;
    onDelete: () => void;
}> = ({ item, type, author, onDismiss, onDelete }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl shadow-md border-l-4 border-red-500">
        <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    {type === 'post' ? <DocumentDuplicateIcon className="w-5 h-5 text-red-500" /> : <ChatBubbleOvalLeftIcon className="w-5 h-5 text-red-500" />}
                    <h4 className="font-bold text-gray-800 dark:text-white">{type === 'post' ? 'منشور مُبلغ عنه' : 'تعليق مُبلغ عنه'}</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-slate-100 dark:bg-slate-700 p-2 rounded-md italic">"{item.content}"</p>
                {type === 'comment' && <p className="text-xs text-gray-400 mt-1">على المنشور: "{item.postContent.substring(0, 50)}..."</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2"><strong>بواسطة:</strong> {author?.name || 'مستخدم'} | <strong>البلاغات:</strong> {item.reports?.length || 0}</p>
                
                {item.reports && item.reports.length > 0 && (
                    <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold">أسباب البلاغات:</p>
                        <div className="flex flex-wrap gap-1">
                            {item.reports.slice(0, 3).map((report: any, index: number) => (
                                <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">{report.reason}</span>
                            ))}
                            {item.reports.length > 3 && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">+{item.reports.length - 3} آخرون</span>}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 flex sm:flex-col items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button onClick={onDismiss} className="w-full sm:w-28 flex items-center justify-center gap-2 p-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md"><CheckCircleIcon className="w-5 h-5" /> تجاهل</button>
                <button onClick={onDelete} className="w-full sm:w-28 flex items-center justify-center gap-2 p-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md"><TrashIcon className="w-5 h-5" /> حذف</button>
            </div>
        </div>
    </div>
);


const ReviewQueueTab: React.FC = () => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);

    const saleItemsQuery = useQuery({ queryKey: ['saleItems'], queryFn: getSaleItems });
    const jobsQuery = useQuery({ queryKey: ['jobs'], queryFn: getJobs });
    const postsQuery = useQuery({ queryKey: ['posts'], queryFn: getPosts });
    const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const lostAndFoundQuery = useQuery({ queryKey: ['lostAndFound'], queryFn: getLostAndFoundItems });

    const forSaleItems = saleItemsQuery.data || [];
    const jobs = jobsQuery.data || [];
    const communityPosts = postsQuery.data || [];
    const users = usersQuery.data || [];
    const lostAndFoundItems = lostAndFoundQuery.data || [];

    // Marketplace Mutations
    const approveSaleMutation = useMutation({ mutationFn: approveSaleItem, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['saleItems'] }); }});
    const rejectSaleMutation = useMutation({ mutationFn: rejectSaleItem, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['saleItems'] }); }});
    const approveJobMutation = useMutation({ mutationFn: approveJob, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jobs'] }); }});
    const rejectJobMutation = useMutation({ mutationFn: rejectJob, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jobs'] }); }});

    // Community Mutations
    const dismissPostReportsMutation = useMutation({ mutationFn: dismissPostReports, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); showToast('تم تجاهل البلاغات.'); }});
    const dismissCommentReportsMutation = useMutation({ mutationFn: dismissCommentReports, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); showToast('تم تجاهل البلاغات.'); }});
    const deletePostMutation = useMutation({ mutationFn: deletePost, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); showToast('تم حذف المنشور.'); }});
    const deleteCommentMutation = useMutation({ mutationFn: deleteComment, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['posts'] }); showToast('تم حذف التعليق.'); }});
    
    // Lost & Found Mutations
    const approveLostFoundMutation = useMutation({ mutationFn: approveLostAndFoundItem, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lostAndFound'] }); }});
    const rejectLostFoundMutation = useMutation({ mutationFn: rejectLostAndFoundItem, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lostAndFound'] }); }});

    const getUser = (id: number): AppUser | undefined => users.find(u => u.id === id);

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
            action === 'approve' ? approveSaleMutation.mutate(id) : rejectSaleMutation.mutate(id);
        } else if (type === 'job') {
            action === 'approve' ? approveJobMutation.mutate(id) : rejectJobMutation.mutate(id);
        } else {
            action === 'approve' ? approveLostFoundMutation.mutate(id) : rejectLostFoundMutation.mutate(id);
        }
        showToast(`تم ${action === 'approve' ? 'الموافقة على' : 'رفض'} العنصر بنجاح!`);
    };

    return (
        <QueryStateWrapper queries={[saleItemsQuery, jobsQuery, postsQuery, usersQuery, lostAndFoundQuery]}>
            <div className="animate-fade-in space-y-6">
                <h2 className="text-xl font-bold">عناصر بانتظار المراجعة ({totalPending})</h2>
                {totalPending > 0 ? (
                    <div className="space-y-4">
                        <CollapsibleSection title="المنشورات والتعليقات المبلغ عنها" icon={<ShieldExclamationIcon className="w-6 h-6 text-red-500" />} count={reportedPosts.length + reportedComments.length}>
                            {reportedPosts.map(post => 
                                <ReportedContentCard 
                                    key={`post-${post.id}`} 
                                    item={post} type="post" 
                                    author={getUser(post.authorId)}
                                    onDismiss={() => dismissPostReportsMutation.mutate(post.id)} 
                                    onDelete={() => deletePostMutation.mutate(post.id)} 
                                />
                            )}
                            {reportedComments.map(comment => 
                                <ReportedContentCard 
                                    key={`comment-${comment.id}`} 
                                    item={comment} 
                                    type="comment" 
                                    author={getUser(comment.authorId)}
                                    onDismiss={() => dismissCommentReportsMutation.mutate({ postId: comment.postId, commentId: comment.id })} 
                                    onDelete={() => deleteCommentMutation.mutate({ postId: comment.postId, commentId: comment.id })} 
                                />
                            )}
                        </CollapsibleSection>

                        <CollapsibleSection title="طلبات البيع والشراء" icon={<TagIcon className="w-6 h-6 text-cyan-500" />} count={pendingSale.length}>
                            {pendingSale.map(item => <PendingItemCard key={`sale-${item.id}`} item={item} type="sale" author={getUser(item.authorId)} onAction={handleApproval} />)}
                        </CollapsibleSection>

                        <CollapsibleSection title="الوظائف المعلقة" icon={<BriefcaseIcon className="w-6 h-6 text-purple-500" />} count={pendingJobs.length}>
                            {pendingJobs.map(item => <PendingItemCard key={`job-${item.id}`} item={item} type="job" author={getUser(item.authorId)} onAction={handleApproval} />)}
                        </CollapsibleSection>

                        <CollapsibleSection title="المفقودات والمعثورات" icon={<ArchiveBoxIcon className="w-6 h-6 text-amber-500" />} count={pendingLostFound.length}>
                            {pendingLostFound.map(item => <PendingItemCard key={`lf-${item.id}`} item={item} type="lostfound" onAction={handleApproval} />)}
                        </CollapsibleSection>
                    </div>
                ) : (
                    <EmptyState icon={<CheckCircleIcon className="w-16 h-16 text-slate-400" />} title="لا توجد طلبات للمراجعة" message="كل شيء على ما يرام! لا توجد عناصر جديدة بانتظار موافقتك." />
                )}
            </div>
        </QueryStateWrapper>
    );
};

export default ReviewQueueTab;