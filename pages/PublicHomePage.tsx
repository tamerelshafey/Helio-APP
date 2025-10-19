import React from 'react';
import { GooglePlayIcon, AppleIcon, WrenchScrewdriverIcon, NewspaperIcon, UserGroupIcon, HomeModernIcon } from '../components/common/Icons';
import { useAppContext } from '../context/AppContext';

const allIconComponents: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    WrenchScrewdriverIcon, NewspaperIcon, UserGroupIcon, HomeModernIcon
};

const getIcon = (name: string, props: React.SVGProps<SVGSVGElement>) => {
    const IconComponent = allIconComponents[name];
    return IconComponent ? <IconComponent {...props} /> : null;
};

const PublicHomePage: React.FC = () => {
    const { publicPagesContent } = useAppContext();
    const content = publicPagesContent.home;

    const phoneContentColors = [
        'bg-cyan-300', 'bg-purple-300', 'bg-yellow-300', 'bg-lime-300',
        'bg-pink-300', 'bg-orange-300', 'bg-sky-300', 'bg-emerald-300'
    ];

    return (
        <div className="animate-fade-in" dir="rtl">
            {/* Hero Section */}
            <section className="bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 min-h-[calc(100vh-4rem)] flex items-center">
                    <div className="grid md:grid-cols-2 gap-12 items-center w-full">
                        {/* Right column for text */}
                        <div className="text-center md:text-right">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-800 dark:text-white mb-6 leading-tight">
                                {content.heroTitleLine1}
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                                    {content.heroTitleLine2}
                                </span>
                            </h1>
                            <p className="max-w-xl mx-auto md:mx-0 text-lg text-gray-600 dark:text-gray-300 mb-8">
                                {content.heroSubtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                                <a href="https://play.google.com/store/apps/details?id=com.helio.company" target="_blank" rel="noopener noreferrer" className="bg-black text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-transform hover:scale-105 w-full sm:w-auto">
                                    <GooglePlayIcon className="w-8 h-8" />
                                    <div className="text-right">
                                        <p className="text-xs">GET IT ON</p>
                                        <p className="text-xl font-semibold leading-tight">Google Play</p>
                                    </div>
                                </a>
                                <div className="bg-gray-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 cursor-not-allowed w-full sm:w-auto opacity-70">
                                    <AppleIcon className="w-8 h-8" />
                                    <div className="text-right">
                                        <p className="text-xs">Download on the</p>
                                        <p className="text-xl font-semibold leading-tight">App Store</p>
                                        <p className="text-xs -mt-1 font-sans">(قريباً)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Left column for phone mockup */}
                        <div className="hidden md:flex justify-center items-center">
                            <div className="relative mx-auto border-slate-900 bg-slate-900 border-[10px] rounded-[2.5rem] h-[550px] w-[280px] shadow-2xl">
                                <div className="w-[120px] h-[18px] bg-slate-900 top-0 left-1/2 -translate-x-1/2 rounded-b-xl absolute"></div>
                                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-slate-800">
                                    <div className="animate-slow-scroll">
                                        {[...Array(14)].map((_, i) => (
                                            <div key={i} className="bg-white dark:bg-slate-800 p-2">
                                                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-sm flex items-center justify-between">
                                                    <div className="w-2/3 h-3 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                                                    <div className={`w-5 h-5 rounded-full ${phoneContentColors[i % phoneContentColors.length]}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Features Section */}
            <section className="py-20 bg-white dark:bg-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4 text-slate-800 dark:text-white">{content.featuresSectionTitle}</h2>
                        <p className="text-lg text-gray-500 dark:text-gray-400">{content.featuresSectionSubtitle}</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {content.features.map((feature, index) => (
                            <div key={index} className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                                <div className="inline-block p-4 bg-cyan-100 dark:bg-cyan-900 rounded-full mb-4">
                                    {getIcon(feature.icon, { className: "w-8 h-8 text-cyan-500"})}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PublicHomePage;