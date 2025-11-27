import React from 'react';
import { useStore } from '../store';
import GeneralDashboard from '../components/dashboard/GeneralDashboard';
import ServiceManagerDashboard from '../components/dashboard/ServiceManagerDashboard';
import PropertyManagerDashboard from '../components/dashboard/PropertyManagerDashboard';
import NewsManagerDashboard from '../components/dashboard/NewsManagerDashboard';
import TransportationManagerDashboard from '../components/dashboard/TransportationManagerDashboard';
import CommunityManagerDashboard from '../components/dashboard/CommunityManagerDashboard';
import { AdminRoles } from '../types';

const DashboardPage: React.FC = () => {
    const currentUser = useStore((state) => state.currentUser);

    if (!currentUser) {
        return <GeneralDashboard />; // Fallback or loading state
    }

    // A super admin sees the general dashboard
    if (currentUser.roles.includes(AdminRoles.SUPER_ADMIN)) {
        return <GeneralDashboard />;
    }
    
    // Role-specific dashboards with priority
    if (currentUser.roles.includes(AdminRoles.SERVICES_ADMIN)) {
        return <ServiceManagerDashboard />;
    }
    if (currentUser.roles.includes(AdminRoles.PROPERTY_ADMIN)) {
        return <PropertyManagerDashboard />;
    }
    if (currentUser.roles.includes(AdminRoles.CONTENT_ADMIN)) {
        return <NewsManagerDashboard />;
    }
    if (currentUser.roles.includes(AdminRoles.TRANSPORT_ADMIN)) {
        return <TransportationManagerDashboard />;
    }
    if (currentUser.roles.includes(AdminRoles.COMMUNITY_ADMIN)) {
        return <CommunityManagerDashboard />;
    }
    
    // Fallback to the general dashboard if no specific role matches
    return <GeneralDashboard />;
};

export default DashboardPage;