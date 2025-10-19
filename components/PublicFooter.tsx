import React from 'react';
import { Link } from 'react-router-dom';
import { GooglePlayIcon, AppleIcon } from './common/Icons';

const PublicFooter: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
                    <div className="md:col-span-2 lg:col-span-1">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Helio APP</h2>
                        <p className="text-gray-500 mt-2 dark:text-gray-400">بوابتك الرقمية لمدينة هليوبوليس الجديدة.</p>
                         <div className="flex flex-col sm:flex-row gap-2 mt-4">
                            <a href="https://play.google.com/store/apps/details?id=com.helio.company" target="_blank" rel="noopener noreferrer" className="bg-black text-white rounded-lg px-3 py-2 flex items-center gap-2 transition-transform hover:scale-105">
                                <GooglePlayIcon className="w-6 h-6" />
                                <div className="text-right">
                                    <p className="text-xs leading-none">GET IT ON</p>
                                    <p className="text-lg font-semibold leading-tight">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">روابط سريعة</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">الرئيسية</Link></li>
                            <li><Link to="/about" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">حول التطبيق</Link></li>
                            <li><Link to="/faq" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">الأسئلة الشائعة</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">قانوني</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/privacy-policy" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">سياسة الخصوصية</Link></li>
                            <li><Link to="/terms-of-use" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">شروط الاستخدام</Link></li>
                            <li><Link to="/request-deletion" className="text-gray-500 hover:text-cyan-500 dark:text-gray-400 dark:hover:text-cyan-400">طلب حذف الحساب</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">تواصل معنا</h3>
                        <ul className="mt-4 space-y-2 text-gray-500 dark:text-gray-400">
                            <li><a href="mailto:HelioAPP@tech-bokra.com" className="hover:text-cyan-500 dark:hover:text-cyan-400">HelioAPP@tech-bokra.com</a></li>
                            <li><a href="tel:+201040303547" className="hover:text-cyan-500 dark:hover:text-cyan-400" dir="ltr">+20 104 030 3547</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-gray-500 dark:text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Helio APP. جميع الحقوق محفوظة.</p>
                    <Link to="/login" className="text-xs text-gray-400 hover:text-cyan-500 mt-2 inline-block">دخول المسؤولين</Link>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;