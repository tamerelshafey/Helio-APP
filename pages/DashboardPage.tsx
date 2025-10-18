import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import GeneralDashboard from '../components/dashboard/GeneralDashboard';
import ServiceManagerDashboard from '../components/dashboard/ServiceManagerDashboard';
import PropertyManagerDashboard from '../components/dashboard/PropertyManagerDashboard';
import NewsManagerDashboard from '../components/dashboard/NewsManagerDashboard';
import TransportationManagerDashboard from '../components/dashboard/TransportationManagerDashboard';
// FIX: Added missing import for CommunityManagerDashboard
import CommunityManagerDashboard from '../components/dashboard/CommunityManagerDashboard';

const DashboardPage: React.FC = () => {
    const { currentUser } = useAuthContext();

    if (!currentUser) {
        return <GeneralDashboard />; // Fallback or loading state
    }

    // A super admin sees the general dashboard
    if (currentUser.roles.includes('مدير عام')) {
        return <GeneralDashboard />;
    }
    
    // Role-specific dashboards with priority
    if (currentUser.roles.includes('مسؤول ادارة الخدمات')) {
        return <ServiceManagerDashboard />;
    }
    if (currentUser.roles.includes('مسؤول العقارات')) {
        return <PropertyManagerDashboard />;
    }
    if (currentUser.roles.includes('مسؤول المحتوى')) {
        return <NewsManagerDashboard />;
    }
    if (currentUser.roles.includes('مسؤول النقل')) {
        return <TransportationManagerDashboard />;
    }
    if (currentUser.roles.includes('مسؤول المجتمع')) {
        return <CommunityManagerDashboard />;
    }
    
    // Fallback to the general dashboard if no specific role matches
    return <GeneralDashboard />;
};

export default DashboardPage;
