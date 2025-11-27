import { StateCreator } from 'zustand';
import type { AdminUser } from '../types';

export interface AuthSlice {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (user: AdminUser) => void;
  logout: () => void;
}

const getStoredUser = (): AdminUser | null => {
  try {
    const storedUser = sessionStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse user from sessionStorage", error);
    return null;
  }
};

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  currentUser: getStoredUser(),
  isAuthenticated: !!getStoredUser(),
  login: (user) => {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    set({ currentUser: user, isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem('currentUser');
    set({ currentUser: null, isAuthenticated: false });
  },
});