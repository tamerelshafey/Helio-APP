import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { mockUsers, mockAdmins } from '../data/mock-data';
import type { AppUser, AdminUser, UserManagementContextType, UserStatus, UserAccountType, SortConfig } from '../types';

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [users, setUsers] = useState<AppUser[]>([]);
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sortConfig, setSortConfig] = useState<SortConfig<AppUser>>(null);

    useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => {
            setUsers(mockUsers);
            setAdmins(mockAdmins);
            setLoading(false);
        }, 1500); // 1.5 second delay

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    const handleSortUsers = useCallback((key: keyof AppUser) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key) {
                return {
                    ...prevConfig,
                    direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
                };
            }
            return { key, direction: 'ascending' };
        });
    }, []);

    const handleSaveUser = useCallback((userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => {
        const isNew = !userData.id;
        setUsers(prev => {
            if (userData.id) {
                return prev.map(u => u.id === userData.id ? { ...u, ...userData, id: u.id, joinDate: u.joinDate } : u);
            } else {
                const newUser: AppUser = {
                    id: Math.max(...prev.map(u => u.id), 0) + 1,
                    ...userData,
                    joinDate: new Date().toISOString().split('T')[0],
                    accountType: 'user', // Default account type
                };
                return [newUser, ...prev];
            }
        });
        const action = isNew ? 'إضافة مستخدم جديد' : 'تعديل بيانات مستخدم';
        logActivity(action, `حفظ بيانات المستخدم: "${userData.name}"`);
    }, [logActivity]);
    
    const handleSetUserAccountType = useCallback((userId: number, accountType: UserAccountType) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountType } : u));
            const action = accountType === 'service_provider' ? 'ترقية حساب مستخدم' : 'إلغاء ترقية حساب';
            logActivity(action, `تم تغيير نوع حساب المستخدم "${user.name}" إلى "${accountType}".`);
        }
    }, [users, logActivity]);

    const handleDeleteUser = useCallback((id: number) => {
        const userName = users.find(u => u.id === id)?.name || `ID: ${id}`;
        setUsers(prev => prev.filter(u => u.id !== id));
        logActivity('حذف مستخدم', `حذف المستخدم: "${userName}"`);
    }, [users, logActivity]);
    
    const handleDeleteUsers = useCallback((ids: number[]) => {
        setUsers(prev => prev.filter(u => !ids.includes(u.id)));
        logActivity('حذف جماعي للمستخدمين', `تم حذف ${ids.length} مستخدمين.`);
    }, [logActivity]);

    const handleSaveAdmin = useCallback((adminData: Omit<AdminUser, 'id'> & { id?: number }) => {
        const isNew = !adminData.id;
        setAdmins(prev => {
            if (adminData.id) {
                return prev.map(a => a.id === adminData.id ? { ...a, ...adminData, id: a.id } : a);
            } else {
                const newAdmin: AdminUser = {
                    id: Math.max(...prev.map(a => a.id), 0) + 1,
                    ...adminData,
                };
                return [newAdmin, ...prev];
            }
        });
        const action = isNew ? 'إضافة مدير جديد' : 'تعديل بيانات مدير';
        logActivity(action, `حفظ بيانات المدير: "${adminData.name}"`);
    }, [logActivity]);

    const handleDeleteAdmin = useCallback((id: number) => {
        const adminName = admins.find(a => a.id === id)?.name || `ID: ${id}`;
        setAdmins(prev => prev.filter(a => a.id !== id));
        logActivity('حذف مدير', `حذف المدير: "${adminName}"`);
    }, [admins, logActivity]);

    const value = useMemo(() => ({
        users, admins, loading, sortConfig,
        handleSortUsers,
        handleSaveUser, handleDeleteUser,
        handleDeleteUsers,
        handleSetUserAccountType,
        handleSaveAdmin, handleDeleteAdmin,
    }), [
        users, admins, loading, sortConfig,
        handleSortUsers,
        handleSaveUser, handleDeleteUser, handleDeleteUsers,
        handleSetUserAccountType,
        handleSaveAdmin, handleDeleteAdmin
    ]);

    return <UserManagementContext.Provider value={value}>{children}</UserManagementContext.Provider>;
};

export const useUserManagementContext = (): UserManagementContextType => {
    const context = useContext(UserManagementContext);
    if (context === undefined) {
        throw new Error('useUserManagementContext must be used within a UserManagementProvider');
    }
    return context;
};