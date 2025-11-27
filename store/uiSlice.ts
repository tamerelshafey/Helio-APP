import { StateCreator } from 'zustand';
import type { ToastMessage } from '../types';

export interface UISlice {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error') => void;
  dismissToast: (id: number) => void;
}

const getStoredTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const storedTheme = window.localStorage.getItem('theme');
  return storedTheme === 'dark';
};

export const createUISlice: StateCreator<UISlice> = (set) => ({
  isDarkMode: getStoredTheme(),
  toggleDarkMode: () => set((state) => {
    const newMode = !state.isDarkMode;
    const theme = newMode ? 'dark' : 'light';
    
    // Update DOM
    if (newMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Update Storage
    try {
        window.localStorage.setItem('theme', theme);
    } catch (e) {
        console.warn('Could not save theme preference.', e);
    }

    return { isDarkMode: newMode };
  }),
  toasts: [],
  showToast: (message, type = 'success') => {
    const id = Date.now();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
  },
  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
});