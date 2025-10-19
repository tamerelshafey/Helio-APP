// types.ts
// FIX: Import ReactNode to resolve type error.
import type { ReactNode } from 'react';

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
    views: number;
    reviews: Review[];
    isFavorite: boolean;
    creationDate: string;
    facebookUrl?: string;
    instagramUrl?: string;
    workingHours?: string;
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

export type AdPlacement = 'الرئيسية' | 'المجتمع' | 'الخدمات';

export interface Notification {
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    serviceId?: number;
    imageUrl?: string;
    externalUrl?: string;
}

export interface Ad {
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
    externalUrl?: string;
    referralType?: 'service' | 'property';
    referralId?: number;
    placement: AdPlacement;
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
    day: string;
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


// Marketplace Types
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
    jobType: 'دوام كامل' | 'دوام جزئي' | 'عن بعد' | 'مؤقت';
    description: string;
    contactInfo: string;
    status: MarketplaceItemStatus;
    creationDate: string;
    approvalDate?: string;
    expiryDate?: string;
}

export type LostFoundStatus = 'lost' | 'found' | 'returned';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface LostAndFoundItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    date: string;
    reporterName: string;
    reporterContact: string;
    status: LostFoundStatus;
    imageUrl?: string;
    moderationStatus: ModerationStatus;
}


// Community Types
export type DiscussionCircleCategory = 'عام' | 'أحياء سكنية' | 'كمبوندات';

export interface DiscussionCircle {
    id: number;
    name: string;
    description: string;
    category: DiscussionCircleCategory;
}

export interface CommunityCommentReport {
    reporterId: number;
    reason: string;
    timestamp: string;
}

export interface CommunityComment {
    id: number;
    authorId: number;
    content: string;
    timestamp: string;
    reports?: CommunityCommentReport[];
}

export interface CommunityPostReport {
    reporterId: number;
    reason: string;
    timestamp: string;
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
    reports?: CommunityPostReport[];
}


// Public Pages Content Types
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
    content: string;
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

export interface AuditLog {
    id: number;
    timestamp: string;
    user: string;
    action: string;
    details: string;
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

export interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    link: string;
    icon: ReactNode;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

// Context Types
export interface AppContextType {
    emergencyContacts: EmergencyContact[];
    serviceGuides: ServiceGuide[];
    auditLogs: AuditLog[];
    publicPagesContent: PublicPagesContent;
    lostAndFoundItems: LostAndFoundItem[];
    logActivity: (action: string, details: string) => void;
    handleSaveEmergencyContact: (contactData: Omit<EmergencyContact, 'id' | 'type'> & { id?: number }, newContactType?: 'city' | 'national') => void;
    handleDeleteEmergencyContact: (id: number) => void;
    handleSaveServiceGuide: (guideData: Omit<ServiceGuide, 'id'> & { id?: number }) => void;
    handleDeleteServiceGuide: (id: number) => void;
    handleUpdatePublicPageContent: <K extends keyof PublicPagesContent>(page: K, newContent: PublicPagesContent[K]) => void;
    handleSaveLostAndFoundItem: (itemData: Omit<LostAndFoundItem, 'id'> & { id?: number }) => void;
    handleDeleteLostAndFoundItem: (id: number) => void;
    handleApproveLostAndFoundItem: (id: number) => void;
    handleRejectLostAndFoundItem: (id: number) => void;
}

export interface AuthContextType {
    currentUser: AdminUser | null;
    isAuthenticated: boolean;
    login: (user: AdminUser) => void;
    logout: () => void;
}

export interface UIContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    toasts: ToastMessage[];
    showToast: (message: string, type?: 'success' | 'error') => void;
    dismissToast: (id: number) => void;
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

export interface MarketplaceContextType {
    forSaleItems: ForSaleItem[];
    jobs: JobPosting[];
    handleApproveItem: (type: 'sale' | 'job', id: number) => void;
    handleRejectItem: (type: 'sale' | 'job', id: number) => void;
    handleDeleteItem: (type: 'sale' | 'job', id: number) => void;
}

export interface CommunityContextType {
    communityPosts: CommunityPost[];
    discussionCircles: DiscussionCircle[];
    handleSavePost: (postData: Omit<CommunityPost, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'reports'> & { id?: number }) => void;
    handleUpdatePost: (updatedPost: CommunityPost) => void;
    handleDeletePost: (id: number) => void;
    handleUpdateComment: (postId: number, commentId: number, newContent: string) => void;
    handleDeleteComment: (postId: number, commentId: number) => void;
    handleSaveCircle: (circleData: Omit<DiscussionCircle, 'id'> & { id?: number }) => void;
    handleDeleteCircle: (id: number) => void;
    handleDismissPostReports: (postId: number) => void;
    handleDismissCommentReports: (postId: number, commentId: number) => void;
}
