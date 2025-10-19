import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HomeIcon } from './Icons';

const breadcrumbNameMap: { [key: string]: string } = {
  'services': 'الخدمات',
  'services-overview': 'هيكل الخدمات',
  'properties': 'إدارة العقارات',
  'emergency': 'إدارة الطوارئ',
  'users': 'المستخدمون',
  'news': 'أخبار المدينة',
  'notifications': 'إدارة الإشعارات',
  'ads': 'إدارة الإعلانات',
  'transportation': 'إدارة النقل',
  'settings': 'الإعدادات',
  'city-services-guide': 'دليل خدمات جهاز المدينة',
  'privacy-policy': 'سياسة الخصوصية',
  'reports': 'التقارير',
  'about': 'حول التطبيق',
  'about-city': 'التعريف بالمدينة',
  'about-company': 'تعريف بالشركة',
  'subcategory': 'فئة فرعية',
  'detail': 'تفاصيل',
  'reviews': 'إدارة التقييمات',
  'faq': 'الأسئلة الشائعة',
  'terms-of-use': 'شروط الاستخدام',
  'audit-log': 'سجل التدقيق',
  'content-management': 'إدارة المحتوى',
  'community': 'إدارة المجتمع',
  'buy-sell': 'البيع والشراء',
  'jobs': 'الوظائف',
  'lost-and-found': 'المفقودات',
  'blank': 'صفحة فارغة',
  'offers': 'إدارة العروض',
};

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x && x !== 'dashboard');

    return (
        <nav className="mb-6 flex items-center space-x-2 rtl:space-x-reverse text-sm font-sans" aria-label="Breadcrumb">
            <Link to="/dashboard" className="text-gray-500 hover:text-cyan-500 transition-colors flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                <span>الرئيسية</span>
            </Link>
            
            {pathnames.length > 0 && <span className="text-gray-400">/</span>}

            {pathnames.map((value, index) => {
                const isLast = index === pathnames.length - 1;
                const to = `/dashboard/${pathnames.slice(0, index + 1).join('/')}`;
                
                let displayName = breadcrumbNameMap[value as keyof typeof breadcrumbNameMap] || value;
                
                // If the previous part was 'users' and this part is a number, display "تفاصيل المستخدم"
                if (pathnames[index - 1] === 'users' && !isNaN(Number(value))) {
                    displayName = 'تفاصيل المستخدم';
                } else if (!isNaN(Number(value))) {
                    // Don't render generic IDs
                    return null;
                }


                return (
                    <React.Fragment key={to}>
                        {isLast ? (
                            <span className="font-semibold text-gray-700 dark:text-gray-200" aria-current="page">
                                {displayName}
                            </span>
                        ) : (
                            <Link to={to} className="text-gray-500 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
                                {displayName}
                            </Link>
                        )}
                        {/* Add separator only if the next item is not a number/ID */}
                        {!isLast && pathnames[index+1] && isNaN(Number(pathnames[index+1])) && <span className="mx-2 text-gray-400">/</span>}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumbs;