
import type { 
    AppUser, AdminUser, Category, Service, Property, News, Notification, Ad, 
    EmergencyContact, ServiceGuide, PublicPagesContent, LostAndFoundItem, Driver, 
    Supervisor, WeeklyScheduleItem, ExternalRoute, ScheduleOverride, DiscussionCircle, 
    CommunityPost, ForSaleItem, JobPosting, Offer, OfferCode
} from '../types';

// Please note: Image URLs are placeholders from picsum.photos for demonstration.

export const mockUsers: AppUser[] = [
    { id: 1, name: 'أحمد محمود', email: 'ahmad.m@example.com', avatar: 'https://picsum.photos/200/200?random=1', status: 'active', joinDate: '2023-01-15', accountType: 'user' },
    { id: 2, name: 'فاطمة علي', email: 'fatima.a@example.com', avatar: 'https://picsum.photos/200/200?random=2', status: 'active', joinDate: '2023-02-20', accountType: 'user' },
    { id: 3, name: 'يوسف خالد', email: 'youssef.k@example.com', avatar: 'https://picsum.photos/200/200?random=3', status: 'pending', joinDate: '2023-03-10', accountType: 'user' },
    { id: 4, name: 'سارة إبراهيم', email: 'sara.i@example.com', avatar: 'https://picsum.photos/200/200?random=4', status: 'banned', joinDate: '2023-03-12', accountType: 'user' },
    { id: 5, name: 'مركز خدمة ABC', email: 'abc.service@example.com', avatar: 'https://picsum.photos/200/200?random=5', status: 'active', joinDate: '2023-04-01', accountType: 'service_provider' },
    { id: 6, name: 'مطعم XYZ', email: 'xyz.rest@example.com', avatar: 'https://picsum.photos/200/200?random=6', status: 'active', joinDate: '2023-04-05', accountType: 'service_provider' }
];

export const mockAdmins: AdminUser[] = [
    { id: 101, name: 'مدير النظام', email: 'super@admin.com', avatar: 'https://picsum.photos/200/200?random=101', roles: ['مدير عام'] },
    { id: 102, name: 'مسؤول الخدمات', email: 'services@admin.com', avatar: 'https://picsum.photos/200/200?random=102', roles: ['مسؤول ادارة الخدمات'] },
    { id: 103, name: 'مسؤول العقارات', email: 'props@admin.com', avatar: 'https://picsum.photos/200/200?random=103', roles: ['مسؤول العقارات'] },
    { id: 104, name: 'مسؤول المحتوى', email: 'content@admin.com', avatar: 'https://picsum.photos/200/200?random=104', roles: ['مسؤول المحتوى'] },
    { id: 105, name: 'مسؤول النقل', email: 'transport@admin.com', avatar: 'https://picsum.photos/200/200?random=105', roles: ['مسؤول النقل'] },
    { id: 106, name: 'مسؤول المجتمع', email: 'community@admin.com', avatar: 'https://picsum.photos/200/200?random=106', roles: ['مسؤول المجتمع'] },
];

export const mockCategories: Category[] = [
    { id: 1, name: 'مطاعم ومقاهي', icon: 'CakeIcon', subCategories: [{ id: 101, name: 'مطاعم' }, { id: 102, name: 'مقاهي' }] },
    { id: 2, name: 'تسوق', icon: 'ShoppingBagIcon', subCategories: [{ id: 201, name: 'سوبر ماركت' }, { id: 202, name: 'محلات ملابس' }] },
    { id: 3, name: 'خدمات منزلية', icon: 'WrenchScrewdriverIcon', subCategories: [{ id: 301, name: 'سباكة' }, { id: 302, name: 'كهرباء' }] },
    { id: 4, name: 'المدينة والجهاز', icon: 'BuildingLibraryIcon', subCategories: [{ id: 401, name: 'مكتب بريد' }] }
];

export const mockServices: Service[] = [
    { id: 1, subCategoryId: 101, name: 'مطعم المأكولات الشرقية', address: 'شارع 1، بجوار المول', phone: '01012345678', whatsapp: '201012345678', about: 'أشهى المأكولات...', images: ['https://picsum.photos/600/400?random=11'], rating: 4.5, reviews: [{ id: 1, username: 'أحمد محمود', avatar: 'https://picsum.photos/200/200?random=1', date: '2023-05-10', rating: 5, comment: 'طعام رائع!' }], isFavorite: true, views: 1500, creationDate: '2023-01-20', providerId: 6 },
    { id: 2, subCategoryId: 201, name: 'سوبر ماركت المدينة', address: 'الحي الأول', phone: '01187654321', whatsapp: '201187654321', about: 'كل احتياجاتك...', images: ['https://picsum.photos/600/400?random=12'], rating: 4.0, reviews: [], isFavorite: false, views: 800, creationDate: '2023-02-10' },
    { id: 3, subCategoryId: 301, name: 'سباك محترف', address: 'خدمة منزلية', phone: '01211223344', whatsapp: '201211223344', about: 'إصلاح جميع...', images: ['https://picsum.photos/600/400?random=13'], rating: 5.0, reviews: [], isFavorite: false, views: 350, creationDate: '2023-04-15', providerId: 5 }
];

