import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, deleteUser, deleteUsers, setUserAccountType } from '../../api/usersApi';
import { useStore } from '../../store';
import type { AppUser, UserStatus, SortDirection } from '../../types';
import StatusBadge from '../common/StatusBadge';
import Pagination from '../common/Pagination';
import {
    MagnifyingGlassIcon, UserPlusIcon, PencilSquareIcon, TrashIcon,
    ArrowTrendingUpIcon, ArrowUpIcon, ArrowDownIcon
} from '../common/Icons';
import { UserTableSkeleton } from '../common/SkeletonLoader';
import QueryStateWrapper from '../common/QueryStateWrapper';

const ITEMS_PER_PAGE = 10;

interface RegularUsersTabProps {
    onAdd: () => void;
    onEdit: (user: AppUser) => void;
}

const RegularUsersTab: React.FC<RegularUsersTabProps> = ({ onAdd, onEdit }) => {
    const queryClient = useQueryClient();
    const showToast = useStore((state) => state.showToast);
    const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers });
    const { data: users = [] } = usersQuery;

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: keyof AppUser; direction: SortDirection } | null>(null);

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast(`تم حذف المستخدم بنجاح!`);
        },
        onError: (error) => showToast(error.message, 'error')
    });
    
    const deleteUsersMutation = useMutation({
        mutationFn: deleteUsers,
        onSuccess: (_, ids) => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast(`تم حذف ${ids.length} مستخدمين بنجاح!`);
            setSelectedUserIds([]);
        },
        onError: (error) => showToast(error.message, 'error')
    });

    const setUserAccountTypeMutation = useMutation({
        mutationFn: setUserAccountType,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            showToast('تم تحديث نوع الحساب بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });

    const handleSortUsers = (key: keyof AppUser) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                return { ...prevConfig, direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending' };
            }
            return { key, direction: 'ascending' };
        });
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const isRegularUser = user.accountType === 'user';
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = statusFilter === 'all' || user.status === statusFilter;
            return isRegularUser && matchesSearch && matchesFilter;
        });
    }, [users, searchTerm, statusFilter]);
    
    const sortedAndFilteredUsers = useMemo(() => {
        let sortableItems = [...filteredUsers];
        if (sortConfig) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredUsers, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = sortedAndFilteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedUserIds([]);
    }, [searchTerm, statusFilter, sortConfig]);

    useEffect(() => {
        setSelectedUserIds([]);
    }, [currentPage]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUserIds(paginatedUsers.map(u => u.id));
        } else {
            setSelectedUserIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
        );
    };

    const isAllSelected = paginatedUsers.length > 0 && selectedUserIds.length === paginatedUsers.length;
    const isSomeSelected = selectedUserIds.length > 0 && !isAllSelected;

    const handleBulkDelete = () => {
        if (window.confirm(`هل أنت متأكد من حذف ${selectedUserIds.length} مستخدمين؟`)) {
            deleteUsersMutation.mutate(selectedUserIds);
        }
    };
    
    const SortIndicator: React.FC<{ direction?: SortDirection }> = ({ direction }) => {
        if (!direction) return null;
        return direction === 'ascending' ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />;
    };

    return (
        <div className="animate-fade-in">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative flex-grow w-full sm:w-auto">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" />
                    <input type="text" placeholder="بحث بالاسم أو البريد..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')} className="flex-grow sm:flex-grow-0 w-full sm:w-40 bg-slate-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                        <option value="all">كل الحالات</option>
                        <option value="active">مفعل</option>
                        <option value="pending">معلق</option>
                        <option value="banned">محظور</option>
                    </select>
                     <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                        <UserPlusIcon className="w-5 h-5" />
                        <span>إضافة</span>
                    </button>
                </div>
            </div>

            {selectedUserIds.length > 0 && (
                <div className="bg-slate-200 dark:bg-slate-700 p-3 rounded-lg mb-4 flex items-center justify-between animate-fade-in">
                    <span className="text-sm font-semibold">
                        تم تحديد {selectedUserIds.length} مستخدمين
                    </span>
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                        disabled={deleteUsersMutation.isPending}
                    >
                        <TrashIcon className="w-4 h-4" />
                        {deleteUsersMutation.isPending ? 'جاري الحذف...' : 'حذف المحدد'}
                    </button>
                </div>
            )}
            
            <QueryStateWrapper queries={usersQuery} loader={<UserTableSkeleton />}>
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                onChange={handleSelectAll}
                                                checked={isAllSelected}
                                                ref={el => {
                                                    if (el) {
                                                        el.indeterminate = isSomeSelected;
                                                    }
                                                }}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortUsers('name')}>
                                        <div className="flex items-center">
                                            المستخدم
                                            {sortConfig?.key === 'name' && <SortIndicator direction={sortConfig.direction} />}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortUsers('status')}>
                                        <div className="flex items-center">
                                            الحالة
                                            {sortConfig?.key === 'status' && <SortIndicator direction={sortConfig.direction} />}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600" onClick={() => handleSortUsers('joinDate')}>
                                        <div className="flex items-center">
                                            تاريخ الانضمام
                                            {sortConfig?.key === 'joinDate' && <SortIndicator direction={sortConfig.direction} />}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedUsers.map(user => (
                                    <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="w-4 p-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    checked={selectedUserIds.includes(user.id)}
                                                    onChange={() => handleSelectOne(user.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/dashboard/users/${user.id}`} className="flex items-center gap-3 group">
                                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-cyan-500 transition-colors">{user.name}</div>
                                                    <div className="text-xs">{user.email}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                        <td className="px-6 py-4">{user.joinDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setUserAccountTypeMutation.mutate({ userId: user.id, accountType: 'service_provider' })} className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 rounded-md" title="ترقية إلى مقدم خدمة"><ArrowTrendingUpIcon className="w-5 h-5"/></button>
                                                <button onClick={() => onEdit(user)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5" /></button>
                                                <button onClick={() => deleteUserMutation.mutate(user.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {sortedAndFilteredUsers.length === 0 && <p className="text-center py-8">لا يوجد مستخدمون يطابقون البحث.</p>}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            </QueryStateWrapper>
        </div>
    );
};

export default RegularUsersTab;