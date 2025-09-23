import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeftOnRectangleIcon } from '../components/common/Icons';

const LoginPage: React.FC = () => {
    const { login } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = () => {
        login();
        navigate('/'); // Navigate to the dashboard home
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-900 px-4">
            <div className="w-full max-w-md text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider mb-4">Helio</h1>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">لوحة تحكم المدير</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        يرجى تسجيل الدخول للوصول إلى أدوات الإدارة الشاملة.
                    </p>
                    <button
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 dark:focus:ring-offset-slate-800 transition-all duration-300 transform hover:scale-105"
                    >
                        <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                        <span>دخول سريع (للتطوير)</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
