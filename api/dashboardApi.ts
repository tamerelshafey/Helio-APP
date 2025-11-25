import { 
    mockUsers, mockCommunityPosts, mockServices
} from '../data/mock-data';
import { getProperties } from './propertiesApi';
import { getNews, getNotifications } from './contentApi';
import type { Activity, Alert, AppUser } from '../types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDashboardStats = async () => {
    await delay(800);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const properties = await getProperties();
    const news = await getNews();
    const notifications = await getNotifications();

    const newServicesCount = mockServices.filter(s => new Date(s.creationDate) >= thirtyDaysAgo).length;
    const newPropertiesCount = properties.filter(p => new Date(p.creationDate) >= thirtyDaysAgo).length;
    const newUsersCount = mockUsers.filter(u => new Date(u.joinDate) >= thirtyDaysAgo).length;
    const newNewsAndNotifsCount = news.filter(n => new Date(n.date) >= thirtyDaysAgo).length + notifications.filter(n => new Date(n.startDate) >= thirtyDaysAgo).length;
    const newPostsCount = mockCommunityPosts.filter(p => new Date(p.timestamp) >= thirtyDaysAgo).length;

    return {
        services: {
            total: mockServices.length,
            newLast30Days: newServicesCount,
        },
        properties: {
            total: properties.length,
            newLast30Days: newPropertiesCount,
        },
        users: {
            total: mockUsers.length,
            newLast30Days: newUsersCount,
        },
        community: {
            total: mockCommunityPosts.length,
            newLast30Days: newPostsCount,
        },
        content: {
            total: news.length + notifications.length,
            newLast30Days: newNewsAndNotifsCount,
        }
    };
};

export const getUserGrowth = async () => {
    await delay(1000);
    // Returning mock data as there is no historical data
    return [
      { name: 'يناير', "مستخدمين جدد": 150, "إجمالي المستخدمين": 150 },
      { name: 'فبراير', "مستخدمين جدد": 120, "إجمالي المستخدمين": 270 },
      { name: 'مارس', "مستخدمين جدد": 200, "إجمالي المستخدمين": 470 },
      { name: 'أبريل', "مستخدمين جدد": 110, "إجمالي المستخدمين": 580 },
      { name: 'مايو', "مستخدمين جدد": 90, "إجمالي المستخدمين": 670 },
      { name: 'يونيو', "مستخدمين جدد": 100, "إجمالي المستخدمين": 770 },
      { name: 'يوليو', "مستخدمين جدد": 80, "إجمالي المستخدمين": 850 },
    ];
};

export const getRecentActivities = async (): Promise<Activity[]> => {
    await delay(1200);
    
    // Simulate a network error for demonstration purposes
    // throw new Error('Failed to load recent activities.');
    const properties = await getProperties();
    const news = await getNews();

    const serviceActivities: Activity[] = mockServices.map(s => ({
        id: `s-${s.id}`, type: 'NEW_SERVICE', description: `تمت إضافة خدمة جديدة: ${s.name}`, time: s.creationDate,
    }));
    
    const propertyActivities: Activity[] = properties.map(p => ({
        id: `p-${p.id}`, type: 'NEW_PROPERTY', description: `تمت إضافة عقار جديد: ${p.title}`, time: p.creationDate,
    }));

    const newsActivities: Activity[] = news.map(n => ({
        id: `n-${n.id}`, type: 'NEWS_PUBLISHED', description: `تم نشر خبر جديد: ${n.title}`, time: n.date,
    }));

    return [...serviceActivities, ...propertyActivities, ...newsActivities]
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
};

export const getAlerts = async (): Promise<Alert[]> => {
    await delay(1400);

    const properties = await getProperties();
    const sortedUsers = [...mockUsers].sort((a,b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
    const sortedProperties = [...properties].sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

    const userAlerts: Alert[] = sortedUsers.slice(0, 2).map(user => ({
        id: `user-${user.id}`,
        message: `مستخدم جديد انضم: ${user.name}`,
        time: user.joinDate,
        type: 'user_registered',
    }));
    
    const propertyAlerts: Alert[] = sortedProperties.slice(0,1).map(prop => ({
        id: `prop-${prop.id}`,
        message: `تمت إضافة عقار جديد: ${prop.title}`,
        time: prop.creationDate,
        type: 'property_listed',
    }));

    return [...userAlerts, ...propertyAlerts].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
};


export const getPendingUsers = async (): Promise<AppUser[]> => {
    await delay(500);
    return mockUsers.filter(u => u.status === 'pending');
};