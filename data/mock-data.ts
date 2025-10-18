// data/mock-data.ts
import type { 
    AdminUser, AppUser, Service, Category, News, Notification, Ad, Property, EmergencyContact, 
    ServiceGuide, Supervisor, Driver, WeeklyScheduleItem, ExternalRoute, ScheduleOverride, 
    PublicPagesContent, CommunityPost, ForSaleItem, JobPosting, LostAndFoundItem, DiscussionCircle
} from '../types';

export const mockAdmins: AdminUser[] = [
    { id: 1, name: 'Super Admin', email: 'super@helio.com', avatar: 'https://picsum.photos/seed/1/200/200', roles: ['مدير عام'] },
    { id: 2, name: 'Service Manager', email: 'service@helio.com', avatar: 'https://picsum.photos/seed/2/200/200', roles: ['مسؤول ادارة الخدمات'] },
    { id: 3, name: 'Property Manager', email: 'property@helio.com', avatar: 'https://picsum.photos/seed/3/200/200', roles: ['مسؤول العقارات'] },
    { id: 4, name: 'Content Manager', email: 'content@helio.com', avatar: 'https://picsum.photos/seed/4/200/200', roles: ['مسؤول المحتوى'] },
    { id: 5, name: 'Transport Manager', email: 'transport@helio.com', avatar: 'https://picsum.photos/seed/5/200/200', roles: ['مسؤول النقل'] },
    { id: 6, name: 'Community Manager', email: 'community@helio.com', avatar: 'https://picsum.photos/seed/6/200/200', roles: ['مسؤول المجتمع'] },
];

export const mockUsers: AppUser[] = [
    { id: 1, name: 'أحمد محمود', email: 'ahmed@email.com', avatar: 'https://picsum.photos/seed/101/200/200', joinDate: '2023-05-10', status: 'active' },
    { id: 2, name: 'فاطمة الزهراء', email: 'fatima@email.com', avatar: 'https://picsum.photos/seed/102/200/200', joinDate: '2023-06-15', status: 'active' },
    { id: 3, name: 'محمد علي', email: 'mohamed@email.com', avatar: 'https://picsum.photos/seed/103/200/200', joinDate: '2023-07-20', status: 'pending' },
    { id: 4, name: 'سارة إبراهيم', email: 'sara@email.com', avatar: 'https://picsum.photos/seed/104/200/200', joinDate: '2023-08-01', status: 'banned' },
];

export const mockCategories: Category[] = [
  { id: 1, name: "خدمات أساسية", icon: "WrenchScrewdriverIcon", subCategories: [ { id: 101, name: "صيانة منزلية" }, { id: 102, name: "نظافة" } ] },
  { id: 2, name: "مطاعم ومقاهي", icon: "CakeIcon", subCategories: [ { id: 201, name: "مطاعم" }, { id: 202, name: "مقاهي" } ] },
  { id: 3, name: "المدينة والجهاز", icon: "BuildingLibraryIcon", subCategories: [{id: 301, name: "خدمات الجهاز"}] }
];

export const mockServices: Service[] = [
    {
        id: 1, subCategoryId: 101, name: "سباك محترف", address: "محل 5، مول سيتي بلازا", phone: "01234567890", whatsapp: "201234567890", 
        images: ["https://picsum.photos/seed/s1/800/600"], about: "لجميع أعمال السباكة والصيانة.", rating: 4.5, views: 120,
        reviews: [
            { id: 1, username: "أحمد", avatar: "https://picsum.photos/seed/u1/200/200", rating: 5, comment: "شغل ممتاز وسريع", date: "2023-08-01", adminReply: "شكراً لثقتكم!" },
            { id: 2, username: "فاطمة", avatar: "https://picsum.photos/seed/u2/200/200", rating: 4, comment: "جيد جدا ولكن تأخر قليلا", date: "2023-08-02" },
        ],
        isFavorite: true, creationDate: '2023-01-15'
    },
    {
        id: 2, subCategoryId: 201, name: "مطعم المأكولات الشرقية", address: "فود كورت، هليو بارك", phone: "01098765432", whatsapp: "201098765432", 
        images: ["https://picsum.photos/seed/s2/800/600"], about: "أشهى المأكولات الشرقية والمشويات.", rating: 4.8, views: 250,
        reviews: [], isFavorite: false, creationDate: '2023-02-20'
    },
];

export const mockNews: News[] = [
    { id: 1, title: "افتتاح المرحلة الجديدة من هليو بارك", content: "تم افتتاح المرحلة الجديدة...", imageUrl: "https://picsum.photos/seed/n1/600/400", date: "2023-08-01", author: "إدارة المدينة", views: 1500 },
    { id: 2, title: "بدء تشغيل خطوط باصات جديدة", content: "تعلن إدارة النقل عن...", imageUrl: "https://picsum.photos/seed/n2/600/400", date: "2023-07-25", author: "إدارة النقل", views: 2300 },
];

