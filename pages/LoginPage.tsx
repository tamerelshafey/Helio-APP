import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAdmins } from '../api/usersApi';
import { useStore } from '../store';
import { KeyIcon, EnvelopeIcon } from '../components/common/Icons';
import type { AdminUserRole } from '../types';
import { AdminRoles } from '../types';
import useDocumentTitle from '../hooks/useDocumentTitle';

const LoginPage: React.FC = () => {
    useDocumentTitle('تسجيل الدخول | Helio');
    const { data: admins = [], isLoading } = useQuery({ queryKey: ['admins'], queryFn: getAdmins });
    const login = useStore((state) => state.login);
    const showToast = useStore((state) => state.showToast);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const admin = admins.find(a => a.email === email);
        
        // For demo purposes, we'll use a static password.
        if (admin && password === 'password123') {
            login(admin);
            navigate('/dashboard');
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
            showToast('البريد الإلكتروني أو كلمة المرور غير صحيحة.', 'error');
        }
    };

    const handleQuickLogin = (role: AdminUserRole) => {
        const admin = admins.find(a => a.roles.includes(role));
        if (admin) {
            login(admin);
            navigate('/dashboard');
        } else {
            showToast(`لم يتم العثور على مدير بالصلاحية: ${role}`, 'error');
        }
    };
    
    const quickLoginRoles: AdminUserRole[] = Object.values(AdminRoles);

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-8">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider mb-4">Helio</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">لوحة تحكم المدير</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        يرجى تسجيل الدخول للمتابعة.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6 text-right">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البريد الإلكتروني</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2.5 pr-10 bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6"
                                    placeholder="أدخل بريدك الإلكتروني"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">كلمة المرور</label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 py-2.5 pr-10 bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                        
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full justify-center rounded-md bg-cyan-500 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:bg-slate-400"
                            >
                                {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                         <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4">تسجيل دخول سريع للتجربة</h3>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {quickLoginRoles.map(role => (
                                <button
                                    key={role}
                                    onClick={() => handleQuickLogin(role)}
                                    disabled={isLoading}
                                    className="text-xs px-2 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                                >
                                    {role}
                                </button>
                            ))}
                         </div>
                         <p className="mt-4 text-xs text-gray-400">
                            كلمة المرور الافتراضية لأي حساب هي
                            <span className="font-mono mx-1">password123</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;