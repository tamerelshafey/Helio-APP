import React, { ReactNode, Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Breadcrumbs from './components/common/Breadcrumbs';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy load all page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AdsPage = lazy(() => import('./pages/AdsPage'));
const TransportationPage = lazy(() => import('./pages/TransportationPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CityServicesGuidePage = lazy(() => import('./pages/CityServicesGuidePage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const UserDetailPage = lazy(() => import('./pages/UserDetailPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const ContentManagementPage = lazy(() => import('./pages/ContentManagementPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));

// Lazy load public pages
const PublicHeader = lazy(() => import('./components/PublicHeader'));
const PublicFooter = lazy(() => import('./components/PublicFooter'));
const PublicHomePage = lazy(() => import('./pages/PublicHomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AboutCityPage = lazy(() => import('./pages/AboutCityPage'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const RequestDeletionPage = lazy(() => import('./pages/RequestDeletionPage'));


const AdminLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden" dir="rtl">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main id="main-content" className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
                    <Breadcrumbs />
                    {children}
                </main>
            </div>
        </div>
    );
};

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900" dir="rtl">
            <PublicHeader />
            <main className="flex-grow">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
};

// Wrapper for public routes that renders the public layout
const PublicRoutesWrapper: React.FC = () => {
    return <PublicLayout><Outlet /></PublicLayout>;
};

// Wrapper for protected routes that checks auth and renders the admin layout
const ProtectedRoutesWrapper: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    // The Outlet here will render the nested admin routes
    return <AdminLayout><Outlet /></AdminLayout>;
};

// Wrapper for the login page to redirect if already authenticated
const LoginPageWrapper: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen w-full bg-slate-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400">
        جاري تحميل الصفحة...
    </div>
);


const App: React.FC = () => {
    
    useEffect(() => {
        /**
         * This effect improves mobile UX by ensuring that when a user focuses on an input field,
         * the on-screen keyboard does not cover it.
         */
        const handleFocusIn = (event: FocusEvent) => {
            const target = event.target as HTMLElement;

            // Check if the focused element is an input, textarea, or contentEditable element.
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // A short delay is necessary to wait for the keyboard to animate into view
                // before attempting to scroll the element.
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        };

        // 'focusin' event bubbles up, allowing us to use a single listener on the document.
        document.addEventListener('focusin', handleFocusIn);

        return () => {
            document.removeEventListener('focusin', handleFocusIn);
        };
    }, []);

    return (
        <>
            <ScrollToTop />
            <ToastContainer />
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Login page has no layout and redirects if user is already authenticated */}
                    <Route path="/login" element={<LoginPageWrapper />} />

                    {/* Public Routes are wrapped in the PublicLayout */}
                    <Route element={<PublicRoutesWrapper />}>
                        <Route path="/" element={<PublicHomePage />} />
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/about-city" element={<AboutCityPage />} />
                        <Route path="/about-company" element={<AboutCompanyPage />} />
                        <Route path="/faq" element={<FaqPage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                        <Route path="/request-deletion" element={<RequestDeletionPage />} />
                    </Route>
                    
                    {/* All Protected Admin Routes are wrapped in the ProtectedRoutesWrapper under /dashboard */}
                    <Route path="/dashboard" element={<ProtectedRoutesWrapper />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="services-overview" element={<ServicesOverviewPage />} />
                        <Route path="services/subcategory/:subCategoryId" element={<ServicePage />} />
                        <Route path="services/detail/:serviceId" element={<ServiceDetailPage />} />
                        <Route path="properties" element={<PropertiesPage />} />
                        <Route path="emergency" element={<EmergencyPage />} />
                        <Route path="news" element={<NewsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="ads" element={<AdsPage />} />
                        <Route path="transportation" element={<TransportationPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="city-services-guide" element={<CityServicesGuidePage />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="users/:userId" element={<UserDetailPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="reviews" element={<ReviewsPage />} />
                        <Route path="audit-log" element={<AuditLogPage />} />
                        <Route path="content-management" element={<ContentManagementPage />} />
                        <Route path="community" element={<CommunityPage />} />
                        <Route path="offers" element={<OffersPage />} />
                    </Route>
                    
                    {/* A fallback for any path that doesn't match will redirect to the public home page */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default App;