export const mockNotifications: Notification[] = [
    { id: 1, title: "انقطاع المياه المجدول", content: "سيتم قطع المياه يوم...", startDate: "2023-08-10", endDate: "2023-08-10" },
    { id: 2, title: "عروض الصيف في مول سيتي بلازا", content: "خصومات تصل إلى 50%", startDate: "2023-08-01", endDate: "2023-08-31", serviceId: 1, imageUrl: "https://picsum.photos/seed/notif1/600/400" },
];

export const mockAds: Ad[] = [
    { id: 1, title: "إعلان ممول: عيادة د.أحمد لطب الأسنان", content: "خصم 20% على خدمات التبييض.", startDate: "2023-08-01", endDate: "2023-08-15", imageUrl: "https://picsum.photos/seed/ad1/600/400", referralType: 'service', referralId: 1, placement: 'الرئيسية' },
    { id: 2, title: "خصومات الصيف في مول سيتي بلازا", content: "تخفيضات هائلة على جميع الماركات.", startDate: "2023-08-05", endDate: "2023-08-25", imageUrl: "https://picsum.photos/seed/ad2/600/400", placement: 'المجتمع' },
];

export const mockProperties: Property[] = [
    { id: 1, title: "شقة للبيع 150م بجوار النادي", description: "شقة 3 غرف نوم...", images: ["https://picsum.photos/seed/p1/800/600"], type: 'sale', price: 1500000, location: { address: "الحي الأول" }, contact: { name: "المالك", phone: "01012345678" }, amenities: ["أسانسير", "جراج"], views: 560, creationDate: '2023-03-10' },
    { id: 2, title: "فيلا للإيجار بحديقة خاصة", description: "فيلا مستقلة...", images: ["https://picsum.photos/seed/p2/800/600"], type: 'rent', price: 25000, location: { address: "الحي الثالث" }, contact: { name: "مكتب تسويق", phone: "01187654321" }, amenities: ["حديقة", "حمام سباحة"], views: 890, creationDate: '2023-04-05' },
];

export const mockEmergencyContacts: EmergencyContact[] = [
    { id: 1, title: "شرطة النجدة", number: "122", type: "national" },
    { id: 2, title: "الإسعاف", number: "123", type: "national" },
    { id: 3, title: "طوارئ الكهرباء", number: "121", type: "national" },
    { id: 4, title: "أمن بوابة المدينة", number: "0123456789", type: "city" },
];

export const mockServiceGuides: ServiceGuide[] = [
    { id: 1, title: "استخراج رخصة بناء", steps: ["تقديم طلب", "معاينة", "دفع رسوم"], documents: ["صورة بطاقة", "عقد ملكية"] },
];

// Transportation Mocks
export const mockInternalSupervisor: Supervisor = { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' };
export const mockExternalSupervisor: Supervisor = { name: 'أ. حسين فهمي', phone: '015-4321-0987' };
export const mockInternalDrivers: Driver[] = [
    { id: 1, name: 'أحمد المصري', phone: '010-1111-2222', avatar: 'https://picsum.photos/200/200?random=1' },
    { id: 2, name: 'خالد عبدالله', phone: '011-2222-3333', avatar: 'https://picsum.photos/200/200?random=3' },
];
export const mockWeeklySchedule: WeeklyScheduleItem[] = [
    { day: 'الأحد', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] },
    { day: 'الإثنين', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] },
    { day: 'الثلاثاء', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] },
    { day: 'الأربعاء', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] },
    { day: 'الخميس', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] },
    { day: 'الجمعة', drivers: [] },
    { day: 'السبت', drivers: [] },
];
export const mockExternalRoutes: ExternalRoute[] = [
    { id: 1, name: 'هليوبوليس <> رمسيس', timings: ['07:00', '14:00'], waitingPoint: 'أمام البوابة الرئيسية' },
];
export const mockScheduleOverrides: ScheduleOverride[] = [];

