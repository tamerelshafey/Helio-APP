// data/mock-data.ts
import type { 
    AdminUser, AppUser, Service, Category, News, Notification, Ad, Property, EmergencyContact, 
    ServiceGuide, Supervisor, Driver, WeeklyScheduleItem, ExternalRoute, ScheduleOverride, 
    PublicPagesContent, CommunityPost, ForSaleItem, JobPosting, LostAndFoundItem, DiscussionCircle,
    // FIX: Add missing type imports
    CommunityComment, ScheduleDriver
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
    { id: 5, name: 'خالد السيد', email: 'khaled@email.com', avatar: 'https://picsum.photos/seed/105/200/200', joinDate: '2023-08-05', status: 'active' },
    { id: 6, name: 'مريم حسين', email: 'mariam@email.com', avatar: 'https://picsum.photos/seed/106/200/200', joinDate: '2023-08-10', status: 'active' },
    { id: 7, name: 'يوسف طارق', email: 'youssef@email.com', avatar: 'https://picsum.photos/seed/107/200/200', joinDate: '2023-08-11', status: 'pending' },
    { id: 8, name: 'هناء مصطفى', email: 'hanaa@email.com', avatar: 'https://picsum.photos/seed/108/200/200', joinDate: '2023-08-12', status: 'active' },
];

export const mockCategories: Category[] = [
  { id: 1, name: "خدمات أساسية", icon: "WrenchScrewdriverIcon", subCategories: [ { id: 101, name: "صيانة منزلية" }, { id: 102, name: "نظافة" }, {id: 103, name: "مكافحة حشرات"} ] },
  { id: 2, name: "مطاعم ومقاهي", icon: "CakeIcon", subCategories: [ { id: 201, name: "مطاعم" }, { id: 202, name: "مقاهي" } ] },
  { id: 3, name: "المدينة والجهاز", icon: "BuildingLibraryIcon", subCategories: [{id: 301, name: "خدمات الجهاز"}] },
  { id: 4, name: "صحة وطب", icon: "HeartIcon", subCategories: [ { id: 401, name: "عيادات وصيدليات" }, { id: 402, name: "مستشفيات" } ] },
  { id: 5, name: "تعليم", icon: "AcademicCapIcon", subCategories: [ { id: 501, name: "مدارس وحضانات" }, { id: 502, name: "مراكز تعليمية" } ] },
  { id: 6, name: "تسوق وترفيه", icon: "ShoppingBagIcon", subCategories: [ { id: 601, name: "سوبر ماركت" }, { id: 602, name: "محلات ملابس" }, { id: 603, name: "ترفيه وألعاب"} ] },
];

