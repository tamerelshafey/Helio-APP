import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftIcon, ChatBubbleOvalLeftIcon, UserGroupIcon, PlusIcon, PencilSquareIcon, TrashIcon,
    TagIcon, BriefcaseIcon, ArchiveBoxIcon, CheckCircleIcon, XCircleIcon, PhoneIcon, MapPinIcon
} from '../components/common/Icons';
import type {
    CommunityPost, DiscussionCircle, CommunityComment, DiscussionCircleCategory,
    ForSaleItem, JobPosting, LostAndFoundItem, AppUser, MarketplaceItemStatus, LostFoundStatus
} from '../types';
import { useCommunityContext } from '../context/CommunityContext';
import { useMarketplaceContext } from '../context/MarketplaceContext';
import { useAppContext } from '../context/AppContext';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import KpiCard from '../components/common/KpiCard';
import Modal from '../components/common/Modal';
import TabButton from '../components/common/TabButton';
import EmptyState from '../components/common/EmptyState';
import ImageUploader from '../components/common/ImageUploader';

// #region Helper Components (Copied from deleted pages)

const StatusBadge: React.FC<{ status: MarketplaceItemStatus | LostFoundStatus }> = ({ status }) => {
    const statusMap = {
        pending: { text: 'بانتظار المراجعة', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        approved: { text: 'موافق عليه', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        rejected: { text: 'مرفوض', classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
        expired: { text: 'منتهي الصلاحية', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
        lost: { text: 'مفقود', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
        found: { text: 'تم العثور عليه', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        returned: { text: 'تم التسليم', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    const { text, classes } = statusMap[status];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

const ApprovalModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (days: number) => void; title: string; }> = ({ isOpen, onClose, onConfirm, title }) => {
    const [days, setDays] = useState(30);
    const handleSubmit = () => onConfirm(days);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-4">
                <label htmlFor="expiryDays" className="block text-sm font-medium">مدة صلاحية الإعلان (بالأيام):</label>
                <input type="number" id="expiryDays" value={days} onChange={e => setDays(Number(e.target.value))} min="1" className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md">إلغاء</button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">تأكيد الموافقة</button>
                </div>
            </div>
        </Modal>
    );
};

// #endregion Helper Components


// #region Discussion Circles Tab
const CircleForm: React.FC<{ circle: DiscussionCircle | null; onSave: (data: any) => void; onClose: () => void; }> = ({ circle, onSave, onClose }) => {
    const [name, setName] = useState(circle?.name || '');
    const [description, setDescription] = useState(circle?.description || '');
    const [category, setCategory] = useState<DiscussionCircleCategory>(circle?.category || 'عام');
    const categories: DiscussionCircleCategory[] = ['عام', 'أحياء سكنية', 'كمبوندات'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: circle?.id, name, description, category });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">اسم الدائرة</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">الوصف</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2" />
            </div>
             <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select value={category} onChange={e => setCategory(e.target.value as DiscussionCircleCategory)} className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-600 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const CirclesTab: React.FC = () => {
    const { discussionCircles, communityPosts, handleSaveCircle, handleDeleteCircle } = useCommunityContext();
    const [modalData, setModalData] = useState<DiscussionCircle | null>(null);
    const { showToast } = useUIContext();

    const postCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        for (const post of communityPosts) {
            counts[post.circleId] = (counts[post.circleId] || 0) + 1;
        }
        return counts;
    }, [communityPosts]);

    const categorizedCircles = useMemo(() => {
        const categories: Record<DiscussionCircleCategory, DiscussionCircle[]> = { 'عام': [], 'أحياء سكنية': [], 'كمبوندات': [] };
        discussionCircles.forEach(circle => {
            if (categories[circle.category]) categories[circle.category].push(circle);
        });
        return categories;
    }, [discussionCircles]);
    
    const confirmDeleteCircle = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذه الدائرة؟ سيتم نقل منشوراتها إلى "نقاش عام".')) {
            handleDeleteCircle(id);
            showToast('تم حذف الدائرة بنجاح!');
        }
    };
    
    return (
        <div className="animate-fade-in space-y-8">
            <div className="flex justify-end">
                <button onClick={() => setModalData({} as DiscussionCircle)} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600">
                    <PlusIcon className="w-5 h-5"/> إضافة دائرة
                </button>
            </div>
             {(Object.keys(categorizedCircles) as DiscussionCircleCategory[]).map(category => (
                categorizedCircles[category].length > 0 && (
                    <div key={category}>
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 border-r-4 border-cyan-500 pr-4">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categorizedCircles[category].map(circle => (
                                <div key={circle.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg group relative">
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">{circle.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 h-10">{circle.description}</p>
                                    <p className="text-xs font-semibold text-cyan-500 mt-2">{postCounts[circle.id] || 0} منشور</p>
                                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setModalData(circle)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-blue-500"><PencilSquareIcon className="w-4 h-4" /></button>
                                        <button onClick={() => confirmDeleteCircle(circle.id)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-full text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            ))}
             <Modal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.id ? 'تعديل دائرة النقاش' : 'إضافة دائرة نقاش'}>
                <CircleForm
                    circle={modalData}
                    onSave={(data) => { handleSaveCircle(data); showToast('تم حفظ الدائرة بنجاح!'); setModalData(null); }}
                    onClose={() => setModalData(null)}
                />
            </Modal>
        </div>
    );
};
// #endregion Discussion Circles Tab

// #region Buy & Sell Tab
const BuySellTab: React.FC = () => {
    const { forSaleItems, handleApproveItem, handleRejectItem, handleDeleteItem } = useMarketplaceContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();

    const [activeSubTab, setActiveSubTab] = useState<MarketplaceItemStatus>('pending');
    const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const getUserById = (id: number) => users.find(u => u.id === id);

    const filteredItems = useMemo(() => {
        return forSaleItems.filter(item => item.status === activeSubTab);
    }, [forSaleItems, activeSubTab]);

    const stats = useMemo(() => ({
        pending: forSaleItems.filter(i => i.status === 'pending').length,
        approved: forSaleItems.filter(i => i.status === 'approved').length,
        total: forSaleItems.length
    }), [forSaleItems]);
    
    const handleApproveClick = (id: number) => { setSelectedItemId(id); setApprovalModalOpen(true); };
    const handleConfirmApproval = (days: number) => {
        if (selectedItemId) {
            handleApproveItem('sale', selectedItemId, days);
            showToast('تمت الموافقة على الإعلان بنجاح!');
        }
        setApprovalModalOpen(false);
        setSelectedItemId(null);
    };

    const handleRejectClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من رفض هذا الإعلان؟')) { handleRejectItem('sale', id); showToast('تم رفض الإعلان.'); }
    };
    
    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) { handleDeleteItem('sale', id); showToast('تم حذف الإعلان بنجاح!'); }
    };

    const ItemCard: React.FC<{item: ForSaleItem; author?: AppUser}> = ({ item, author }) => (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-lg overflow-hidden flex flex-col">
            <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2"><h3 className="text-lg font-bold">{item.title}</h3><StatusBadge status={item.status} /></div>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{item.price.toLocaleString('ar-EG')} جنيه</p>
                <p className="text-sm flex-grow">{item.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t mt-2">
                    <p><strong>بواسطة:</strong> {author?.name || 'غير معروف'} ({item.contactName})</p>
                    <div className="flex items-center gap-1"><PhoneIcon className="w-3 h-3"/><a href={`tel:${item.contactPhone}`} className="hover:underline">{item.contactPhone}</a></div>
                    <p><strong>تاريخ النشر:</strong> {item.creationDate}</p>
                    {item.expiryDate && <p><strong>ينتهي في:</strong> {item.expiryDate}</p>}
                </div>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center gap-2">
                {item.status === 'pending' && <>
                    <button onClick={() => handleApproveClick(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-green-100 text-green-700 p-2 rounded-md"><CheckCircleIcon className="w-5 h-5"/> موافقة</button>
                    <button onClick={() => handleRejectClick(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-orange-100 text-orange-700 p-2 rounded-md"><XCircleIcon className="w-5 h-5"/> رفض</button>
                </>}
                <button onClick={() => handleDeleteClick(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="إجمالي الإعلانات" value={stats.total.toString()} icon={<TagIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="بانتظار المراجعة" value={stats.pending.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-yellow-400" />} />
                <KpiCard title="الموافق عليها" value={stats.approved.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-green-400" />} />
            </div>
            <div className="flex flex-wrap gap-2">
                <TabButton active={activeSubTab === 'pending'} onClick={() => setActiveSubTab('pending')}>بانتظار المراجعة ({stats.pending})</TabButton>
                <TabButton active={activeSubTab === 'approved'} onClick={() => setActiveSubTab('approved')}>الموافق عليه</TabButton>
                <TabButton active={activeSubTab === 'rejected'} onClick={() => setActiveSubTab('rejected')}>المرفوض</TabButton>
                <TabButton active={activeSubTab === 'expired'} onClick={() => setActiveSubTab('expired')}>منتهي الصلاحية</TabButton>
            </div>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => <ItemCard key={item.id} item={item} author={getUserById(item.authorId)} onApprove={handleApproveClick} onReject={handleRejectClick} onDelete={handleDeleteClick}/>)}
                </div>
            ) : <EmptyState icon={<TagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد إعلانات" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
            <ApprovalModal isOpen={isApprovalModalOpen} onClose={() => setApprovalModalOpen(false)} onConfirm={handleConfirmApproval} title="الموافقة على إعلان البيع"/>
        </div>
    );
};
// #endregion Buy & Sell Tab

// #region Jobs Tab
const JobsTab: React.FC = () => {
    const { jobs, handleApproveItem, handleRejectItem, handleDeleteItem } = useMarketplaceContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();
    const [activeSubTab, setActiveSubTab] = useState<MarketplaceItemStatus>('pending');
    const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

    const getUserById = (id: number) => users.find(u => u.id === id);
    const filteredItems = useMemo(() => jobs.filter(item => item.status === activeSubTab), [jobs, activeSubTab]);
    const stats = useMemo(() => ({
        pending: jobs.filter(i => i.status === 'pending').length,
        approved: jobs.filter(i => i.status === 'approved').length,
        total: jobs.length
    }), [jobs]);

    const handleApproveClick = (id: number) => { setSelectedJobId(id); setApprovalModalOpen(true); };
    const handleConfirmApproval = (days: number) => {
        if (selectedJobId) { handleApproveItem('job', selectedJobId, days); showToast('تمت الموافقة على إعلان الوظيفة بنجاح!'); }
        setApprovalModalOpen(false); setSelectedJobId(null);
    };
    const handleRejectClick = (id: number) => { if (window.confirm('هل أنت متأكد من رفض إعلان هذه الوظيفة؟')) { handleRejectItem('job', id); showToast('تم رفض إعلان الوظيفة.'); } };
    const handleDeleteClick = (id: number) => { if (window.confirm('هل أنت متأكد من حذف إعلان هذه الوظيفة نهائياً؟')) { handleDeleteItem('job', id); showToast('تم حذف إعلان الوظيفة بنجاح!'); } };

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
                {job.status === 'pending' && <>
                    <button onClick={() => handleApproveClick(job.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-green-100 text-green-700 p-2 rounded-md"><CheckCircleIcon className="w-5 h-5"/> موافقة</button>
                    <button onClick={() => handleRejectClick(job.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-orange-100 text-orange-700 p-2 rounded-md"><XCircleIcon className="w-5 h-5"/> رفض</button>
                </>}
                <button onClick={() => handleDeleteClick(job.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><KpiCard title="إجمالي الوظائف" value={stats.total.toString()} icon={<BriefcaseIcon className="w-8 h-8 text-cyan-400" />} /><KpiCard title="بانتظار المراجعة" value={stats.pending.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-yellow-400" />} /><KpiCard title="الموافق عليها" value={stats.approved.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-green-400" />} /></div>
            <div className="flex flex-wrap gap-2"><TabButton active={activeSubTab === 'pending'} onClick={() => setActiveSubTab('pending')}>بانتظار المراجعة ({stats.pending})</TabButton><TabButton active={activeSubTab === 'approved'} onClick={() => setActiveSubTab('approved')}>الموافق عليه</TabButton><TabButton active={activeSubTab === 'rejected'} onClick={() => setActiveSubTab('rejected')}>المرفوض</TabButton><TabButton active={activeSubTab === 'expired'} onClick={() => setActiveSubTab('expired')}>منتهي الصلاحية</TabButton></div>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => <JobCard key={item.id} job={item} author={getUserById(item.authorId)} onApprove={handleApproveClick} onReject={handleRejectClick} onDelete={handleDeleteClick}/>)}
                </div>
            ) : <EmptyState icon={<BriefcaseIcon className="w-16 h-16 text-slate-400" />} title="لا توجد وظائف" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
            <ApprovalModal isOpen={isApprovalModalOpen} onClose={() => setApprovalModalOpen(false)} onConfirm={handleConfirmApproval} title="الموافقة على إعلان الوظيفة"/>
        </div>
    );
};
// #endregion Jobs Tab

// #region Lost & Found Tab
const LostFoundTab: React.FC = () => {
    const { lostAndFoundItems, handleSaveLostAndFoundItem, handleDeleteLostAndFoundItem } = useAppContext();
    const { showToast } = useUIContext();
    const [activeSubTab, setActiveSubTab] = useState<LostFoundStatus>('lost');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<LostAndFoundItem | null>(null);

    const filteredItems = useMemo(() => lostAndFoundItems.filter(item => item.status === activeSubTab), [lostAndFoundItems, activeSubTab]);
    const stats = useMemo(() => ({ lost: lostAndFoundItems.filter(i => i.status === 'lost').length, found: lostAndFoundItems.filter(i => i.status === 'found').length, returned: lostAndFoundItems.filter(i => i.status === 'returned').length }), [lostAndFoundItems]);

    const handleAddItem = () => { setEditingItem(null); setIsModalOpen(true); };
    const handleEditItem = (item: LostAndFoundItem) => { setEditingItem(item); setIsModalOpen(true); };
    const handleSaveAndClose = (item: Omit<LostAndFoundItem, 'id'> & { id?: number }) => { handleSaveLostAndFoundItem(item); setIsModalOpen(false); showToast(item.id ? 'تم تعديل العنصر بنجاح!' : 'تم إضافة العنصر بنجاح!'); };
    const confirmDelete = (id: number) => { if (window.confirm('هل أنت متأكد من حذف هذا العنصر؟')) { handleDeleteLostAndFoundItem(id); showToast('تم حذف العنصر!'); } };
    const markAsReturned = (item: LostAndFoundItem) => { handleSaveLostAndFoundItem({ ...item, status: 'returned' }); showToast(`تم تحديث حالة "${item.itemName}" إلى "تم التسليم".`); };

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><KpiCard title="عناصر مفقودة" value={stats.lost.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-red-400" />} /><KpiCard title="تم العثور عليها" value={stats.found.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-yellow-400" />} /><KpiCard title="تم تسليمها" value={stats.returned.toString()} icon={<ArchiveBoxIcon className="w-8 h-8 text-green-400" />} /></div>
            <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-2"><TabButton active={activeSubTab === 'lost'} onClick={() => setActiveSubTab('lost')}>مفقود ({stats.lost})</TabButton><TabButton active={activeSubTab === 'found'} onClick={() => setActiveSubTab('found')}>تم العثور عليه ({stats.found})</TabButton><TabButton active={activeSubTab === 'returned'} onClick={() => setActiveSubTab('returned')}>تم التسليم</TabButton></div>
                <button onClick={handleAddItem} className="flex items-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600"><PlusIcon className="w-5 h-5" /> إضافة عنصر</button>
            </div>
             {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* ... Item Card JSX ... */}
                </div>
            ) : <EmptyState icon={<ArchiveBoxIcon className="w-16 h-16 text-slate-400" />} title="لا توجد عناصر" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'تعديل العنصر' : 'إضافة عنصر جديد'}>
                {/* ... Item Form JSX ... */}
            </Modal>
        </div>
    );
};
// #endregion Lost & Found Tab


const CommunityPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'circles' | 'buy-sell' | 'jobs' | 'lost-found'>('circles');

    const renderContent = () => {
        switch(activeTab) {
            case 'circles': return <CirclesTab />;
            case 'buy-sell': return <BuySellTab />;
            case 'jobs': return <JobsTab />;
            case 'lost-found': return <LostFoundTab />;
            default: return null;
        }
    };

    return (
        <div className="animate-fade-in">
             <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">إدارة المجتمع</h1>
                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'circles'} onClick={() => setActiveTab('circles')} icon={<ChatBubbleOvalLeftIcon className="w-5 h-5"/>}>دوائر النقاش</TabButton>
                    <TabButton active={activeTab === 'buy-sell'} onClick={() => setActiveTab('buy-sell')} icon={<TagIcon className="w-5 h-5"/>}>البيع والشراء</TabButton>
                    <TabButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<BriefcaseIcon className="w-5 h-5"/>}>الوظائف</TabButton>
                    <TabButton active={activeTab === 'lost-found'} onClick={() => setActiveTab('lost-found')} icon={<ArchiveBoxIcon className="w-5 h-5"/>}>المفقودات</TabButton>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default CommunityPage;