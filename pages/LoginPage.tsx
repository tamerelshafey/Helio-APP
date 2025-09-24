import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserManagementContext } from '../context/UserManagementContext';
import type { AdminUser } from '../types';
import { useAuthContext } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { admins } = useUserManagementContext();
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const handleQuickLogin = (user: AdminUser) => {
        login(user);
        navigate('/');
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-slate-100 dark:bg-slate-900 px-4 py-8">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider mb-4">Helio</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">لوحة تحكم المدير</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        اختر حسابًا لتسجيل الدخول.
                    </p>

                    <div className="mt-8 space-y-4">
                        <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400">تسجيل دخول سريع (للتطوير)</h3>
                        {admins.map(admin => (
                            <button
                                key={admin.id}
                                onClick={() => handleQuickLogin(admin)}
                                className="w-full flex items-center text-left gap-4 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800"
                            >
                                <img src={admin.avatar} alt={admin.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white">{admin.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{admin.role}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;