export const mockServices: Service[] = [
    {
        id: 1, subCategoryId: 101, name: "سباك محترف (أبو أحمد)", address: "محل 5، مول سيتي بلازا", phone: "01234567890", whatsapp: "201234567890", 
        images: ["https://picsum.photos/seed/s1/800/600", "https://picsum.photos/seed/s1-2/800/600"], about: "لجميع أعمال السباكة والصيانة المنزلية الطارئة. خبرة أكثر من 20 عامًا في المجال. أسعار تنافسية وجودة مضمونة.", rating: 4.5, views: 1250,
        reviews: [
            { id: 1, username: "أحمد", avatar: "https://picsum.photos/seed/u1/200/200", rating: 5, comment: "شغل ممتاز وسريع، أنقذني في منتصف الليل.", date: "2023-08-01", adminReply: "شكراً لثقتكم ويسعدنا خدمتكم دائماً!" },
            { id: 2, username: "فاطمة", avatar: "https://picsum.photos/seed/u2/200/200", rating: 4, comment: "جيد جدا ولكن تأخر قليلا عن الموعد المحدد.", date: "2023-08-02" },
        ],
        isFavorite: true, creationDate: '2023-01-15', facebookUrl: 'https://facebook.com', workingHours: '24/7 للطوارئ'
    },
    {
        id: 2, subCategoryId: 201, name: "مطعم المأكولات الشرقية", address: "فود كورت، هليو بارك", phone: "01098765432", whatsapp: "201098765432", 
        images: ["https://picsum.photos/seed/s2/800/600"], about: "أشهى المأكولات الشرقية والمشويات الطازجة يوميًا. يوجد توصيل للمنازل.", rating: 4.8, views: 2800,
        reviews: [
             { id: 3, username: "خالد", avatar: "https://picsum.photos/seed/u5/200/200", rating: 5, comment: "الأكل رائع والتوصيل سريع جدا!", date: "2023-08-05" },
        ], isFavorite: false, creationDate: '2023-02-20', instagramUrl: 'https://instagram.com', workingHours: '11:00 ص - 02:00 ص'
    },
    { id: 3, subCategoryId: 401, name: "صيدلية العزبي", address: "بجوار بوابة 1", phone: "19600", whatsapp: "201012345678", images: ["https://picsum.photos/seed/s3/800/600"], about: "صيدلية متكاملة تعمل على مدار 24 ساعة.", rating: 4.2, views: 1800, reviews: [], isFavorite: true, creationDate: '2023-03-10' },
    { id: 4, subCategoryId: 601, name: "سوبر ماركت أولاد رجب", address: "سيتي بلازا مول", phone: "19225", whatsapp: "201112345678", images: ["https://picsum.photos/seed/s4/800/600"], about: "كل احتياجات منزلك في مكان واحد.", rating: 4.0, views: 2200, reviews: [], isFavorite: false, creationDate: '2023-04-01' },
    { id: 5, subCategoryId: 102, name: "شركة النظافة الحديثة", address: "مكتب 3، مبنى الإداريات", phone: "01122334455", whatsapp: "201122334455", images: ["https://picsum.photos/seed/s5/800/600"], about: "خدمات نظافة متكاملة للشقق والفلل والشركات.", rating: 3.8, views: 950, reviews: [], isFavorite: false, creationDate: '2023-05-15' },
    { id: 6, subCategoryId: 202, name: "مقهى كوستا", address: "هليو بارك", phone: "0100100100", whatsapp: "20100100100", images: ["https://picsum.photos/seed/s6/800/600"], about: "أفضل أنواع القهوة والمشروبات.", rating: 4.9, views: 3500, reviews: [], isFavorite: true, creationDate: '2023-06-20' },
    { id: 7, subCategoryId: 501, name: "حضانة كيدز زون", address: "الحي الثاني", phone: "01287654321", whatsapp: "201287654321", images: ["https://picsum.photos/seed/s7/800/600"], about: "رعاية وتعليم للأطفال من سن 6 شهور.", rating: 4.6, views: 1100, reviews: [], isFavorite: true, creationDate: '2023-07-01' },
    { id: 8, subCategoryId: 603, name: "كيدز إيريا هليو بارك", address: "هليو بارك", phone: "01555667788", whatsapp: "201555667788", images: ["https://picsum.photos/seed/s8/800/600"], about: "منطقة ألعاب آمنة وممتعة للأطفال.", rating: 4.4, views: 1900, reviews: [], isFavorite: false, creationDate: '2023-07-25' },
];

export const mockNews: News[] = [
    { id: 1, title: "افتتاح المرحلة الجديدة من هليو بارك", content: "تم افتتاح المرحلة الجديدة التي تضم مجموعة من المطاعم والكافيهات العالمية...", imageUrl: "https://picsum.photos/seed/n1/600/400", date: "2023-08-01", author: "إدارة المدينة", views: 1500 },
    { id: 2, title: "بدء تشغيل خطوط باصات جديدة تربط المدينة بالقاهرة", content: "تعلن إدارة النقل عن بدء تشغيل خطوط جديدة لتسهيل حركة السكان...", imageUrl: "https://picsum.photos/seed/n2/600/400", date: "2023-07-25", author: "إدارة النقل", views: 2300 },
    { id: 3, title: "حملة تشجير واسعة في الحي الثالث", content: "بالتعاون مع السكان، قام جهاز المدينة بتنظيم حملة تشجير لزيادة المساحات الخضراء...", imageUrl: "https://picsum.photos/seed/n3/600/400", date: "2023-07-15", author: "جهاز المدينة", views: 850 },
    { id: 4, title: "تنبيه هام بخصوص صيانة شبكات المياه", content: "يعلن جهاز المدينة عن وجود أعمال صيانة مجدولة لشبكات المياه يوم الثلاثاء القادم...", imageUrl: "https://picsum.photos/seed/n4/600/400", date: "2023-08-05", author: "جهاز المدينة", views: 3200 },
];

