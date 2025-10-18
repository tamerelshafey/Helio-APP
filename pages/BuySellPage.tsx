import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TagIcon, CheckCircleIcon, XCircleIcon, TrashIcon, PhoneIcon } from '../components/common/Icons';
import type { ForSaleItem, AppUser, MarketplaceItemStatus } from '../types';
import { useMarketplaceContext } from '../context/MarketplaceContext';
import { useUserManagementContext } from '../context/UserManagementContext';
import { useUIContext } from '../context/UIContext';
import KpiCard from '../components/common/KpiCard';
import TabButton from '../components/common/TabButton';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';

const StatusBadge: React.FC<{ status: MarketplaceItemStatus }> = ({ status }) => {
    const statusMap = {
        pending: { text: 'بانتظار المراجعة', classes: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
        approved: { text: 'موافق عليه', classes: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
        rejected: { text: 'مرفوض', classes: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
        expired: { text: 'منتهي الصلاحية', classes: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    };
    const { text, classes } = statusMap[status];
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes}`}>{text}</span>;
};

const statusMapForTitle: Record<MarketplaceItemStatus, { text: string }> = {
    pending: { text: 'بانتظار المراجعة' },
    approved: { text: 'الموافق عليها' },
    rejected: { text: 'المرفوضة' },
    expired: { text: 'المنتهية الصلاحية' },
};


const ApprovalModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (days: number) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
    const [days, setDays] = useState(30);
    const handleSubmit = () => onConfirm(days);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="الموافقة على الإعلان">
            <div className="space-y-4">
                <label htmlFor="expiryDays" className="block text-sm font-medium">مدة صلاحية الإعلان (بالأيام):</label>
                <input type="number" id="expiryDays" value={days} onChange={e => setDays(Number(e.target.value))} min="1" className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-2 focus:ring-2 focus:ring-cyan-500" />
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">إلغاء</button>
                    <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 rounded-md hover:bg-cyan-600">تأكيد الموافقة</button>
                </div>
            </div>
        </Modal>
    );
};

const ItemCard: React.FC<{
    item: ForSaleItem;
    author?: AppUser;
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
    onDelete: (id: number) => void;
}> = ({ item, author, onApprove, onReject, onDelete }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden flex flex-col">
        <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
        <div className="p-4 flex-grow flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{item.title}</h3>
                <StatusBadge status={item.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.category}</p>
            <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{item.price.toLocaleString('ar-EG')} جنيه</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">{item.description}</p>
            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1">
                 <p><strong>بواسطة:</strong> {author?.name || 'غير معروف'} ({item.contactName})</p>
                <div className="flex items-center gap-1">
                    <PhoneIcon className="w-3 h-3"/>
                    <a href={`tel:${item.contactPhone}`} className="hover:underline">{item.contactPhone}</a>
                </div>
                <p><strong>تاريخ النشر:</strong> {item.creationDate}</p>
                {item.expiryDate && <p><strong>ينتهي في:</strong> {item.expiryDate}</p>}
            </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center gap-2">
            {item.status === 'pending' && (
                <>
                    <button onClick={() => onApprove(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900 p-2 rounded-md"><CheckCircleIcon className="w-5 h-5"/> موافقة</button>
                    <button onClick={() => onReject(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900 p-2 rounded-md"><XCircleIcon className="w-5 h-5"/> رفض</button>
                </>
            )}
            <button onClick={() => onDelete(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900 p-2 rounded-md"><TrashIcon className="w-5 h-5"/> حذف</button>
        </div>
    </div>
);

const BuySellPage: React.FC = () => {
    const navigate = useNavigate();
    const { forSaleItems, handleApproveItem, handleRejectItem, handleDeleteItem } = useMarketplaceContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();

    const [activeTab, setActiveTab] = useState<MarketplaceItemStatus>('pending');
    const [isApprovalModalOpen, setApprovalModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const getUserById = (id: number) => users.find(u => u.id === id);

    const filteredItems = useMemo(() => {
        return forSaleItems.filter(item => item.status === activeTab);
    }, [forSaleItems, activeTab]);

    const stats = useMemo(() => ({
        pending: forSaleItems.filter(i => i.status === 'pending').length,
        approved: forSaleItems.filter(i => i.status === 'approved').length,
        total: forSaleItems.length
    }), [forSaleItems]);

    const handleApproveClick = (id: number) => {
        setSelectedItemId(id);
        setApprovalModalOpen(true);
    };

    const handleConfirmApproval = (days: number) => {
        if (selectedItemId) {
            handleApproveItem('sale', selectedItemId, days);
            showToast('تمت الموافقة على الإعلان بنجاح!');
        }
        setApprovalModalOpen(false);
        setSelectedItemId(null);
    };

    const handleRejectClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من رفض هذا الإعلان؟')) {
            handleRejectItem('sale', id);
            showToast('تم رفض الإعلان.');
        }
    };
    
    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) {
            handleDeleteItem('sale', id);
            showToast('تم حذف الإعلان بنجاح!');
        }
    };

    return (
        <div className="animate-fade-in">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>العودة</span>
            </button>

            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                    <TagIcon className="w-8 h-8"/>
                    إدارة البيع والشراء
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <KpiCard title="إجمالي الإعلانات" value={stats.total.toString()} icon={<TagIcon className="w-8 h-8 text-cyan-400" />} />
                    <KpiCard title="بانتظار المراجعة" value={stats.pending.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-yellow-400" />} />
                    <KpiCard title="الموافق عليها" value={stats.approved.toString()} icon={<CheckCircleIcon className="w-8 h-8 text-green-400" />} />
                </div>

                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                    <TabButton active={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>بانتظار المراجعة ({stats.pending})</TabButton>
                    <TabButton active={activeTab === 'approved'} onClick={() => setActiveTab('approved')}>الموافق عليه</TabButton>
                    <TabButton active={activeTab === 'rejected'} onClick={() => setActiveTab('rejected')}>المرفوض</TabButton>
                    <TabButton active={activeTab === 'expired'} onClick={() => setActiveTab('expired')}>منتهي الصلاحية</TabButton>
                </div>

                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                author={getUserById(item.authorId)}
                                onApprove={handleApproveClick}
                                onReject={handleRejectClick}
                                onDelete={handleDeleteClick}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<TagIcon className="w-16 h-16 text-slate-400" />}
                        title={`لا توجد إعلانات ${statusMapForTitle[activeTab].text}`}
                        message="لا توجد عناصر لعرضها في هذا القسم حالياً."
                    />
                )}
            </div>

            <ApprovalModal
                isOpen={isApprovalModalOpen}
                onClose={() => setApprovalModalOpen(false)}
                onConfirm={handleConfirmApproval}
            />
        </div>
    );
};

export default BuySellPage;