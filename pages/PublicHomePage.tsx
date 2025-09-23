import React from 'react';
import { Link } from 'react-router-dom';
import { 
    BuildingLibraryIcon, BuildingOffice2Icon, InformationCircleIcon, 
    QuestionMarkCircleIcon, BookOpenIcon, DocumentDuplicateIcon, ArrowLeftIcon,
    GooglePlayIcon, AppleIcon
} from '../components/common/Icons';

const InfoCard: React.FC<{ to: string; icon: React.ReactNode; title: string; description: string }> = ({ to, icon, title, description }) => (
    <Link to={to} className="group block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 dark:bg-cyan-900/50 rounded-full mb-4 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400">{description}</p>
        <div className="flex items-center gap-2 mt-4 text-cyan-600 dark:text-cyan-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <span>اقرأ المزيد</span>
            <ArrowLeftIcon className="w-4 h-4" />
        </div>
    </Link>
);

const PublicHomePage: React.FC = () => {
    const cards = [
        { to: "/about-city", icon: <BuildingLibraryIcon className="w-6 h-6 text-cyan-500" />, title: "التعريف بالمدينة", description: "اكتشف تاريخ ورؤية مدينة هليوبوليس الجديدة المتكاملة." },
        { to: "/about-company", icon: <BuildingOffice2Icon className="w-6 h-6 text-cyan-500" />, title: "عن الشركة", description: "تعرف على شركة مصر الجديدة، المطور العقاري الرائد للمدينة." },
        { to: "/about", icon: <InformationCircleIcon className="w-6 h-6 text-cyan-500" />, title: "حول التطبيق", description: "ما هو تطبيق Helio؟ تعرف على رؤيتنا ومهمتنا لخدمة السكان." },
        { to: "/faq", icon: <QuestionMarkCircleIcon className="w-6 h-6 text-cyan-500" />, title: "الأسئلة الشائعة", description: "هل لديك سؤال؟ ابحث عن إجابات للأسئلة الأكثر شيوعًا هنا." },
        { to: "/privacy-policy", icon: <BookOpenIcon className="w-6 h-6 text-cyan-500" />, title: "سياسة الخصوصية", description: "نحن نهتم ببياناتك. اطلع على كيفية حماية معلوماتك." },
        { to: "/terms-of-use", icon: <DocumentDuplicateIcon className="w-6 h-6 text-cyan-500" />, title: "شروط الاستخدام", description: "القواعد واللوائح التي تحكم استخدامك لتطبيق Helio." }
    ];

    return (
        <div className="animate-fade-in" dir="rtl">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 dark:text-white mb-4">
                    مرحباً بك في <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Helio</span>
                </h1>
                <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
                    بوابتك الرقمية الشاملة لمدينة هليوبوليس الجديدة. كل ما تحتاجه من خدمات ومعلومات وأخبار في مكان واحد لتسهيل حياتك اليومية.
                </p>
                <Link to="/login" className="inline-block px-8 py-3 bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-600 transition-transform transform hover:scale-105">
                    الدخول إلى لوحة التحكم
                </Link>
            </section>

            {/* Info Cards Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map(card => (
                        <InfoCard key={card.to} {...card} />
                    ))}
                </div>
            </section>
            
            {/* Download App Section */}
            <section className="bg-slate-50 dark:bg-slate-800/50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-white mb-4">حمل التطبيق الآن</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 mb-12">
                        احصل على دليل هليوبوليس الجديدة الكامل في جيبك. تابع آخر الأخبار، اكتشف الخدمات، وتواصل مع مجتمعك بسهولة.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                        <div className="text-center">
                            <div className="bg-white p-4 rounded-lg shadow-lg inline-block">
                                <img 
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://play.google.com/store/apps/details?id=com.helio.company" 
                                    alt="QR Code for Google Play"
                                    width="160"
                                    height="160"
                                />
                            </div>
                            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">امسح الكود للتحميل</p>
                        </div>
                        <div className="flex flex-col space-y-4 w-52 text-left">
                            <a href="https://play.google.com/store/apps/details?id=com.helio.company" target="_blank" rel="noopener noreferrer" className="bg-black text-white rounded-lg px-4 py-3 flex items-center justify-center transition-transform hover:scale-105">
                                <GooglePlayIcon className="w-8 h-8 mr-3" />
                                <div className="rtl:text-right">
                                    <p className="text-xs">GET IT ON</p>
                                    <p className="text-xl font-semibold leading-tight">Google Play</p>
                                </div>
                            </a>
                            <div className="bg-black text-white rounded-lg px-4 py-3 flex items-center justify-center cursor-not-allowed opacity-60">
                                <AppleIcon className="w-8 h-8 mr-3" />
                                <div className="rtl:text-right">
                                    <p className="text-xs">Download on the</p>
                                    <p className="text-xl font-semibold leading-tight">App Store</p>
                                    <p className="text-xs -mt-1 font-sans">(قريباً)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PublicHomePage;