export const mockNotifications: Notification[] = [
    { id: 1, title: "انقطاع المياه المجدول", content: "سيتم قطع المياه يوم الثلاثاء من الساعة 10 صباحًا حتى 2 ظهرًا لأعمال الصيانة.", startDate: "2023-08-10", endDate: "2023-08-10" },
    { id: 2, title: "عروض الصيف في مول سيتي بلازا", content: "خصومات تصل إلى 50% لدى المحلات المشاركة طوال شهر أغسطس.", startDate: "2023-08-01", endDate: "2023-08-31", serviceId: 4, imageUrl: "https://picsum.photos/seed/notif1/600/400" },
    { id: 3, title: "مهرجان الصيف في هليو بارك", content: "لا تفوتوا فعاليات مهرجان الصيف كل خميس وجمعة في هليو بارك.", startDate: "2023-07-20", endDate: "2023-08-20" },
    { id: 4, title: "إشعار: تم إغلاق باب التقديم للمدارس", content: "تم إغلاق باب التقديم للعام الدراسي الجديد في مدارس المدينة.", startDate: "2023-09-01", endDate: "2023-09-01" },
];

export const mockAds: Ad[] = [
    { id: 1, title: "إعلان ممول: سباك محترف", content: "خصم 20% على خدمات الصيانة عند ذكر هذا الإعلان.", startDate: "2023-08-01", endDate: "2023-08-15", imageUrl: "https://picsum.photos/seed/ad1/600/400", referralType: 'service', referralId: 1, placement: 'الرئيسية' },
    { id: 2, title: "افتتاح فرع جديد لكوستا كافيه!", content: "استمتع بقهوتك المفضلة الآن في هليو بارك.", startDate: "2023-08-05", endDate: "2023-08-25", imageUrl: "https://picsum.photos/seed/ad2/600/400", referralType: 'service', referralId: 6, placement: 'المجتمع' },
    { id: 3, title: "شقة للبيع بسعر مغري", content: "شقة 150م بجوار النادي مباشرة، استلام فوري.", startDate: "2023-08-01", endDate: "2023-08-31", referralType: 'property', referralId: 1, placement: 'الخدمات' },
];

export const mockProperties: Property[] = [
    { id: 1, title: "شقة للبيع 150م بجوار النادي", description: "شقة 3 غرف نوم، 2 حمام، تشطيب سوبر لوكس، فيو مفتوح على حديقة.", images: ["https://picsum.photos/seed/p1/800/600", "https://picsum.photos/seed/p1-2/800/600"], type: 'sale', price: 1500000, location: { address: "الحي الأول" }, contact: { name: "المالك", phone: "01012345678" }, amenities: ["أسانسير", "جراج خاص", "أمن 24 ساعة"], views: 560, creationDate: '2023-03-10' },
    { id: 2, title: "فيلا للإيجار بحديقة خاصة وحمام سباحة", description: "فيلا مستقلة 450م، 5 غرف نوم، مفروشة بالكامل بأثاث مودرن.", images: ["https://picsum.photos/seed/p2/800/600"], type: 'rent', price: 25000, location: { address: "الحي الثالث" }, contact: { name: "مكتب تسويق", phone: "01187654321" }, amenities: ["حديقة خاصة", "حمام سباحة", "غرفة مربية"], views: 890, creationDate: '2023-04-05' },
    { id: 3, title: "شقة 120م للإيجار قانون جديد", description: "شقة غرفتين ورسيبشن قطعتين، أول سكن، موقع مميز.", images: ["https://picsum.photos/seed/p3/800/600"], type: 'rent', price: 6000, location: { address: "الحي الثاني" }, contact: { name: "المالك", phone: "01234509876" }, amenities: ["أسانسير", "غاز طبيعي"], views: 1200, creationDate: '2023-07-20' },
    { id: 4, title: "دوبلكس للبيع 250م بحديقة 80م", description: "دوبلكس أرضي وأول، مدخل خاص، تشطيب الترا سوبر لوكس.", images: ["https://picsum.photos/seed/p4/800/600"], type: 'sale', price: 2750000, location: { address: "كمبوند الياسمين" }, contact: { name: "شركة تسويق", phone: "01555555555" }, amenities: ["حديقة خاصة", "جراج", "أمن"], views: 450, creationDate: '2023-08-02' },
];

