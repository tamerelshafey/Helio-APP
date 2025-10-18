import React, { ReactNode } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuthContext } from './context/AuthContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Breadcrumbs from './components/common/Breadcrumbs';
import ToastContainer from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';

// Page Imports
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ServicesOverviewPage from './pages/ServicesOverviewPage';
import ServicePage from './pages/ServicePage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import PropertiesPage from './pages/PropertiesPage';
import EmergencyPage from './pages/EmergencyPage';
import NewsPage from './pages/NewsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdsPage from './pages/AdsPage';
import TransportationPage from './pages/TransportationPage';
import SettingsPage from './pages/SettingsPage';
import CityServicesGuidePage from './pages/CityServicesGuidePage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import ReviewsPage from './pages/ReviewsPage';
import AuditLogPage from './pages/AuditLogPage';
import ContentManagementPage from './pages/ContentManagementPage';
import CommunityPage from './pages/CommunityPage';


// Public Pages
import PublicHeader from './components/PublicHeader';
import PublicFooter from './components/PublicFooter';
import PublicHomePage from './pages/PublicHomePage';
import AboutPage from './pages/AboutPage';
import AboutCityPage from './pages/AboutCityPage';
import AboutCompanyPage from './pages/AboutCompanyPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import RequestDeletionPage from './pages/RequestDeletionPage';

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
    return <AdminLayout><Outlet /></AdminLayout>;
};

// Wrapper for the login page to redirect if already authenticated
const LoginPageWrapper: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    return isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />;
};

// Wrapper for the root page to decide which component to show based on auth state
const RootPageWrapper: React.FC = () => {
    const { isAuthenticated } = useAuthContext();
    // When authenticated, the root path shows the Dashboard inside the AdminLayout.
    // When not authenticated, it redirects to the public home page.
    return isAuthenticated 
        ? <AdminLayout><DashboardPage /></AdminLayout> 
        : <Navigate to="/home" replace />;
};

const App: React.FC = () => {
    return (
        <>
            <ScrollToTop />
            <ToastContainer />
            <Routes>
                {/* The root route is special and has its own wrapper to handle auth state */}
                <Route path="/" element={<RootPageWrapper />} />
                
                {/* Login page has no layout and redirects if user is already authenticated */}
                <Route path="/login" element={<LoginPageWrapper />} />

                {/* Other Public Routes are wrapped in the PublicLayout */}
                <Route element={<PublicRoutesWrapper />}>
                    <Route path="/home" element={<PublicHomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/about-city" element={<AboutCityPage />} />
                    <Route path="/about-company" element={<AboutCompanyPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                    <Route path="/request-deletion" element={<RequestDeletionPage />} />
                </Route>
                
                {/* All Protected Admin Routes are wrapped in the ProtectedRoutesWrapper */}
                <Route element={<ProtectedRoutesWrapper />}>
                    {/* The dashboard is now handled at the root path, but we add a redirect for convenience */}
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                    <Route path="/services-overview" element={<ServicesOverviewPage />} />
                    <Route path="/services/subcategory/:subCategoryId" element={<ServicePage />} />
                    <Route path="/services/detail/:serviceId" element={<ServiceDetailPage />} />
                    <Route path="/properties" element={<PropertiesPage />} />
                    <Route path="/emergency" element={<EmergencyPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/ads" element={<AdsPage />} />
                    <Route path="/transportation" element={<TransportationPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/city-services-guide" element={<CityServicesGuidePage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/reviews" element={<ReviewsPage />} />
                    <Route path="/audit-log" element={<AuditLogPage />} />
                    <Route path="/content-management" element={<ContentManagementPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                </Route>
                
                {/* A fallback for any path that doesn't match will redirect to the root */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;