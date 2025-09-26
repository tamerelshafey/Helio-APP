import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Spinner from './components/common/Spinner';
import Breadcrumbs from './components/common/Breadcrumbs';
import { useAuthContext } from './context/AuthContext';
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// Lazy-loaded page components from the 'pages' directory
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const TransportationPage = lazy(() => import('./pages/TransportationPage'));
const CityServicesGuidePage = lazy(() => import('./pages/CityServicesGuidePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AdsPage = lazy(() => import('./pages/AdsPage'));
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const ContentManagementPage = lazy(() => import('./pages/ContentManagementPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const BuySellPage = lazy(() => import('./pages/BuySellPage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));

// Public/Auth Pages
const LoginPage = lazy(() => import('./pages/LoginPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));
const RequestDeletionPage = lazy(() => import('./pages/RequestDeletionPage'));
const AboutCityPage = lazy(() => import('./pages/AboutCityPage'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const PublicHomePage = lazy(() => import('./pages/PublicHomePage'));


const App: React.FC = () => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return (
      <>
        <div className="bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-900 min-h-screen font-sans flex flex-col" dir="rtl">
          <ScrollToTop />
          <PublicHeader />
          <main className="flex-grow">
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><Spinner /></div>}>
              <Routes>
                <Route path="/" element={<PublicHomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about-city" element={<AboutCityPage />} />
                <Route path="/about-company" element={<AboutCompanyPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                <Route path="/request-deletion" element={<RequestDeletionPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </main>
          <PublicFooter />
        </div>
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-300 font-sans" dir="rtl">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
            <div className="h-full w-full">
              <ScrollToTop />
              <Breadcrumbs />
              <Suspense fallback={<Spinner />}>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/services/subcategory/:subCategoryId" element={<ServicePage />} />
                  <Route path="/services/detail/:serviceId" element={<ServiceDetailPage />} />
                  <Route path="/properties" element={<PropertiesPage />} />
                  <Route path="/emergency" element={<EmergencyPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/ads" element={<AdsPage />} />
                  <Route path="/transportation" element={<TransportationPage />} />
                  <Route path="/city-services-guide" element={<CityServicesGuidePage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/services-overview" element={<ServicesOverviewPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/audit-log" element={<AuditLogPage />} />
                  <Route path="/content-management" element={<ContentManagementPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/buy-sell" element={<BuySellPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/about-city" element={<AboutCityPage />} />
                  <Route path="/about-company" element={<AboutCompanyPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default App;