import React from 'react';
import { GooglePlayIcon, AppleIcon } from '../components/common/Icons';

const PublicHomePage: React.FC = () => {
    const phoneContentColors = [
        'bg-cyan-300',
        'bg-purple-300',
        'bg-yellow-300',
        'bg-lime-300',
        'bg-pink-300',
        'bg-orange-300'
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
                                مدينتك
                                <span className="text-slate-600 dark:text-slate-400 tracking-tighter">...</span>
                                <br />
                                <span className="text-purple-400">في</span>
                                {' '}
                                <span className="text-cyan-400">تطبيق واحد</span>
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
                                <div className="bg-gray-700 text-white rounded-lg px-4 py-3 flex items-center justify-center gap-3 cursor-not-allowed w-full sm:w-auto">
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
                                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                                    <div className="p-2 pt-4 space-y-2">
                                        {[...Array(7)].map((_, i) => (
                                            <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                                <div className="w-2/3 h-3 bg-gray-200 rounded-full"></div>
                                                <div className={`w-5 h-5 rounded-full ${phoneContentColors[i % phoneContentColors.length]}`}></div>
                                            </div>
                                        ))}
                                    </div>
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
