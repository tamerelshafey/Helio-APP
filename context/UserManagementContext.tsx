import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { useAppContext } from './AppContext';
import { mockUsers, mockAdmins } from '../data/mock-data';
import type { AppUser, AdminUser, UserManagementContextType, UserStatus } from '../types';

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export const UserManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { logActivity } = useAppContext();
    const [users, setUsers] = useState<AppUser[]>(mockUsers);
    const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins);

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
                };
                return [newUser, ...prev];
            }
        });
        const action = isNew ? 'إضافة مستخدم جديد' : 'تعديل بيانات مستخدم';
        logActivity(action, `حفظ بيانات المستخدم: "${userData.name}"`);
    }, [logActivity]);

    const handleDeleteUser = useCallback((id: number) => {
        const userName = users.find(u => u.id === id)?.name || `ID: ${id}`;
        setUsers(prev => prev.filter(u => u.id !== id));
        logActivity('حذف مستخدم', `حذف المستخدم: "${userName}"`);
    }, [users, logActivity]);

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
        users, admins,
        handleSaveUser, handleDeleteUser,
        handleSaveAdmin, handleDeleteAdmin,
    }), [
        users, admins,
        handleSaveUser, handleDeleteUser,
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