import React from 'react';

// =========
// Enums & String Unions
// =========
export type UserStatus = 'active' | 'pending' | 'banned';
export type UserAccountType = 'user' | 'service_provider';
export type MarketplaceItemStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type LostFoundStatus = 'lost' | 'found' | 'returned';
export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type AdminUserRole = 'مدير عام' | 'مسؤول ادارة الخدمات' | 'مسؤول العقارات' | 'مسؤول المحتوى' | 'مسؤول النقل' | 'مسؤول المجتمع';
export type ActivityType = 'NEW_SERVICE' | 'EMERGENCY_REPORT' | 'NEWS_PUBLISHED' | 'NEW_PROPERTY';
export type AlertType = 'new_inquiry' | 'user_registered' | 'property_listed';
export type AdPlacement = 'الرئيسية' | 'المجتمع' | 'الخدمات' | 'العقارات' | 'الأخبار';
export type DiscussionCircleCategory = 'عام' | 'أحياء سكنية' | 'كمبوندات';

export const AdminRoles = {
  SUPER_ADMIN: 'مدير عام',
  SERVICES_ADMIN: 'مسؤول ادارة الخدمات',
  PROPERTY_ADMIN: 'مسؤول العقارات',
  CONTENT_ADMIN: 'مسؤول المحتوى',
  TRANSPORT_ADMIN: 'مسؤول النقل',
  COMMUNITY_ADMIN: 'مسؤول المجتمع',
} as const;

// =========
// Basic Data Models
// =========

export interface AppUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  status: UserStatus;
  joinDate: string;
  accountType: UserAccountType;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  avatar: string;
  roles: AdminUserRole[];
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
  date: string;
  rating: number;
  comment: string;
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
  about: string;
  images: string[];
  rating: number;
  reviews: Review[];
  isFavorite: boolean;
  views: number;
  creationDate: string;
  facebookUrl?: string;
  instagramUrl?: string;
  workingHours?: string;
  providerId?: number;
}

export interface Property {
    id: number;
    title: string;
    description: string;
    images: string[];
    location: { address: string; lat?: number; lng?: number };
    type: 'sale' | 'rent';
    price: number;
    contact: { name: string; phone: string; };
    amenities: string[];
    views: number;
    creationDate: string;
    expiryDate?: string;
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
    imageUrl?: string;
    externalUrl?: string;
    serviceId?: number;
    startDate: string;
    endDate: string;
}

export interface Ad {
    id: number;
    title: string;
    content: string;
    imageUrl?: string;
    externalUrl?: string;
    startDate: string;
    endDate: string;
    placements: AdPlacement[];
    referralType?: 'service' | 'property';
    referralId?: number;
}

export interface EmergencyContact {
    id: number;
    title: string;
    number: string;
    type: 'city' | 'national';
}

export interface ServiceGuide {
    id: number;
    title: string;
    steps: string[];
    documents: string[];
    attachmentUrl?: string;
    attachmentType?: 'image' | 'pdf';
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
    type: ActivityType;
    description: string;
    time: string;
}

