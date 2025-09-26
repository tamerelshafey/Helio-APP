import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { UIContextType, ToastMessage } from '../types';

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return true;
        const storedTheme = window.localStorage.getItem('theme');
        // Default to dark if not explicitly set to light
        return storedTheme !== 'light';
    });

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            window.localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Could not save theme preference.', e);
        }
    }, [isDarkMode]);

    const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);

    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const dismissToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const value = useMemo(() => ({
        isDarkMode,
        toggleDarkMode,
        toasts,
        showToast,
        dismissToast,
    }), [isDarkMode, toggleDarkMode, toasts, showToast, dismissToast]);


    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUIContext = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUIContext must be used within a UIProvider');
    }
    return context;
};