export const mockEmergencyContacts: EmergencyContact[] = [
    { id: 1, title: "شرطة النجدة", number: "122", type: "national" },
    { id: 2, title: "الإسعاف", number: "123", type: "national" },
    { id: 3, title: "طوارئ الكهرباء", number: "121", type: "national" },
    { id: 4, title: "طوارئ الغاز", number: "129", type: "national" },
    { id: 5, title: "أمن بوابة المدينة الرئيسية", number: "0123456789", type: "city" },
    // FIX: complete the object which was cut off
    { id: 6, title: "طوارئ المياه", number: "125", type: "national" },
];

// FIX: Add missing mock data exports
export const mockServiceGuides: ServiceGuide[] = [
    { id: 1, title: 'إصدار بطاقة رقم قومي أول مرة', steps: ['شراء استمارة الرقم القومي', 'ملء البيانات وختمها من جهة العمل أو الدراسة', 'التصوير في السجل المدني', 'استلام البطاقة بعد 15 يومًا'], documents: ['استمارة الرقم القومي', 'شهادة ميلاد كمبيوتر', 'مستند إثبات المهنة ومحل الإقامة'] },
    { id: 2, title: 'إجراءات تسجيل مولود', steps: ['الحصول على إخطار ولادة من المستشفى', 'الذهاب إلى مكتب الصحة التابع له محل الإقامة خلال 15 يومًا', 'تسليم الإخطار والمستندات المطلوبة', 'استلام شهادة الميلاد'], documents: ['أصل إخطار الولادة', 'بطاقة الرقم القومي للأب والأم', 'قسيمة الزواج'] },
];

export const mockPublicPagesContent: PublicPagesContent = {
    home: {
        heroTitleLine1: 'مدينتك',
        heroTitleLine2: 'في تطبيق واحد',
        heroSubtitle: 'Helio هو دليلك الشامل لاستكشاف الخدمات، متابعة الأخبار، والتواصل مع مجتمع هليوبوليس الجديدة.',
        featuresSectionTitle: 'اكتشف كل ما تقدمه المدينة',
        featuresSectionSubtitle: 'من الخدمات اليومية إلى الفرص الاستثمارية، كل ما تحتاجه في مكان واحد.',
        features: [
            { title: 'دليل خدمات متكامل', description: 'ابحث عن أفضل مقدمي الخدمات في منطقتك وقارن بينهم.' },
            { title: 'سوق العقارات', description: 'تصفح أحدث عروض البيع والإيجار في هليوبوليس الجديدة.' },
            { title: 'مجتمع متفاعل', description: 'شارك في دوائر النقاش، وكن على اطلاع دائم بما يحدث حولك.' },
        ],
        infoLinksSectionTitle: 'روابط تهمك',
    },
    about: {
        title: 'عن تطبيق Helio',
        intro: 'تطبيق Helio هو مبادرة لخدمة سكان ومرتادي مدينة هليوبوليس الجديدة، يهدف إلى تسهيل الحياة اليومية وتعزيز التواصل بين أفراد المجتمع. نحن نؤمن بأن التكنولوجيا يمكن أن تجعل مدننا أماكن أفضل للعيش.',
        vision: { title: 'رؤيتنا', text: 'أن نكون المنصة الرقمية الأولى التي تجمع كل ما يخص مدينة هليوبوليس الجديدة، مما يجعلها مدينة أكثر ترابطًا وذكاءً.' },
        mission: { title: 'مهمتنا', text: 'توفير معلومات دقيقة ومحدثة عن كافة الخدمات والفعاليات، وتسهيل الوصول إليها، وخلق مساحة تفاعلية آمنة لسكان المدينة.' },
    },
    faq: {
        title: 'الأسئلة الشائعة',
        subtitle: 'تجد هنا إجابات للأسئلة الأكثر شيوعًا حول التطبيق وخدماته.',
        categories: [
            { category: 'عن التطبيق', items: [{ q: 'ما هو تطبيق Helio؟', a: 'هو تطبيق شامل يخدم سكان وزوار مدينة هليوبوليس الجديدة.' }] },
            { category: 'الخدمات', items: [{ q: 'كيف يمكنني إضافة خدمتي؟', a: 'يمكنك التواصل مع إدارة التطبيق من خلال قسم "اتصل بنا".' }] },
        ],
    },
    privacy: {
        title: 'سياسة الخصوصية',
        lastUpdated: '1 أغسطس 2023',
        sections: [
            { title: 'مقدمة', content: '<p>نحن نهتم بخصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>' },
            { title: 'البيانات التي نجمعها', content: '<ul><li>بيانات الحساب (الاسم، البريد الإلكتروني).</li><li>بيانات الاستخدام والتفاعل مع التطبيق.</li></ul>' },
        ],
    },
    terms: {
        title: 'شروط الاستخدام',
        lastUpdated: '1 أغسطس 2023',
        sections: [
            { title: 'قبول الشروط', content: '<p>باستخدامك لتطبيق Helio، فإنك توافق على الالتزام بهذه الشروط والأحكام.</p>' },
            { title: 'استخدام التطبيق', content: '<ul><li>يجب استخدام التطبيق للأغراض المشروعة فقط.</li><li>أنت مسؤول عن صحة البيانات التي تقدمها.</li></ul>' },
        ],
    },
};

