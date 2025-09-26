import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon } from '../components/common/Icons';
import { useUIContext } from '../context/UIContext';

const RequestDeletionPage: React.FC = () => {
    const navigate = useNavigate();
    const { showToast } = useUIContext();
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            showToast('تم إرسال طلبك بنجاح. سيتم مراجعته والتواصل معك.', 'success');
            navigate('/');
        }, 1500);
    };

    return (
        <div className="animate-fade-in py-12 px-4" dir="rtl">
            <div className="max-w-2xl mx-auto">
                 <button onClick={() => navigate(-1)} className="flex items-center space-x-2 rtl:space-x-reverse text-cyan-500 dark:text-cyan-400 hover:underline mb-6">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>العودة</span>
                </button>
                <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-red-100 dark:bg-red-900/50 rounded-full">
                            <TrashIcon className="w-12 h-12 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mt-4">طلب حذف الحساب</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            نحن آسفون لرؤيتك ترحل. يرجى ملء النموذج أدناه لطلب حذف حسابك.
                        </p>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-right leading-relaxed mb-8">
                        <h2>ماذا يحدث عند حذف حسابك؟</h2>
                        <ul>
                            <li>سيتم حذف جميع بياناتك الشخصية بشكل دائم من أنظمتنا.</li>
                            <li>ستفقد الوصول إلى جميع الخدمات والمحتوى المرتبط بحسابك.</li>
                            <li>هذا الإجراء لا يمكن التراجع عنه.</li>
                        </ul>
                        <p>
                            سيقوم فريقنا بمراجعة طلبك ومعالجته في غضون 7-14 يوم عمل. قد نتواصل معك عبر البريد الإلكتروني لتأكيد هويتك قبل المتابعة.
                        </p>
                         <p className="font-semibold">إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، يمكنك التواصل معنا عبر:</p>
                        <ul>
                            <li><strong>البريد الإلكتروني:</strong> <a href="mailto:HelioAPP@tech-bokra.com">HelioAPP@tech-bokra.com</a></li>
                            <li><strong>واتساب:</strong> <a href="https://wa.me/201040303547" target="_blank" rel="noopener noreferrer">+20 104 030 3547</a></li>
                        </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                البريد الإلكتروني المسجل في التطبيق
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                             <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                سبب الحذف (اختياري)
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-100 dark:bg-slate-700 rounded-md p-3 focus:ring-2 focus:ring-cyan-500"
                                placeholder="نود أن نعرف كيف يمكننا تحسين خدماتنا..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 bg-red-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                 <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                                 <span>جاري الإرسال...</span>
                                </>
                            ) : (
                                'إرسال طلب الحذف'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestDeletionPage;