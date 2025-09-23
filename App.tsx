import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Spinner from './components/common/Spinner';
import Breadcrumbs from './components/common/Breadcrumbs';

// Lazy-loaded page components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const PropertiesPage = lazy(() => import('./pages/PropertiesPage'));
const EmergencyPage = lazy(() => import('./pages/EmergencyPage'));
const UsersPage = lazy(() => import('./pages/UsersPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const TransportationPage = lazy(() => import('./pages/TransportationPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const CityServicesGuidePage = lazy(() => import('./pages/CityServicesGuidePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesOverviewPage = lazy(() => import('./pages/ServicesOverviewPage'));
const AboutCityPage = lazy(() => import('./pages/AboutCityPage'));
const AboutCompanyPage = lazy(() => import('./pages/AboutCompanyPage'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsOfUsePage = lazy(() => import('./pages/TermsOfUsePage'));


const App: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
          <div className="h-full w-full">
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
                <Route path="/transportation" element={<TransportationPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/city-services-guide" element={<CityServicesGuidePage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about-city" element={<AboutCityPage />} />
                <Route path="/about-company" element={<AboutCompanyPage />} />
                <Route path="/services-overview" element={<ServicesOverviewPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;