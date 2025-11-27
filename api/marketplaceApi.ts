import { mockForSaleItems, mockJobs } from '../data/mock-data';
import type { ForSaleItem, JobPosting } from '../types';

// Simulate backend storage
let forSaleItems = JSON.parse(JSON.stringify(mockForSaleItems));
let jobs = JSON.parse(JSON.stringify(mockJobs));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Sale Items ---
export const getSaleItems = async (): Promise<ForSaleItem[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(forSaleItems));
};

export const approveSaleItem = async (id: number): Promise<void> => {
    await delay(400);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiryDate = thirtyDaysFromNow.toISOString().split('T')[0];
    const approvalDate = new Date().toISOString().split('T')[0];

    forSaleItems = forSaleItems.map((item: ForSaleItem) => 
        item.id === id ? { ...item, status: 'approved', approvalDate, expiryDate } : item
    );
};

export const rejectSaleItem = async (id: number): Promise<void> => {
    await delay(400);
    forSaleItems = forSaleItems.map((item: ForSaleItem) => 
        item.id === id ? { ...item, status: 'rejected' } : item
    );
};

export const deleteSaleItem = async (id: number): Promise<void> => {
    await delay(300);
    forSaleItems = forSaleItems.filter((item: ForSaleItem) => item.id !== id);
};

// --- Jobs ---
export const getJobs = async (): Promise<JobPosting[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(jobs));
};

export const approveJob = async (id: number): Promise<void> => {
    await delay(400);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const expiryDate = thirtyDaysFromNow.toISOString().split('T')[0];
    const approvalDate = new Date().toISOString().split('T')[0];

    jobs = jobs.map((item: JobPosting) => 
        item.id === id ? { ...item, status: 'approved', approvalDate, expiryDate } : item
    );
};

export const rejectJob = async (id: number): Promise<void> => {
    await delay(400);
    jobs = jobs.map((item: JobPosting) => 
        item.id === id ? { ...item, status: 'rejected' } : item
    );
};

export const deleteJob = async (id: number): Promise<void> => {
    await delay(300);
    jobs = jobs.filter((item: JobPosting) => item.id !== id);
};
