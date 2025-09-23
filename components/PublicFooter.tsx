import React from 'react';
import { Link } from 'react-router-dom';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-4 gap-8 text-right">
                    <div className="md:col-span-2">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Helio</h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">بوابتك الرقمية لمدينة هليوبوليس الجديدة.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">روابط سريعة</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">حول التطبيق</Link></li>
                            <li><Link to="/faq" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">الأسئلة الشائعة</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">قانوني</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">سياسة الخصوصية</Link></li>
                            <li><Link to="/terms-of-use" className="text-gray-500 dark:text-gray-400 hover:text-cyan-500">شروط الاستخدام</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Helio. جميع الحقوق محفوظة.</p>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;