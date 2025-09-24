import React from 'react';
import { UserCircleIcon, CheckCircleIcon } from '../common/Icons';
import { useUserManagementContext } from '../../context/UserManagementContext';

const UsersToVerify: React.FC = () => {
    const { users, handleSaveUser } = useUserManagementContext();

    const pendingUsers = users.filter(user => user.status === 'pending').slice(0, 3);

    const approveUser = (userId: number) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            handleSaveUser({ ...user, status: 'active' });
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                <UserCircleIcon className="w-6 h-6 mr-2" />
                مستخدمون بحاجة للمتابعة
            </h3>
            {pendingUsers.length > 0 ? (
                <ul className="space-y-3">
                    {pendingUsers.map(user => (
                        <li key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex items-center">
                                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover mr-3 rtl:ml-3" loading="lazy" />
                                <span className="font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                            </div>
                            <button 
                                onClick={() => approveUser(user.id)}
                                className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50"
                                title={`تفعيل المستخدم ${user.name}`}
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-sm text-gray-500 py-4">لا يوجد مستخدمون بحاجة للمتابعة حالياً.</p>
            )}
        </div>
    );
};

export default UsersToVerify;
