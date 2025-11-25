import { mockCategories, mockServices } from '../data/mock-data';
import type { Category, Service, SubCategory, Review } from '../types';

// Simulate a database/API backend with mutable data
let categories: Category[] = JSON.parse(JSON.stringify(mockCategories));
let services: Service[] = JSON.parse(JSON.stringify(mockServices));

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Category Functions ---

export const getCategories = async (): Promise<Category[]> => {
    await delay(300);
    return JSON.parse(JSON.stringify(categories));
};

export const saveCategory = async (categoryData: Omit<Category, 'id' | 'subCategories'> & { id?: number }): Promise<Category> => {
    await delay(500);
    const isNew = !categoryData.id;
    if (isNew) {
        const newCategory: Category = {
            ...categoryData,
            id: Math.max(...categories.map(c => c.id), 0) + 1,
            subCategories: [],
        };
        categories.push(newCategory);
        return newCategory;
    } else {
        let updatedCategory: Category | undefined;
        categories = categories.map(c => {
            if (c.id === categoryData.id) {
                updatedCategory = { ...c, name: categoryData.name, icon: categoryData.icon };
                return updatedCategory;
            }
            return c;
        });
        if (!updatedCategory) throw new Error("Category not found");
        return updatedCategory;
    }
};

export const deleteCategory = async (categoryId: number): Promise<{ id: number }> => {
    await delay(500);
    const category = categories.find(c => c.id === categoryId);
    if (category && category.subCategories.length > 0) {
        throw new Error('لا يمكن حذف الفئة لأنها تحتوي على فئات فرعية.');
    }
    categories = categories.filter(c => c.id !== categoryId);
    return { id: categoryId };
};

export const reorderCategories = async (reordered: Category[]): Promise<Category[]> => {
    await delay(200);
    categories = reordered;
    return JSON.parse(JSON.stringify(categories));
}

// --- SubCategory Functions ---

export const saveSubCategory = async ({ categoryId, subCategoryData }: { categoryId: number, subCategoryData: Omit<SubCategory, 'id'> & { id?: number } }): Promise<Category> => {
    await delay(500);
    const isNew = !subCategoryData.id;
    let updatedCategory: Category | undefined;
    categories = categories.map(cat => {
        if (cat.id === categoryId) {
            let newSubCategories;
            if (isNew) {
                const newSub: SubCategory = { ...subCategoryData, id: Date.now() };
                newSubCategories = [...cat.subCategories, newSub];
            } else {
                newSubCategories = cat.subCategories.map(sub => sub.id === subCategoryData.id ? { ...sub, name: subCategoryData.name } : sub);
            }
            updatedCategory = { ...cat, subCategories: newSubCategories };
            return updatedCategory;
        }
        return cat;
    });
    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
};

export const deleteSubCategory = async ({ categoryId, subCategoryId }: { categoryId: number, subCategoryId: number }): Promise<{ categoryId: number, subCategoryId: number }> => {
    await delay(500);
    const hasServices = services.some(s => s.subCategoryId === subCategoryId);
    if (hasServices) {
        throw new Error('لا يمكن حذف الفئة الفرعية لأنها تحتوي على خدمات.');
    }
    categories = categories.map(cat => {
        if (cat.id === categoryId) {
            return { ...cat, subCategories: cat.subCategories.filter(sub => sub.id !== subCategoryId) };
        }
        return cat;
    });
    return { categoryId, subCategoryId };
};

export const reorderSubCategories = async ({ categoryId, reorderedSubCategories }: { categoryId: number, reorderedSubCategories: SubCategory[] }): Promise<Category> => {
    await delay(200);
     let updatedCategory: Category | undefined;
    categories = categories.map(cat => {
        if (cat.id === categoryId) {
            updatedCategory = { ...cat, subCategories: reorderedSubCategories };
            return updatedCategory;
        }
        return cat;
    });
    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
}


// --- Service Functions ---

export const getServices = async (): Promise<Service[]> => {
    await delay(400);
    return JSON.parse(JSON.stringify(services));
};

export const getServiceById = async (id: number): Promise<Service | undefined> => {
    await delay(300);
    return JSON.parse(JSON.stringify(services.find(s => s.id === id)));
}

export const saveService = async (serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }): Promise<Service> => {
    await delay(600);
    const isNew = !serviceData.id;
    if (isNew) {
        const newService: Service = {
            id: Math.max(...services.map(s => s.id), 0) + 1,
            ...serviceData,
            rating: 0, reviews: [], isFavorite: false, views: 0,
            creationDate: new Date().toISOString().split('T')[0],
        };
        services.unshift(newService);
        return newService;
    } else {
        let updatedService: Service | undefined;
        services = services.map(s => {
            if (s.id === serviceData.id) {
                updatedService = { ...s, ...serviceData, id: s.id };
                return updatedService;
            }
            return s;
        });
        if (!updatedService) throw new Error("Service not found");
        return updatedService;
    }
};

export const deleteService = async (id: number): Promise<{ id: number }> => {
    await delay(500);
    services = services.filter(s => s.id !== id);
    return { id };
};

export const toggleFavorite = async (serviceId: number): Promise<Service> => {
    await delay(100);
    let updatedService: Service | undefined;
    services = services.map(s => {
        if (s.id === serviceId) {
            updatedService = { ...s, isFavorite: !s.isFavorite };
            return updatedService;
        }
        return s;
    });
    if (!updatedService) throw new Error("Service not found");
    return updatedService;
};


// --- Review Functions ---

export const updateReview = async ({ serviceId, reviewId, newComment }: { serviceId: number, reviewId: number, newComment: string }): Promise<Service> => {
    await delay(400);
    let updatedService: Service | undefined;
    services = services.map(s => {
        if (s.id === serviceId) {
            const reviews = s.reviews.map(r => r.id === reviewId ? { ...r, comment: newComment } : r);
            updatedService = { ...s, reviews };
            return updatedService;
        }
        return s;
    });
    if (!updatedService) throw new Error("Service not found");
    return updatedService;
};

export const deleteReview = async ({ serviceId, reviewId }: { serviceId: number, reviewId: number }): Promise<Service> => {
    await delay(400);
    let updatedService: Service | undefined;
    services = services.map(s => {
        if (s.id === serviceId) {
            const reviews = s.reviews.filter(r => r.id !== reviewId);
            updatedService = { ...s, reviews };
            return updatedService;
        }
        return s;
    });
    if (!updatedService) throw new Error("Service not found");
    return updatedService;
};

export const replyToReview = async ({ serviceId, reviewId, reply }: { serviceId: number, reviewId: number, reply: string }): Promise<Service> => {
    await delay(400);
    let updatedService: Service | undefined;
    services = services.map(s => {
        if (s.id === serviceId) {
            const reviews = s.reviews.map(r => r.id === reviewId ? { ...r, adminReply: reply } : r);
            updatedService = { ...s, reviews };
            return updatedService;
        }
        return s;
    });
    if (!updatedService) throw new Error("Service not found");
    return updatedService;
};