// types.ts
import React from 'react';

export type AdminUserRole = 'مدير عام' | 'مسؤول ادارة الخدمات' | 'مسؤول العقارات' | 'مسؤول المحتوى' | 'مسؤول النقل' | 'مسؤول المجتمع';

export interface AdminUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    roles: AdminUserRole[];
}

export type UserStatus = 'active' | 'pending' | 'banned';

export interface AppUser {
    id: number;
    name: string;
    email: string;
    avatar: string;
    joinDate: string;
    status: UserStatus;
}

export interface Review {
    id: number;
    username: string;
    avatar: string;
    rating: number;
    comment: string;
    date: string;
    adminReply?: string;
}

export interface Service {
    id: number;
    subCategoryId: number;
    name: string;
    address: string;
    phone: string;
    phone2?: string;
    whatsapp: string;
    images: string[];
    about: string;
    rating: number;
    reviews: Review[];
    isFavorite: boolean;
    views: number;
    creationDate: string;
    facebookUrl?: string;
    instagramUrl?: string;
    workingHours?: string;
}

export interface SubCategory {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    subCategories: SubCategory[];
}

export interface EmergencyContact {
    id: number;
    title: string;
    number: string;
    type: 'national' | 'city';
}

export interface ServiceGuide {
    id: number;
    title: string;
    steps: string[];
    documents: string[];
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf';
}

export interface News {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    date: string;
    author: string;
    views: number;
    externalUrl?: string;
}

export interface Notification {
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    externalUrl?: string;
    serviceId?: number;
}

export type AdPlacement = 'الرئيسية' | 'المجتمع' | 'الخدمات';

export interface Ad {
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    placement: AdPlacement;
    imageUrl?: string;
    externalUrl?: string;
    referralType?: 'service' | 'property';
    referralId?: number;
}

export interface Property {
    id: number;
    title: string;
    description: string;
    images: string[];
    type: 'sale' | 'rent';
    price: number;
    location: {
        address: string;
    };
    contact: {
        name: string;
        phone: string;
    };
    amenities: string[];
    views: number;
    creationDate: string;
}

export interface Activity {
    id: string;
    type: 'NEW_SERVICE' | 'EMERGENCY_REPORT' | 'NEWS_PUBLISHED' | 'NEW_PROPERTY';
    description: string;
    time: string;
}

export interface Alert {
    id: string;
    type: 'new_inquiry' | 'user_registered' | 'property_listed';
    message: string;
    time: string;
}

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface Report {
    reporterId: number;
    reason: 'spam' | 'inappropriate' | 'harassment' | 'other';
    timestamp: string;
}

export interface CommunityComment {
    id: number;
    authorId: number;
    content: string;
    timestamp: string;
    reports?: Report[];
}

export type DiscussionCircleCategory = 'عام' | 'أحياء سكنية' | 'كمبوندات';

export interface DiscussionCircle {
    id: number;
    name: string;
    description: string;
    category: DiscussionCircleCategory;
}

export interface CommunityPost {
    id: number;
    circleId: number;
    authorId: number;
    content: string;
    imageUrl?: string;
    timestamp: string;
    likes: number;
    comments: CommunityComment[];
    reports?: Report[];
}


export type MarketplaceItemStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface ForSaleItem {
    id: number;
    authorId: number;
    title: string;
    description: string;
    category: string;
    price: number;
    images: string[];
    contactName: string;
    contactPhone: string;
    status: MarketplaceItemStatus;
    creationDate: string;
    approvalDate?: string;
    expiryDate?: string;
}

export interface JobPosting {
    id: number;
    authorId: number;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    description: string;
    contactInfo: string;
    status: MarketplaceItemStatus;
    creationDate: string;
    approvalDate?: string;
    expiryDate?: string;
}

export type LostFoundStatus = 'lost' | 'found' | 'returned';