export const mockLostAndFoundItems: LostAndFoundItem[] = [
    { id: 1, itemName: "محفظة سوداء", description: "محفظة جلدية سوداء بها بطاقات شخصية", location: "هليو بارك", date: "2023-08-10", reporterName: "أحمد علي", reporterContact: "01012345678", status: 'lost', moderationStatus: 'approved', imageUrl: 'https://picsum.photos/seed/lf1/400/300' },
    { id: 2, itemName: "مجموعة مفاتيح", description: "مجموعة مفاتيح بها ميدالية سيارة", location: "مول سيتي بلازا", date: "2023-08-09", reporterName: "سارة حسن", reporterContact: "01234567890", status: 'found', moderationStatus: 'pending' },
    { id: 3, itemName: "هاتف محمول", description: "هاتف آيفون أزرق اللون", location: "الحي الأول", date: "2023-08-12", reporterName: "محمد السيد", reporterContact: "01123456789", status: 'lost', moderationStatus: 'rejected' },
    { id: 4, itemName: "قطة صغيرة", description: "قطة سيامي صغيرة تائهة", location: "بجوار بوابة 1", date: "2023-08-11", reporterName: "فاطمة محمود", reporterContact: "01567891234", status: 'found', moderationStatus: 'approved', imageUrl: 'https://picsum.photos/seed/lf2/400/300' },
];

export const mockInternalSupervisor: Supervisor = { name: "محمد عبد الله", phone: "01001122334" };
export const mockExternalSupervisor: Supervisor = { name: "حسن إبراهيم", phone: "01112233445" };

export const mockInternalDrivers: Driver[] = [
    { id: 1, name: "أحمد علي", phone: "01234567890", avatar: 'https://picsum.photos/seed/d1/200/200' },
    { id: 2, name: "محمود السيد", phone: "01098765432", avatar: 'https://picsum.photos/seed/d2/200/200' },
    { id: 3, name: "كريم حسن", phone: "01112345678", avatar: 'https://picsum.photos/seed/d3/200/200' },
    { id: 4, name: "طارق محمد", phone: "01555555555", avatar: 'https://picsum.photos/seed/d4/200/200' },
];

export const mockWeeklySchedule: WeeklyScheduleItem[] = [
    { day: "الجمعة", drivers: [{ name: "أحمد علي", phone: "01234567890" }] },
    { day: "السبت", drivers: [{ name: "محمود السيد", phone: "01098765432" }, { name: "كريم حسن", phone: "01112345678" }] },
    { day: "الأحد", drivers: [{ name: "طارق محمد", phone: "01555555555" }, { name: "أحمد علي", phone: "01234567890" }] },
    { day: "الإثنين", drivers: [{ name: "محمود السيد", phone: "01098765432" }] },
    { day: "الثلاثاء", drivers: [{ name: "كريم حسن", phone: "01112345678" }, { name: "طارق محمد", phone: "01555555555" }] },
    { day: "الأربعاء", drivers: [{ name: "أحمد علي", phone: "01234567890" }] },
    { day: "الخميس", drivers: [{ name: "محمود السيد", phone: "01098765432" }, { name: "طارق محمد", phone: "01555555555" }] },
];

export const mockExternalRoutes: ExternalRoute[] = [
    { id: 1, name: "خط العباسية", timings: ["07:00 ص", "03:00 م"], waitingPoint: "أمام بوابة المدينة الرئيسية" },
    { id: 2, name: "خط رمسيس", timings: ["07:30 ص", "03:30 م"], waitingPoint: "أمام بوابة المدينة الرئيسية" },
    { id: 3, name: "خط مدينة نصر", timings: ["08:00 ص", "04:00 م"], waitingPoint: "بجوار مول سيتي بلازا" },
];