export const mockProperties: Property[] = [
    { id: 1, title: 'شقة للبيع 150م', description: 'شقة 3 غرف نوم...', images: ['https://picsum.photos/600/400?random=21'], location: { address: 'الحي الأول' }, type: 'sale', price: 1200000, contact: { name: 'المالك', phone: '010...'}, amenities: ['أسانسير', 'جراج'], views: 2500, creationDate: '2023-03-01' },
    { id: 2, title: 'فيلا للإيجار', description: 'فيلا بحديقة خاصة...', images: ['https://picsum.photos/600/400?random=22'], location: { address: 'كمبوند XYZ' }, type: 'rent', price: 15000, contact: { name: 'مكتب تسويق', phone: '011...'}, amenities: ['حمام سباحة', 'أمن 24 ساعة'], views: 1800, creationDate: '2023-04-20' }
];

export const mockNews: News[] = [
    { id: 1, title: 'افتتاح حديقة جديدة في المدينة', content: 'تم افتتاح حديقة مركزية...', imageUrl: 'https://picsum.photos/600/400?random=31', date: '2023-05-01', author: 'إدارة المدينة', views: 5200 },
    { id: 2, title: 'بدء أعمال تطوير الطريق الرئيسي', content: 'أعلن جهاز المدينة...', imageUrl: 'https://picsum.photos/600/400?random=32', date: '2023-04-25', author: 'إدارة المدينة', views: 3100, externalUrl: 'https://www.example.com' }
];

export const mockNotifications: Notification[] = [
    { id: 1, title: 'قطع المياه غداً للصيانة', content: 'سيتم قطع المياه...', startDate: '2023-06-10', endDate: '2023-06-10' },
    { id: 2, title: 'خصم 20% في مطعم المأكولات الشرقية', content: 'استمتع بخصم...', serviceId: 1, startDate: '2023-06-01', endDate: '2023-06-15', imageUrl: 'https://picsum.photos/600/400?random=41' }
];

export const mockAds: Ad[] = [
    { id: 1, title: 'إعلان ممول 1', content: 'تفاصيل الإعلان...', placement: 'الرئيسية', startDate: '2023-06-01', endDate: '2023-06-30' },
    { id: 2, title: 'إعلان ممول 2', content: 'تفاصيل الإعلان...', placement: 'الخدمات', referralType: 'service', referralId: 1, startDate: '2023-06-05', endDate: '2023-06-20' }
];

export const mockEmergencyContacts: EmergencyContact[] = [
    { id: 1, title: 'طوارئ الكهرباء', number: '121', type: 'national' },
    { id: 2, title: 'طوارئ الغاز', number: '129', type: 'national' },
    { id: 3, title: 'قسم شرطة المدينة', number: '0226543210', type: 'city' }
];

export const mockServiceGuides: ServiceGuide[] = [
    { id: 1, title: 'استخراج رخصة بناء', steps: ['تقديم طلب', 'معاينة', 'دفع رسوم'], documents: ['صورة بطاقة', 'سند ملكية'] }
];

export const mockLostAndFoundItems: LostAndFoundItem[] = [
    { id: 1, itemName: 'محفظة سوداء', description: 'بها بطاقة هوية...', location: 'المول', date: '2023-05-20', reporterName: 'فاعل خير', reporterContact: '010...', status: 'found', moderationStatus: 'approved', imageUrl: 'https://picsum.photos/600/400?random=51' },
    { id: 2, itemName: 'مفاتيح سيارة', description: 'مفاتيح ماركة...', location: 'النادي', date: '2023-05-18', reporterName: 'أحمد محمود', reporterContact: '011...', status: 'lost', moderationStatus: 'approved' },
    { id: 3, itemName: 'هاتف محمول', description: 'هاتف أيفون أزرق', location: 'باص المدينة', date: '2023-06-01', reporterName: 'سائق الباص', reporterContact: '012...', status: 'found', moderationStatus: 'pending' },
];

export const mockPublicPagesContent: PublicPagesContent = {
    home: { heroTitleLine1: 'مدينتك...', heroTitleLine2: 'في تطبيق واحد', heroSubtitle: 'دليلك الشامل لمدينة هليوبوليس الجديدة.', featuresSectionTitle: 'اكتشف', featuresSectionSubtitle: 'كل ما تحتاجه في مكان واحد', features: [{icon:'', title:'دليل الخدمات', description:''}], infoLinksSectionTitle: 'روابط هامة' },
    about: { title: 'عن هيليو', intro: 'تطبيق هيليو...', vision: { title: 'رؤيتنا', text: '...' }, mission: { title: 'مهمتنا', text: '...' } },
    faq: { title: 'الأسئلة الشائعة', subtitle: 'تجد هنا إجابات...', categories: [{ category: 'عام', items: [{ q: 'ما هو تطبيق هيليو؟', a: 'هو تطبيق...' }] }] },
    privacy: { title: 'سياسة الخصوصية', lastUpdated: '1 يونيو 2023', sections: [{ title: 'جمع البيانات', content: '<p>نقوم بجمع...</p>' }] },
    terms: { title: 'شروط الاستخدام', lastUpdated: '1 يونيو 2023', sections: [{ title: 'قبول الشروط', content: '<p>باستخدامك للتطبيق...</p>' }] }
};