export interface LostAndFoundItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    date: string;
    reporterName: string;
    reporterContact: string;
    imageUrl?: string;
    status: LostFoundStatus;
}


// Public Content Types
export interface HomePageContent {
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroSubtitle: string;
    featuresSectionTitle: string;
    featuresSectionSubtitle: string;
    features: { title: string; description: string }[];
    infoLinksSectionTitle: string;
}

export interface AboutPageContent {
    title: string;
    intro: string;
    vision: { title: string; text: string };
    mission: { title: string; text: string };
}

export interface FaqItem {
    q: string;
    a: string;
}
export interface FaqCategory {
    category: string;
    items: FaqItem[];
}
export interface FaqPageContent {
    title: string;
    subtitle: string;
    categories: FaqCategory[];
}

export interface PolicySection {
    title: string;
    content: (string | { list: string[] })[];
}
export interface PolicyPageContent {
    title: string;
    lastUpdated: string;
    sections: PolicySection[];
}
export interface PublicPagesContent {
    home: HomePageContent;
    about: AboutPageContent;
    faq: FaqPageContent;
    privacy: PolicyPageContent;
    terms: PolicyPageContent;
}

export interface SearchResult {
    id: string;
    type: 'خدمة' | 'عقار' | 'خبر' | 'مستخدم';
    title: string;
    subtitle?: string;
    link: string;
    icon: React.ReactNode;
}


// Transportation Types
export interface Supervisor {
    name: string;
    phone: string;
}

export interface Driver {
    id: number;
    name: string;
    phone: string;
    avatar: string;
}

export interface ScheduleDriver {
    name: string;
    phone: string;
}
export interface WeeklyScheduleItem {
    day: string; // e.g., 'الأحد'
    drivers: ScheduleDriver[];
}

export interface ExternalRoute {
    id: number;
    name: string;
    timings: string[];
    waitingPoint: string;
}
export interface ScheduleOverride {
    date: string; // YYYY-MM-DD
    drivers: ScheduleDriver[];
}

// Context Types
export interface AuthContextType {
    currentUser: AdminUser | null;
    isAuthenticated: boolean;
    login: (user: AdminUser) => void;
    logout: () => void;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export interface UIContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    toasts: ToastMessage[];
    showToast: (message: string, type?: 'success' | 'error') => void;
    dismissToast: (id: number) => void;
}

export interface AppContextType {
    emergencyContacts: EmergencyContact[];
    handleSaveEmergencyContact: (contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }, newContactType?: 'city' | 'national') => void;
    handleDeleteEmergencyContact: (id: number) => void;
    serviceGuides: ServiceGuide[];
    handleSaveServiceGuide: (guideData: Omit<ServiceGuide, 'id'> & { id?: number }) => void;
    handleDeleteServiceGuide: (id: number) => void;
    auditLogs: AuditLog[];
    logActivity: (action: string, details: string) => void;
    publicPagesContent: PublicPagesContent;
    handleUpdatePublicPageContent: <K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => void;
    lostAndFoundItems: LostAndFoundItem[];
    handleSaveLostAndFoundItem: (itemData: Omit<LostAndFoundItem, 'id'> & { id?: number }) => void;
    handleDeleteLostAndFoundItem: (id: number) => void;
}

export interface ServicesContextType {
    categories: Category[];
    services: Service[];
    handleUpdateReview: (serviceId: number, reviewId: number, newComment: string) => void;
    handleDeleteReview: (serviceId: number, reviewId: number) => void;
    handleReplyToReview: (serviceId: number, reviewId: number, reply: string) => void;
    handleSaveService: (serviceData: Omit<Service, 'id' | 'rating' | 'reviews' | 'isFavorite' | 'views' | 'creationDate'> & { id?: number }) => void;
    handleDeleteService: (id: number) => void;
    handleToggleFavorite: (serviceId: number) => void;
    handleSaveCategory: (categoryData: Omit<Category, 'id' | 'subCategories'> & { id?: number }) => void;
    handleDeleteCategory: (categoryId: number) => void;
    handleSaveSubCategory: (categoryId: number, subCategoryData: Omit<SubCategory, 'id'> & { id?: number }) => void;
    handleDeleteSubCategory: (categoryId: number, subCategoryId: number) => void;
    handleReorderCategories: (reorderedCategories: Category[]) => void;
    handleReorderSubCategories: (categoryId: number, reorderedSubCategories: SubCategory[]) => void;
}