// Marketplace Mocks
export const mockForSaleItems: ForSaleItem[] = [
    { id: 1, authorId: 1, title: 'أثاث منزلي مستعمل', description: 'غرفة نوم كاملة بحالة ممتازة.', category: 'أثاث', price: 5000, images: ['https://picsum.photos/seed/fs1/400/300'], contactName: 'أحمد محمود', contactPhone: '01012345678', status: 'pending', creationDate: '2023-08-01' },
    { id: 2, authorId: 2, title: 'سيارة للبيع', description: 'هيونداي النترا موديل 2019.', category: 'سيارات', price: 350000, images: ['https://picsum.photos/seed/fs2/400/300'], contactName: 'فاطمة', contactPhone: '01112345678', status: 'approved', creationDate: '2023-07-28', approvalDate: '2023-07-29', expiryDate: '2023-08-28' },
];
export const mockJobs: JobPosting[] = [
    { id: 1, authorId: 3, title: 'مطلوب محاسب', companyName: 'شركة ABC', location: 'هليوبوليس الجديدة', jobType: 'دوام كامل', description: 'خبرة 3-5 سنوات.', contactInfo: 'hr@abc.com', status: 'pending', creationDate: '2023-08-02' },
];
export const mockLostAndFoundItems: LostAndFoundItem[] = [
    { id: 1, itemName: 'محفظة سوداء', description: 'تحتوي على بطاقات وهوية.', location: 'مول سيتي بلازا', date: '2023-08-01', reporterName: 'أحمد محمود', reporterContact: '01012345678', status: 'lost' },
    { id: 2, itemName: 'مفاتيح سيارة', description: 'مفاتيح ماركة تويوتا.', location: 'أمام النادي', date: '2023-07-30', reporterName: 'فاعل خير', reporterContact: '01234567890', status: 'found', imageUrl: 'https://picsum.photos/seed/lf2/400/300' },
];

// Community Mocks
export const mockDiscussionCircles: DiscussionCircle[] = [
    // General
    { id: 1, name: 'نقاش عام', description: 'مناقشات وأخبار عامة لكل سكان المدينة.', category: 'عام' },
    // Community Services
    { id: 2, name: 'البيع والشراء', description: 'لعرض وطلب المنتجات والخدمات بين السكان.', category: 'خدمات مجتمعية' },
    { id: 3, name: 'المفقودات والمعثورات', description: 'للمساعدة في العثور على المفقودات والإبلاغ عن المعثورات.', category: 'خدمات مجتمعية' },
    // Neighborhoods
    { id: 101, name: 'الحي الأول', description: 'كل ما يخص سكان الحي الأول.', category: 'أحياء سكنية' },
    { id: 102, name: 'الحي الثاني', description: 'كل ما يخص سكان الحي الثاني.', category: 'أحياء سكنية' },
    { id: 103, name: 'الحي الثالث', description: 'كل ما يخص سكان الحي الثالث.', category: 'أحياء سكنية' },
    { id: 104, name: 'الحي الرابع', description: 'كل ما يخص سكان الحي الرابع.', category: 'أحياء سكنية' },
    { id: 105, name: 'الحي الخامس', description: 'كل ما يخص سكان الحي الخامس.', category: 'أحياء سكنية' },
    { id: 106, name: 'الحي السادس', description: 'كل ما يخص سكان الحي السادس.', category: 'أحياء سكنية' },
    { id: 107, name: 'الحي السابع', description: 'كل ما يخص سكان الحي السابع.', category: 'أحياء سكنية' },
    { id: 108, name: 'الحي الثامن', description: 'كل ما يخص سكان الحي الثامن.', category: 'أحياء سكنية' },
    { id: 109, name: 'الحي التاسع', description: 'كل ما يخص سكان الحي التاسع.', category: 'أحياء سكنية' },
    // Compounds
    { id: 201, name: 'كمبوند الياسمين', description: 'خاص بسكان كمبوند الياسمين.', category: 'كمبوندات' },
    { id: 202, name: 'كمبوند الزهور', description: 'خاص بسكان كمبوند الزهور.', category: 'كمبوندات' },
    { id: 203, name: 'كمبوند الربوة', description: 'خاص بسكان كمبوند الربوة.', category: 'كمبوندات' },
    { id: 204, name: 'كمبوند النخيل', description: 'خاص بسكان كمبوند النخيل.', category: 'كمبوندات' },
    { id: 205, name: 'كمبوند الصفوة', description: 'خاص بسكان كمبوند الصفوة.', category: 'كمبوندات' },
];