const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

export const mockScheduleOverrides: ScheduleOverride[] = [
    { date: yesterday.toISOString().split('T')[0], drivers: [{ name: "كريم حسن", phone: "01112345678" }] }
];

export const mockDiscussionCircles: DiscussionCircle[] = [
    { id: 1, name: 'نقاش عام', description: 'مناقشات عامة تهم سكان المدينة', category: 'عام' },
    { id: 2, name: 'سكان الحي الأول', description: 'كل ما يخص سكان الحي الأول وتجمعاتهم', category: 'أحياء سكنية' },
    { id: 3, name: 'ملاك كمبوند الياسمين', description: 'للتواصل بين ملاك كمبوند الياسمين', category: 'كمبوندات' },
];

const mockComments: CommunityComment[] = [
  { id: 101, authorId: 2, content: 'فكرة ممتازة! بالتوفيق', timestamp: '2023-08-15T11:00:00Z' },
  { id: 102, authorId: 3, content: 'هل يوجد مكان مخصص للأطفال؟', timestamp: '2023-08-15T12:30:00Z', reports: [{ reporterId: 4, reason: 'Spam', timestamp: '2023-08-15T12:35:00Z' }] },
];

export const mockCommunityPosts: CommunityPost[] = [
    { id: 1, circleId: 1, authorId: 1, content: 'ما هو أفضل مكان لشراء مستلزمات المدارس في المدينة؟', timestamp: '2023-08-15T10:00:00Z', likes: 15, comments: mockComments },
    { id: 2, circleId: 2, authorId: 4, content: 'يا جماعة في مشكلة في إضاءة الشارع الرئيسي بالحي، هل حد لاحظ؟', timestamp: '2023-08-14T20:00:00Z', likes: 22, comments: [], reports: [{ reporterId: 1, reason: 'Not relevant', timestamp: '2023-08-14T21:00:00Z' }] },
    { id: 3, circleId: 1, authorId: 5, content: 'صورة جميلة لحديقة هليو بارك اليوم.', imageUrl: 'https://picsum.photos/seed/cp1/800/600', timestamp: '2023-08-13T18:00:00Z', likes: 50, comments: [] },
];

export const mockForSaleItems: ForSaleItem[] = [
    { id: 1, authorId: 1, title: 'دراجه هوائية بحالة ممتازة', description: 'استخدام خفيف جداً، سبب البيع عدم الحاجة', category: 'رياضة', price: 1200, images: ['https://picsum.photos/seed/fs1/400/300'], contactName: 'أحمد', contactPhone: '01012345678', status: 'approved', creationDate: '2023-08-01', expiryDate: '2023-09-01' },
    { id: 2, authorId: 2, title: 'مكتبة تليفزيون مودرن', description: 'بحالة الجديد، خشب mdf عالي الجودة', category: 'أثاث', price: 800, images: ['https://picsum.photos/seed/fs2/400/300'], contactName: 'فاطمة', contactPhone: '01123456789', status: 'pending', creationDate: '2023-08-10' },
    { id: 3, authorId: 3, title: 'أدوات مطبخ كاملة', description: 'لم تستخدم، مناسبة لعروسين', category: 'أدوات منزلية', price: 2500, images: ['https://picsum.photos/seed/fs3/400/300'], contactName: 'محمد', contactPhone: '01234567890', status: 'expired', creationDate: '2023-07-01', expiryDate: '2023-08-01' },
];

export const mockJobs: JobPosting[] = [
    { id: 1, authorId: 4, title: 'مطلوب محاسب لشركة بالمدينة', companyName: 'شركة النور', location: 'هليوبوليس الجديدة', jobType: 'دوام كامل', description: 'خبرة من 2-4 سنوات، إجادة برامج الأوفيس.', contactInfo: 'يرجى إرسال السيرة الذاتية على jobs@elnour.com', status: 'approved', creationDate: '2023-08-05', expiryDate: '2023-09-05' },
    { id: 2, authorId: 5, title: 'مدرس لغة إنجليزية للمرحلة الابتدائية', companyName: 'مركز تعليمي', location: 'الحي الثاني', jobType: 'دوام جزئي', description: 'مواعيد مسائية، خبرة في التعامل مع الأطفال.', contactInfo: 'للتواصل: 01011223344', status: 'pending', creationDate: '2023-08-11' },
];