export interface Alert {
    id: string;
    message: string;
    time: string;
    type: AlertType;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface SearchResult {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    link: string;
    icon: React.ReactNode;
}

// =========
// Transportation Models
// =========

export interface ScheduleDriver {
    name: string;
    phone: string;
}

export interface Driver {
    id: number;
    name: string;
    phone: string;
    avatar: string;
}

export interface Supervisor {
    name: string;
    phone: string;
}

export interface WeeklyScheduleItem {
    day: string;
    drivers: ScheduleDriver[];
}

export interface ScheduleOverride {
    date: string; // YYYY-MM-DD
    drivers: ScheduleDriver[];
}

export interface ExternalRoute {
    id: number;
    name: string;
    timings: string[];
    waitingPoint: string;
}

export interface InternalRoute {
    id: number;
    name: string;
    stops: string[];
    timings: string[];
}

// =========
// Community & Marketplace Models
// =========

export interface CommunityComment {
    id: number;
    authorId: number;
    timestamp: string;
    content: string;
    reports?: { userId: number, reason: string }[];
}

export interface CommunityPost {
    id: number;
    authorId: number;
    circleId: number;
    timestamp: string;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: CommunityComment[];
    reports?: { userId: number, reason: string }[];
}

export interface DiscussionCircle {
    id: number;
    name: string;
    description: string;
    category: DiscussionCircleCategory;
}

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

export interface LostAndFoundItem {
    id: number;
    itemName: string;
    description: string;
    location: string;
    date: string;
    reporterName: string;
    reporterContact: string;
    status: LostFoundStatus;
    moderationStatus: ModerationStatus;
    imageUrl?: string;
}

// =========
// Public Content Models
// =========

export interface HomePageContent {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  featuresSectionTitle: string;
  featuresSectionSubtitle: string;
  features: { icon: string; title: string; description: string; }[];
  infoLinksSectionTitle: string;
}

export interface AboutPageContent {
  title: string;
  intro: string;
  vision: { title: string; text: string; };
  mission: { title: string; text: string; };
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

// =========
// Offers Models
// =========

export interface Offer {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  serviceId: number;
  startDate: string;
  endDate: string;
  terms: string;
  providerId?: number;
}

export interface OfferCode {
  id: number;
  offerId: number;
  userId: number;
  code: string;
  isRedeemed: boolean;
  issueDate: string;
}

// =========
// Context Types
// =========
export type SortDirection = 'ascending' | 'descending';
export type SortConfig<T> = { key: keyof T; direction: SortDirection } | null;


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
    handleSaveLostAndFoundItem: (itemData: Omit<LostAndFoundItem, 'id' | 'moderationStatus'> & { id?: number }) => void;
    handleDeleteLostAndFoundItem: (id: number) => void;
    handleApproveLostAndFoundItem: (id: number) => void;
    handleRejectLostAndFoundItem: (id: number) => void;
    googlePlayUrl: string;
    appleAppStoreUrl: string;
    handleUpdateAppLinks: (links: { googlePlayUrl: string; appleAppStoreUrl: string; }) => void;
}

// FIX: Add missing context type definitions
export interface TransportationContextType {
    transportation: {
        internalSupervisor: Supervisor;
        externalSupervisor: Supervisor;
        internalDrivers: Driver[];
        internalRoutes: InternalRoute[];
        weeklySchedule: WeeklyScheduleItem[];
        externalRoutes: ExternalRoute[];
        scheduleOverrides: ScheduleOverride[];
    };
    handleSaveDriver: (driverData: Omit<Driver, 'id'> & { id?: number }) => void;
    handleDeleteDriver: (id: number) => void;
    handleSaveInternalRoute: (routeData: Omit<InternalRoute, 'id'> & { id?: number }) => void;
    handleDeleteInternalRoute: (id: number) => void;
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
    handleSavePost: (postData: Omit<CommunityPost, 'id' | 'authorId' | 'timestamp' | 'likes' | 'comments' | 'reports'> & { id?: number }) => void;
    handleUpdatePost: (updatedPost: CommunityPost) => void;
    handleDeletePost: (id: number) => void;
    handleDeleteComment: (postId: number, commentId: number) => void;
    handleUpdateComment: (postId: number, commentId: number, newContent: string) => void;
    handleSaveCircle: (circleData: Omit<DiscussionCircle, 'id'> & { id?: number }) => void;
    handleDeleteCircle: (circleId: number) => void;
    handleDismissPostReports: (postId: number) => void;
    handleDismissCommentReports: (postId: number, commentId: number) => void;
}

export interface MarketplaceContextType {
    forSaleItems: ForSaleItem[];
    jobs: JobPosting[];
    handleApproveItem: (type: 'sale' | 'job', id: number) => void;
    handleRejectItem: (type: 'sale' | 'job', id: number) => void;
    handleDeleteItem: (type: 'sale' | 'job', id: number) => void;
}

export interface OffersContextType {
    offers: Offer[];
    offerCodes: OfferCode[];
    handleSaveOffer: (offerData: Omit<Offer, 'id'> & { id?: number }) => void;
    handleDeleteOffer: (offerId: number) => void;
    handleGenerateCode: (offerId: number, userId: number) => void;
    handleDeleteCode: (codeId: number) => void;
    handleToggleCodeRedemption: (codeId: number) => void;
}