export const mockCommunityPosts: CommunityPost[] = [
    { 
        id: 1, 
        circleId: 101,
        authorId: 1, 
        content: 'يا جماعة حد يعرف كهربائي كويس في المدينة؟ شغله يكون مضمون.', 
        timestamp: '2023-08-02T10:00:00Z', 
        likes: 5, 
        comments: [
            {id: 1, authorId: 2, content: 'جرب تكلم أسطى محمود 012... شغله ممتاز', timestamp: '2023-08-02T10:05:00Z'},
            {
                id: 2, 
                authorId: 3, 
                content: 'بلاش أسطى محمود ده غالي جدا ومواعيده مش مظبوطة.', 
                timestamp: '2023-08-02T11:30:00Z',
                reports: [
                    { reporterId: 2, reason: 'inappropriate', timestamp: '2023-08-02T11:35:00Z' }
                ]
            }
        ] 
    },
    { 
        id: 2,
        circleId: 2,
        authorId: 4, 
        content: 'للبيع: أريكة بحالة ممتازة. السعر 1500 جنيه. التواصل على الخاص.', 
        imageUrl: 'https://picsum.photos/seed/cp2/800/600',
        timestamp: '2023-08-01T15:20:00Z', 
        likes: 12, 
        comments: [] 
    },
    { 
        id: 3, 
        circleId: 1,
        authorId: 2, 
        content: 'مهرجان الصيف في هليو بارك كان رائع! مين حضره؟', 
        timestamp: '2023-07-30T20:00:00Z', 
        likes: 25, 
        comments: [],
        reports: [
            { reporterId: 1, reason: 'spam', timestamp: '2023-07-31T09:00:00Z' },
            { reporterId: 3, reason: 'spam', timestamp: '2023-07-31T09:05:00Z' }
        ]
    },
     { 
        id: 4, 
        circleId: 3,
        authorId: 3, 
        content: 'تم العثور على مفاتيح سيارة بجوار مول سيتي بلازا. يرجى التواصل للتعرف عليها.', 
        timestamp: '2023-08-03T12:00:00Z', 
        likes: 8, 
        comments: []
    },
];

// Public Pages Content
export const mockPublicPagesContent: PublicPagesContent = {
    home: {
        heroTitleLine1: 'مدينتك في جيبك',
        heroTitleLine2: 'تطبيق Helio',
        heroSubtitle: 'دليلك الشامل لكل الخدمات، الأخبار، والعقارات في هليوبوليس الجديدة. حمل التطبيق الآن وعيش تجربة أسهل في مدينتك.',
        featuresSectionTitle: 'كل ما تحتاجه في مكان واحد',
        featuresSectionSubtitle: 'تطبيق Helio مصمم ليكون رفيقك اليومي في المدينة، ويوفر لك مجموعة من المميزات التي تجعل حياتك أسهل.',
        features: [
            { title: 'دليل شامل', description: 'ابحث عن أي خدمة أو مكان في المدينة بسهولة، من المطاعم والعيادات إلى الصيانة المنزلية.' },
            { title: 'أخبار وتنبيهات', description: 'كن على اطلاع دائم بآخر أخبار المدينة، الإعلانات الهامة، والتنبيهات العاجلة من إدارة المدينة.' },
            { title: 'مجتمع متصل', description: 'تواصل مع جيرانك، شارك في النقاشات، وكن جزءًا من مجتمع هليوبوليس الجديدة النابض بالحياة.' },
        ],
        infoLinksSectionTitle: 'روابط ومعلومات هامة',
    },
    about: {
        title: 'حول تطبيق Helio',
        intro: 'تطبيق "هيليو" هو بوابتك الرقمية الشاملة لمدينة هليوبوليس الجديدة. تم تصميم التطبيق ليكون الرفيق اليومي لكل ساكن، حيث يهدف إلى تسهيل الوصول إلى كافة الخدمات والمعلومات الحيوية داخل المدينة، وتعزيز التواصل بين السكان وإدارة المدينة.',
        vision: { title: 'رؤيتنا', text: 'أن نكون المنصة الرائدة التي تساهم في بناء مجتمع مترابط وذكي في هليوبوليس الجديدة، حيث يتمتع السكان بحياة أسهل وأكثر راحة من خلال التكنولوجيا.' },
        mission: { title: 'مهمتنا', text: 'توفير منصة موحدة تجمع كافة الخدمات، الأخبار، والعقارات، وتسهل التواصل الفعال بين السكان، مقدمي الخدمات، وإدارة المدينة لتعزيز جودة الحياة للجميع.' },
    },
    faq: {
        title: 'الأسئلة الشائعة',
        subtitle: 'تجد هنا إجابات للأسئلة الأكثر شيوعاً حول التطبيق والمدينة.',
        categories: [
            {
                category: 'عن التطبيق',
                items: [{ q: 'ما هو تطبيق Helio؟', a: 'هو تطبيق شامل لسكان مدينة هليوبوليس الجديدة...' }]
            },
        ],
    },
    privacy: {
        title: 'سياسة الخصوصية',
        lastUpdated: '1 أغسطس 2023',
        sections: [
            {
                title: 'مقدمة',
                content: ['نحن في Helio نأخذ خصوصيتك على محمل الجد...']
            }
        ]
    },
    terms: {
        title: 'شروط الاستخدام',
        lastUpdated: '1 أغسطس 2023',
        sections: [
            {
                title: 'قبول الشروط',
                content: ['باستخدامك لتطبيق Helio، فإنك توافق على الالتزام بهذه الشروط...']
            }
        ]
    }
};