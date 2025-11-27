import { useStore } from '../store';
import type { AdminUserRole } from '../types';

export const useHasPermission = (requiredRoles: AdminUserRole[]) => {
    const currentUser = useStore((state) => state.currentUser);
    
    if (!currentUser) return false;
    
    // Super admin can do anything
    if (currentUser.roles.includes('مدير عام')) return true;
    
    // If no specific roles are required, and the user is not a super admin, deny.
    if (requiredRoles.length === 0) return false;

    // Check if the user has at least one of the required roles
    return requiredRoles.some(role => currentUser.roles.includes(role));
};