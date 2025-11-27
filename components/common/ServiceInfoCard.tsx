import React from 'react';
import type { Service } from '../../types';
import {
    ClockIcon, MapPinIcon, PhoneIcon, ShareIcon,
    FacebookIcon, InstagramIcon, WhatsappIcon
} from './Icons';
import { useStore } from '../../store';

const ServiceInfoCard: React.FC<{ service: Service }> = ({ service }) => {
    const showToast = useStore((state) => state.showToast);

    const handleShare = async () => {
        const shareData = {
            title: service.name,
            text: `${service.name}: ${service.about.substring(0, 100)}...`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                showToast('تم نسخ الرابط بنجاح!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            showToast('فشلت المشاركة.', 'error');
        }
    };
    
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`;

    const InfoRow: React.FC<{ icon: React.ReactNode, children: React.ReactNode, href?: string }> = ({ icon, children, href }) => {
        const content = <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">{icon}{children}</div>;
        if (href) {
            return <a href={href} target="_blank" rel="noopener noreferrer" className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">{content}</a>
        }
        return <div className="p-2">{content}</div>
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white pb-3 border-b border-slate-200 dark:border-slate-700">معلومات وتواصل</h2>

            {service.workingHours && (
                 <InfoRow icon={<ClockIcon className="w-6 h-6 text-gray-400" />}>
                    <p className="whitespace-pre-wrap text-sm">{service.workingHours}</p>
                 </InfoRow>
            )}

            <InfoRow icon={<MapPinIcon className="w-6 h-6 text-gray-400" />} href={mapUrl}>
                <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">عرض على الخريطة</span>
            </InfoRow>
            
            {service.facebookUrl && (
                 <InfoRow icon={<FacebookIcon className="w-6 h-6 text-blue-600" />} href={service.facebookUrl}>
                    <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">صفحة الفيسبوك</span>
                 </InfoRow>
            )}

            {service.instagramUrl && (
                 <InfoRow icon={<InstagramIcon className="w-6 h-6 text-pink-600" />} href={service.instagramUrl}>
                    <span className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">صفحة الإنستغرام</span>
                 </InfoRow>
            )}

            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <a href={`tel:${service.phone}`} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    <PhoneIcon className="w-5 h-5"/>
                    <span>اتصال: {service.phone}</span>
                </a>
                {service.phone2 && (
                    <a href={`tel:${service.phone2}`} className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                        <PhoneIcon className="w-5 h-5"/>
                        <span>اتصال: {service.phone2}</span>
                    </a>
                )}
                 <a href={`https://wa.me/${service.whatsapp}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors">
                    <WhatsappIcon className="w-5 h-5"/>
                    <span>واتساب</span>
                </a>
                 <button onClick={handleShare} className="w-full flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <ShareIcon className="w-5 h-5"/>
                    <span>مشاركة</span>
                </button>
            </div>
        </div>
    );
};

export default ServiceInfoCard;