export const mockInternalSupervisor: Supervisor = { name: 'مشرف داخلي', phone: '01098765432' };
export const mockExternalSupervisor: Supervisor = { name: 'مشرف خارجي', phone: '01123456789' };
export const mockInternalDrivers: Driver[] = [
    { id: 1, name: 'سائق 1', phone: '01234567890', avatar: 'https://picsum.photos/200/200?random=201' },
    { id: 2, name: 'سائق 2', phone: '01234567891', avatar: 'https://picsum.photos/200/200?random=202' }
];
export const mockWeeklySchedule: WeeklyScheduleItem[] = [
    { day: 'الجمعة', drivers: [{ name: 'سائق 1', phone: '01234567890' }] },
    { day: 'السبت', drivers: [{ name: 'سائق 2', phone: '01234567891' }] },
    { day: 'الأحد', drivers: [{ name: 'سائق 1', phone: '01234567890' }] },
    { day: 'الإثنين', drivers: [{ name: 'سائق 2', phone: '01234567891' }] },
    { day: 'الثلاثاء', drivers: [{ name: 'سائق 1', phone: '01234567890' }] },
    { day: 'الأربعاء', drivers: [{ name: 'سائق 2', phone: '01234567891' }] },
    { day: 'الخميس', drivers: [{ name: 'سائق 1', phone: '01234567890' }] },
];
export const mockExternalRoutes: ExternalRoute[] = [
    { id: 1, name: 'خط جسر السويس', timings: ['7:00 ص', '3:00 م'], waitingPoint: 'أمام محطة المترو' }
];
export const mockScheduleOverrides: ScheduleOverride[] = [
    { date: '2023-06-20', drivers: [{ name: 'سائق 1', phone: '01234567890' }, { name: 'سائق 2', phone: '01234567891' }] }
];

export const mockDiscussionCircles: DiscussionCircle[] = [
    { id: 1, name: 'نقاش عام', description: 'لكل سكان المدينة', category: 'عام' },
    { id: 2, name: 'سكان الحي الأول', description: 'مناقشات خاصة بالحي الأول', category: 'أحياء سكنية' }
];

export const mockCommunityPosts: CommunityPost[] = [
    { id: 1, authorId: 1, circleId: 1, timestamp: '2023-06-01T10:00:00Z', content: 'ما هو أفضل مكان لشراء الخضروات؟', likes: 15, comments: [{ id: 1, authorId: 2, timestamp: '2023-06-01T10:05:00Z', content: 'أنصح بسوبر ماركت المدينة.' }] }
];

export const mockForSaleItems: ForSaleItem[] = [
    { id: 1, authorId: 2, title: 'أريكة مستعملة بحالة جيدة', description: 'أريكة 3 مقاعد...', category: 'أثاث', price: 1500, images: ['https://picsum.photos/600/400?random=61'], contactName: 'فاطمة', contactPhone: '010...', status: 'approved', creationDate: '2023-05-25' },
    { id: 2, authorId: 1, title: 'دراجة أطفال', description: 'دراجة بحالة ممتازة', category: 'ألعاب أطفال', price: 300, images: ['https://picsum.photos/600/400?random=62'], contactName: 'أحمد', contactPhone: '011...', status: 'pending', creationDate: '2023-06-02' }
];

export const mockJobs: JobPosting[] = [
    { id: 1, authorId: 5, title: 'مطلوب كاشير', companyName: 'سوبر ماركت المدينة', location: 'الحي الأول', jobType: 'دوام كامل', description: 'يشترط الخبرة...', contactInfo: 'يرجى إرسال السيرة الذاتية...', status: 'approved', creationDate: '2023-05-28' },
    { id: 2, authorId: 6, title: 'مطلوب شيف', companyName: 'مطعم المأكولات الشرقية', location: 'المول', jobType: 'دوام كامل', description: 'خبرة في المطبخ الشرقي', contactInfo: 'الاتصال على ...', status: 'pending', creationDate: '2023-06-01' },
];

export const mockOffers: Offer[] = [
    { id: 1, title: "خصم 25% على المشويات", description: "استمتع بخصم 25% على جميع أصناف المشويات", imageUrl: "https://picsum.photos/600/400?random=71", serviceId: 1, startDate: "2023-06-01", endDate: "2023-06-30", terms: "العرض ساري أيام الأسبوع فقط."}
];

export const mockOfferCodes: OfferCode[] = [
    { id: 1, offerId: 1, userId: 1, code: "HELIO-XYZ123", isRedeemed: false, issueDate: "2023-06-02" }
];