export interface PropertiesContextType {
    properties: Property[];
    handleSaveProperty: (property: Omit<Property, 'id' | 'views' | 'creationDate'> & { id?: number }) => void;
    handleDeleteProperty: (id: number) => void;
}

export interface ContentContextType {
    news: News[];
    notifications: Notification[];
    ads: Ad[];
    handleSaveNews: (newsItem: Omit<News, 'id' | 'date' | 'author' | 'views'> & { id?: number }) => void;
    handleDeleteNews: (id: number) => void;
    handleSaveNotification: (notification: Omit<Notification, 'id'> & { id?: number }) => void;
    handleDeleteNotification: (id: number) => void;
    handleSaveAd: (ad: Omit<Ad, 'id'> & { id?: number }) => void;
    handleDeleteAd: (id: number) => void;
}

export interface UserManagementContextType {
    users: AppUser[];
    admins: AdminUser[];
    handleSaveUser: (userData: Omit<AppUser, 'id' | 'joinDate'> & { id?: number }) => void;
    handleDeleteUser: (id: number) => void;
    handleDeleteUsers: (ids: number[]) => void;
    handleSaveAdmin: (adminData: Omit<AdminUser, 'id'> & { id?: number }) => void;
    handleDeleteAdmin: (id: number) => void;
}

export interface TransportationContextType {
    transportation: {
        internalSupervisor: Supervisor;
        externalSupervisor: Supervisor;
        internalDrivers: Driver[];
        weeklySchedule: WeeklyScheduleItem[];
        externalRoutes: ExternalRoute[];
        scheduleOverrides: ScheduleOverride[];
    };
    handleSaveDriver: (driverData: Omit<Driver, 'id'> & { id?: number }) => void;
    handleDeleteDriver: (id: number) => void;
    handleSaveRoute: (routeData: Omit<ExternalRoute, 'id'> & { id?: number }) => void;
    handleDeleteRoute: (id: number) => void;
    handleSaveSchedule: (schedule: WeeklyScheduleItem[]) => void;
    handleSaveSupervisor: (type: 'internal' | 'external', supervisor: Supervisor) => void;
    handleSaveOverride: (override: ScheduleOverride) => void;
    handleResetOverride: (date: string) => void;
}

export interface CommunityContextType {
    communityPosts: CommunityPost[];
    discussionCircles: DiscussionCircle[];
    handleSavePost: (post: Omit<CommunityPost, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'reports'> & { id?: number }) => void;
    handleUpdatePost: (post: CommunityPost) => void;
    handleDeletePost: (id: number) => void;
    handleDeleteComment: (postId: number, commentId: number) => void;
    handleUpdateComment: (postId: number, commentId: number, newContent: string) => void;
    handleSaveCircle: (circle: Omit<DiscussionCircle, 'id'> & { id?: number }) => void;
    handleDeleteCircle: (circleId: number) => void;
    handleDismissPostReports: (postId: number) => void;
    handleDismissCommentReports: (postId: number, commentId: number) => void;
}


export interface MarketplaceContextType {
    forSaleItems: ForSaleItem[];
    jobs: JobPosting[];
    handleApproveItem: (type: 'sale' | 'job', id: number, expiryDays: number) => void;
    handleRejectItem: (type: 'sale' | 'job', id: number) => void;
    handleDeleteItem: (type: 'sale' | 'job', id: number) => void;
}
