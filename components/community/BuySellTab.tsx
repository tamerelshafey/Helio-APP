import React, { useState, useMemo } from 'react';
import type { ForSaleItem, AppUser, MarketplaceItemStatus } from '../../types';
import { useMarketplaceContext } from '../../context/MarketplaceContext';
import { useUserManagementContext } from '../../context/UserManagementContext';
import { useUIContext } from '../../context/UIContext';
import KpiCard from '../common/KpiCard';
import TabButton from '../common/TabButton';
import EmptyState from '../common/EmptyState';
import { TagIcon, TrashIcon, PhoneIcon } from '../common/Icons';
import StatusBadge from '../common/StatusBadge';

const BuySellTab: React.FC = () => {
    const { forSaleItems, handleDeleteItem } = useMarketplaceContext();
    const { users } = useUserManagementContext();
    const { showToast } = useUIContext();

    const [activeSubTab, setActiveSubTab] = useState<MarketplaceItemStatus>('approved');

    const getUserById = (id: number) => users.find(u => u.id === id);

    const filteredItems = useMemo(() => {
        return forSaleItems.filter(item => item.status === activeSubTab);
    }, [forSaleItems, activeSubTab]);

    const stats = useMemo(() => ({
        approved: forSaleItems.filter(i => i.status === 'approved').length,
        rejected: forSaleItems.filter(i => i.status === 'rejected').length,
        expired: forSaleItems.filter(i => i.status === 'expired').length,
        total: forSaleItems.length
    }), [forSaleItems]);
    
    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان نهائياً؟')) { 
            handleDeleteItem('sale', id); 
            showToast('تم حذف الإعلان بنجاح!'); 
        }
    };

    const ItemCard: React.FC<{item: ForSaleItem; author?: AppUser}> = ({ item, author }) => (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-lg overflow-hidden flex flex-col">
            <img src={item.images[0]} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    <StatusBadge status={item.status} />
                </div>
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 mb-4">{item.price.toLocaleString('ar-EG')} جنيه</p>
                <p className="text-sm flex-grow">{item.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t mt-2">
                    <p><strong>بواسطة:</strong> {author?.name || 'غير معروف'} ({item.contactName})</p>
                    <div className="flex items-center gap-1">
                        <PhoneIcon className="w-3 h-3"/>
                        <a href={`tel:${item.contactPhone}`} className="hover:underline">{item.contactPhone}</a>
                    </div>
                    <p><strong>تاريخ النشر:</strong> {item.creationDate}</p>
                    {item.expiryDate && <p><strong>ينتهي في:</strong> {item.expiryDate}</p>}
                </div>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-900 flex items-center justify-center gap-2">
                <button onClick={() => handleDeleteClick(item.id)} className="flex-1 text-sm flex items-center justify-center gap-2 bg-red-100 text-red-700 p-2 rounded-md">
                    <TrashIcon className="w-5 h-5"/> حذف
                </button>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard title="إجمالي الإعلانات" value={stats.total.toString()} icon={<TagIcon className="w-8 h-8 text-cyan-400" />} />
                <KpiCard title="الإعلانات الموافق عليها" value={stats.approved.toString()} icon={<TagIcon className="w-8 h-8 text-green-400" />} />
                <KpiCard title="الإعلانات المنتهية" value={stats.expired.toString()} icon={<TagIcon className="w-8 h-8 text-red-400" />} />
            </div>
            <div className="flex flex-wrap gap-2">
                <TabButton active={activeSubTab === 'approved'} onClick={() => setActiveSubTab('approved')}>الموافق عليه</TabButton>
                <TabButton active={activeSubTab === 'rejected'} onClick={() => setActiveSubTab('rejected')}>المرفوض</TabButton>
                <TabButton active={activeSubTab === 'expired'} onClick={() => setActiveSubTab('expired')}>منتهي الصلاحية</TabButton>
            </div>
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map(item => <ItemCard key={item.id} item={item} author={getUserById(item.authorId)}/>)}
                </div>
            ) : <EmptyState icon={<TagIcon className="w-16 h-16 text-slate-400" />} title="لا توجد إعلانات" message="لا توجد عناصر لعرضها في هذا القسم حالياً."/>}
        </div>
    );
};

export default BuySellTab;