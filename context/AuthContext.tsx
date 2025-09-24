import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import type { AdminUser, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
        try {
            const storedUser = sessionStorage.getItem('currentUser');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from sessionStorage", error);
            return null;
        }
    });

    const isAuthenticated = !!currentUser;

    const login = useCallback((user: AdminUser) => {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
    }, []);

    const logout = useCallback(() => {
        sessionStorage.removeItem('currentUser');
        setCurrentUser(null);
    }, []);

    const value = useMemo(() => ({
        currentUser,
        isAuthenticated,
        login,
        logout,
    }), [currentUser, isAuthenticated, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};

export const useHasPermission = (requiredRoles: AdminUser['role'][]) => {
    const { currentUser } = useAuthContext();
    if (!currentUser) return false;
    // Super admin can do anything
    if (currentUser.role === 'مدير عام') return true;
    return requiredRoles.includes(currentUser.role);
};
