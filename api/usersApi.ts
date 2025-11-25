import { mockUsers, mockAdmins } from '../data/mock-data';
import type { AppUser, AdminUser, UserAccountType } from '../types';

// Simulate a database/API backend with mutable data
let users: AppUser[] = JSON.parse(JSON.stringify(mockUsers));
let admins: AdminUser[] = JSON.parse(JSON.stringify(mockAdmins));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- User Functions ---

export const getUsers = async (): Promise<AppUser[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(users));
};

export const getUserById = async (id: number): Promise<AppUser | undefined> => {
    await delay(300);
    return JSON.parse(JSON.stringify(users.find(u => u.id === id)));
}

export const saveUser = async (userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }): Promise<AppUser> => {
    await delay(500);
    const isNew = !userData.id;
    if (isNew) {
        const newUser: AppUser = {
            id: Math.max(...users.map(u => u.id).concat(0)) + 1,
            ...userData,
            joinDate: new Date().toISOString().split('T')[0],
        };
        users.unshift(newUser);
        return newUser;
    } else {
        let updatedUser: AppUser | undefined;
        users = users.map(u => {
            if (u.id === userData.id) {
                updatedUser = { ...u, ...userData, id: u.id };
                return updatedUser;
            }
            return u;
        });
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    }
};

export const deleteUser = async (id: number): Promise<{ id: number }> => {
    await delay(400);
    users = users.filter(u => u.id !== id);
    return { id };
};

export const deleteUsers = async (ids: number[]): Promise<{ ids: number[] }> => {
    await delay(600);
    users = users.filter(u => !ids.includes(u.id));
    return { ids };
};

export const setUserAccountType = async ({ userId, accountType }: { userId: number, accountType: UserAccountType }): Promise<AppUser> => {
    await delay(300);
    let updatedUser: AppUser | undefined;
    users = users.map(u => {
        if (u.id === userId) {
            updatedUser = { ...u, accountType };
            return updatedUser;
        }
        return u;
    });
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
};

// --- Admin Functions ---

export const getAdmins = async (): Promise<AdminUser[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(admins));
};

export const saveAdmin = async (adminData: Omit<AdminUser, 'id'> & { id?: number }): Promise<AdminUser> => {
    await delay(500);
    const isNew = !adminData.id;
    if (isNew) {
        const newAdmin: AdminUser = {
            id: Math.max(...admins.map(a => a.id).concat(0)) + 1,
            ...adminData,
        };
        admins.unshift(newAdmin);
        return newAdmin;
    } else {
        let updatedAdmin: AdminUser | undefined;
        admins = admins.map(a => {
            if (a.id === adminData.id) {
                updatedAdmin = { ...a, ...adminData, id: a.id };
                return updatedAdmin;
            }
            return a;
        });
        if (!updatedAdmin) throw new Error("Admin not found");
        return updatedAdmin;
    }
};

export const deleteAdmin = async (id: number): Promise<{ id: number }> => {
    await delay(400);
    admins = admins.filter(a => a.id !== id);
    return { id };
};
