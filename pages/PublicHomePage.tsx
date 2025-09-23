import React from 'react';
import { Link } from 'react-router-dom';
import { 
    InformationCircleIcon, 
    QuestionMarkCircleIcon, 
    BookOpenIcon, 
    DocumentDuplicateIcon,
    ArrowLeftIcon,
    GooglePlayIcon, 
    AppleIcon,
    MagnifyingGlassIcon,
    NewspaperIcon,
    UserGroupIcon
} from '../components/common/Icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="flex items-center justify-center w-16 h-16 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
);


const PublicHomePage: React.FC = () => {

    return (
        <div className="animate-fade-in" dir="rtl">
            {/* Hero Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-center md:text-right">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-white mb-4 leading-tight">
                            مدينتك...
                            <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                في تطبيق واحد
                            </span>
                        </h1>
                        <p className="max-w-xl mx-auto md:mx-0 text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Helio هو دليلك الشامل لاستكشاف الخدمات، متابعة الأخبار، والتواصل مع مجتمع هليوبوليس الجديدة.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                            <a href="https://play.google.com/store/apps/details?id=com.helio.company" target="_blank" rel="noopener noreferrer" className="bg-black text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-transform hover:scale-105 w-full sm:w-auto">
                                <GooglePlayIcon className="w-8 h-8" />
                                <div className="text-right">
                                    <p className="text-xs">GET IT ON</p>
                                    <p className="text-xl font-semibold leading-tight">Google Play</p>
                                </div>
                            </a>
                            <div className="bg-black text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 cursor-not-allowed opacity-60 w-full sm:w-auto">
                                <AppleIcon className="w-8 h-8" />
                                <div className="text-right">
                                    <p className="text-xs">Download on the</p>
                                    <p className="text-xl font-semibold leading-tight">App Store</p>
                                    <p className="text-xs -mt-1 font-sans">(قريباً)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center items-center">
                         <div className="relative w-72 h-[34rem] bg-slate-900 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-8 bg-slate-900 z-10 flex justify-center items-end">
                                <div className="w-24 h-4 bg-slate-800 rounded-b-lg"></div>
                            </div>
                             {/* Mock app screen */}
                             <div className="bg-slate-100 dark:bg-slate-900 h-full w-full p-4 space-y-4 overflow-y-auto">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow"><div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-cyan-200 dark:bg-cyan-700"></div><div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-purple-200 dark:bg-purple-700"></div><div className="w-2/3 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-700"></div><div className="w-1/2 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-lime-200 dark:bg-lime-700"></div><div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-rose-200 dark:bg-rose-700"></div><div className="w-1/3 h-4 bg-slate-200 dark:bg-slate-700 rounded"></div></div>
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-slate-50 dark:bg-slate-900/50 py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4">كل ما تحتاجه في هليوبوليس الجديدة</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            استكشف، تواصل، وكن على اطلاع دائم. Helio مصمم ليكون رفيقك اليومي في المدينة.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<MagnifyingGlassIcon className="w-8 h-8 text-cyan-500"/>} 
                            title="دليل شامل" 
                            description="كل الخدمات والمحلات والمرافق بين يديك، مع تقييمات حقيقية من السكان."
                        />
                        <FeatureCard 
                            icon={<NewspaperIcon className="w-8 h-8 text-cyan-500"/>} 
                            title="أخبار وتنبيهات" 
                            description="لا تفوت أي جديد! كن على اطلاع بآخر مستجدات وأخبار المدينة أولاً بأول."
                        />
                        <FeatureCard 
                            icon={<UserGroupIcon className="w-8 h-8 text-cyan-500"/>} 
                            title="مجتمع متصل" 
                            description="شارك برأيك وتقييماتك للخدمات وكن جزءًا من مجتمع فعال ومتعاون."
                        />
                    </div>
                </div>
            </section>

             {/* Info Links Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                 <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4">معلومات تهمك</h2>
                </div>
                <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <Link to="/about" className="group flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <InformationCircleIcon className="w-8 h-8 text-cyan-500"/>
                        <div><h4 className="font-semibold text-gray-800 dark:text-white">حول التطبيق</h4><p className="text-sm text-gray-500 dark:text-gray-400">اعرف المزيد عن رؤيتنا.</p></div>
                        <ArrowLeftIcon className="w-5 h-5 mr-auto text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    </Link>
                     <Link to="/faq" className="group flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <QuestionMarkCircleIcon className="w-8 h-8 text-cyan-500"/>
                        <div><h4 className="font-semibold text-gray-800 dark:text-white">الأسئلة الشائعة</h4><p className="text-sm text-gray-500 dark:text-gray-400">إجابات على أسئلتك.</p></div>
                        <ArrowLeftIcon className="w-5 h-5 mr-auto text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    </Link>
                     <Link to="/privacy-policy" className="group flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <BookOpenIcon className="w-8 h-8 text-cyan-500"/>
                        <div><h4 className="font-semibold text-gray-800 dark:text-white">سياسة الخصوصية</h4><p className="text-sm text-gray-500 dark:text-gray-400">كيف نحمي بياناتك.</p></div>
                        <ArrowLeftIcon className="w-5 h-5 mr-auto text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    </Link>
                    <Link to="/terms-of-use" className="group flex items-center gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <DocumentDuplicateIcon className="w-8 h-8 text-cyan-500"/>
                        <div><h4 className="font-semibold text-gray-800 dark:text-white">شروط الاستخدام</h4><p className="text-sm text-gray-500 dark:text-gray-400">قواعد استخدام التطبيق.</p></div>
                        <ArrowLeftIcon className="w-5 h-5 mr-auto text-gray-400 group-hover:text-cyan-500 transition-colors" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default PublicHomePage;