import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdmins, deleteAdmin } from '../../api/usersApi';
import { useUIContext } from '../../context/UIContext';
import type { AdminUser } from '../../types';
import { UserPlusIcon, PencilSquareIcon, TrashIcon } from '../common/Icons';
import { AdminTableSkeleton } from '../common/SkeletonLoader';
import QueryStateWrapper from '../common/QueryStateWrapper';

interface AdminUsersTabProps {
    onAdd: () => void;
    onEdit: (admin: AdminUser) => void;
}

const AdminUsersTab: React.FC<AdminUsersTabProps> = ({ onAdd, onEdit }) => {
    const queryClient = useQueryClient();
    const { showToast } = useUIContext();
    const adminsQuery = useQuery({ queryKey: ['admins'], queryFn: getAdmins });
    const { data: admins = [] } = adminsQuery;

    const deleteAdminMutation = useMutation({
        mutationFn: deleteAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admins'] });
            showToast('تم حذف المدير بنجاح!');
        },
        onError: (error) => showToast(error.message, 'error')
    });
    
    return (
        <div className="animate-fade-in">
            <div className="flex justify-end mb-6">
                <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-cyan-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
                    <UserPlusIcon className="w-5 h-5" />
                    <span>إضافة مدير</span>
                </button>
            </div>
            <QueryStateWrapper queries={adminsQuery} loader={<AdminTableSkeleton />}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">المدير</th>
                                <th scope="col" className="px-6 py-3">الدور</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map(admin => (
                                <tr key={admin.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={admin.avatar} alt={admin.name} className="w-10 h-10 rounded-full object-cover" loading="lazy"/>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-white">{admin.name}</div>
                                                <div className="text-xs">{admin.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {admin.roles.map(role => (
                                                <span key={role} className="px-2 py-1 text-xs font-medium rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300">{role}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => onEdit(admin)} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-md"><PencilSquareIcon className="w-5 h-5" /></button>
                                            <button onClick={() => deleteAdminMutation.mutate(admin.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </QueryStateWrapper>
        </div>
    );
};

export default AdminUsersTab;