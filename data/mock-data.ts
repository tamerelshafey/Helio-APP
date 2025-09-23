import type { Category, Service, Review, News, Notification, Property, EmergencyContact, ServiceGuide, AppUser, AdminUser, Supervisor, Driver, WeeklyScheduleItem, ExternalRoute } from '../types';

export const mockReviews: Review[] = [
    { id: 1, username: 'أحمد محمود', avatar: 'https://picsum.photos/101', rating: 5, comment: 'خدمة ممتازة وتجربة رائعة! أنصح به بشدة.', date: '2024-07-10', adminReply: 'شكراً لتقييمك! نسعد بخدمتك دائماً.' },
    { id: 2, username: 'فاطمة الزهراء', avatar: 'https://picsum.photos/102', rating: 4, comment: 'المكان جميل والخدمة جيدة، لكن الأسعار مرتفعة قليلاً.', date: '2024-07-08' },
    { id: 3, username: 'خالد العتيبي', avatar: 'https://picsum.photos/103', rating: 3, comment: 'التأخير في تقديم الخدمة كان ملحوظاً.', date: '2024-07-05', adminReply: 'نعتذر عن التأخير، نعمل على تحسين سرعة الخدمة.' },
    { id: 4, username: 'سارة عبدالله', avatar: 'https://picsum.photos/106', rating: 5, comment: 'كل شيء كان مثالياً، شكراً لكم.', date: '2024-07-02' },
];

export const mockServices: Service[] = [
    // مطاعم (subCategoryId: 301)
    {
        id: 1, subCategoryId: 301, name: "مطعم ومقهى هيليو", images: ["https://picsum.photos/800/600?random=1", "https://picsum.photos/800/600?random=2", "https://picsum.photos/800/600?random=3", "https://picsum.photos/800/600?random=4"],
        address: "المنطقة الأولى، هليوبوليس الجديدة", phone: "011-123-4567", whatsapp: "966501234567",
        about: "نقدم أشهى المأكولات الشرقية والغربية في أجواء عصرية ومريحة. لدينا جلسات داخلية وخارجية لتناسب جميع الأذواق.",
        rating: 4.5, reviews: mockReviews, facebookUrl: "#", instagramUrl: "#", isFavorite: true, views: 4821, creationDate: '2024-07-20'
    },
    {
        id: 2, subCategoryId: 301, name: "مطعم أسماك المحيط", images: ["https://picsum.photos/800/600?random=10"],
        address: "مول سيتي بلازا", phone: "012-987-6543", whatsapp: "966509876543",
        about: "أفضل المأكولات البحرية الطازجة والمعدة على أيدي أمهر الطهاة.",
        rating: 4.8, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: false, views: 3560, creationDate: '2024-07-15'
    },
    // كافيهات (subCategoryId: 302)
    {
        id: 3, subCategoryId: 302, name: "كافيه روز جاردن", images: ["https://picsum.photos/800/600?random=110"],
        address: "مول سيتي بلازا، الطابق الأرضي", phone: "012-345-6789", whatsapp: "966509876543",
        about: "مكان مثالي للاسترخاء مع الأصدقاء والاستمتاع بأفضل أنواع القهوة والمشروبات المنعشة والحلويات اللذيذة.",
        rating: 4.7, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: false, views: 5123, creationDate: '2024-06-30'
    },
    // مستشفيات (subCategoryId: 201)
     {
        id: 4, subCategoryId: 201, name: "مستشفى هليوبوليس المركزي", images: ["https://picsum.photos/800/600?random=5", "https://picsum.photos/800/600?random=6"],
        address: "الحي الطبي، هليوبوليس الجديدة", phone: "02-555-0100", whatsapp: "966555010010",
        about: "مستشفى متكامل يقدم خدمات طبية على مدار 24 ساعة في جميع التخصصات.",
        rating: 4.2, reviews: [], facebookUrl: "#", instagramUrl: "#", isFavorite: true, views: 6890, creationDate: '2024-06-10'
    },
];

export const mockCategories: Category[] = [
    {
        id: 1, name: "المدينة والجهاز", icon: 'BuildingLibraryIcon',
        subCategories: [
            { id: 105, name: "تعريف بشركة مصر الجديده (المالك)" },
            { id: 101, name: "التعريف بالمدينة" },
        ]
    },
    {
        id: 2, name: "الصحة", icon: 'HeartIcon',
        subCategories: [
            { id: 201, name: "مستشفيات" },
            { id: 202, name: "مراكز طبية" },
            { id: 203, name: "أطباء" },
            { id: 204, name: "صيدليات" },
        ]
    },
    {
        id: 3, name: "الطعام والشراب", icon: 'CakeIcon',
        subCategories: [
            { id: 301, name: "مطاعم" },
            { id: 302, name: "كافيهات" },
            { id: 303, name: "سوبر ماركت" },
        ]
    },
    {
        id: 4, name: "التعليم", icon: 'AcademicCapIcon',
        subCategories: [
            { id: 401, name: "مدارس" },
            { id: 402, name: "حضانات" },
        ]
    },
    {
        id: 5, name: "التسوق", icon: 'ShoppingBagIcon',
        subCategories: [
            { id: 501, name: "سوبر ماركت وعطارة" },
            { id: 502, name: "مخابز" },
            { id: 503, name: "أسواق خضار وفاكهة" },
            { id: 504, name: "طيور وجزارة وأسماك" },
            { id: 505, name: "محلات ملابس واكسسوات" },
            { id: 506, name: "محلات أدوات منزلية" }
        ]
    },
    {
        id: 6, name: "تكنولوجيا واتصالات", icon: 'DevicePhoneMobileIcon',
        subCategories: [
            { id: 601, name: "أنظمة مراقبة والانتركم" },
            { id: 602, name: "الكترونيات" },
            { id: 603, name: "انترنت ودش" },
            { id: 604, name: "خدمات المحمول" }
        ]
    },
    {
        id: 7, name: "اللياقة البدنية", icon: 'BoltIcon',
        subCategories: [
            { id: 701, name: "صالات الجيم" },
            { id: 702, name: "مدربين شخصيين" },
            { id: 703, name: "اكاديمات رياضية" },
            { id: 704, name: "نوادي رياضية" }
        ]
    },
    {
        id: 8, name: "الجمال والعناية الشخصية", icon: 'SparklesIcon',
        subCategories: [
            { id: 801, name: "صالون تجميل" },
            { id: 802, name: "مستحضرات تجميل" },
            { id: 803, name: "منتجات العناية بالبشرة" },
            { id: 804, name: "مراكز سبا" }
        ]
    },
    {
        id: 9, name: "الصيانه والخدمات المنزلية", icon: 'WrenchScrewdriverIcon',
        subCategories: [
            { id: 901, name: "سباكة وكهرباء" },
            { id: 902, name: "نظافة منزلية" },
            { id: 903, name: "صيانه الأجهزة الكهربائية" },
            { id: 904, name: "صيانة البوتاجاز والسخان" },
            { id: 905, name: "صيانه وتركيب التكييفات" },
            { id: 906, name: "مغسلة ومكوجي" }
        ]
    },
    {
        id: 10, name: "السيارات", icon: 'CarIcon',
        subCategories: [
            { id: 1001, name: "ورش السيارات" },
            { id: 1002, name: "قطع غيار" },
            { id: 1003, name: "محطات وقود" },
            { id: 1004, name: "غسيل سيارات" }
        ]
    },
    {
        id: 11, name: "خدمات متنوعة", icon: 'Squares2X2Icon',
        subCategories: [
            { id: 1101, name: "تصوير ومونتاج" },
            { id: 1102, name: "خدمات توصيل" },
            { id: 1103, name: "خدمات لاند سكيب" },
            { id: 1104, name: "خدمات مصرفية" },
            { id: 1105, name: "العناية بالحيوانات الاليفة" }
        ]
    },
    {
        id: 12, name: "أنشطة وفعاليات", icon: 'GiftIcon',
        subCategories: [
            { id: 1201, name: "أنشطة الأطفال" },
            { id: 1202, name: "مراكز ترفية" },
            { id: 1203, name: "دورات ومهارات" }
        ]
    },
    {
        id: 13, name: "التشطيبات", icon: 'PaintBrushIcon',
        subCategories: [
            { id: 1301, name: "شركات او مقاول تشطيب" },
            { id: 1302, name: "تشطيب كهرباء" },
            { id: 1303, name: "تشطيب سباكة" },
            { id: 1304, name: "تشطيب محارة واعمال جبس" },
            { id: 1305, name: "تشطيب دهانات" },
            { id: 1306, name: "تشطيب سيراميك ورخام" },
            { id: 1307, name: "باب وشباك" },
            { id: 1308, name: "الموان" },
            { id: 1309, name: "تشطيبات خارجية" }
        ]
    }
];

export const mockNews: News[] = [
    {
        id: 1,
        title: "افتتاح المرحلة الأولى من النادي الاجتماعي بهليوبوليس الجديدة",
        content: "تم بحمد الله افتتاح المرحلة الأولى من النادي الاجتماعي، والتي تضم ملاعب وحمام سباحة، في حضور عدد من المسؤولين وسكان المدينة.",
        imageUrl: "https://picsum.photos/600/400?random=11",
        date: "2024-07-15",
        author: "إدارة المدينة",
        externalUrl: "#",
        views: 1205
    },
    {
        id: 2,
        title: "بدء تشغيل خطوط النقل الداخلي الجديدة",
        content: "لتسهيل حركة السكان داخل المدينة، تم تشغيل ثلاثة خطوط نقل داخلي جديدة تغطي كافة الأحياء والمناطق الحيوية.",
        imageUrl: "https://picsum.photos/600/400?random=12",
        date: "2024-07-10",
        author: "جهاز النقل",
        externalUrl: "#",
        views: 980
    },
    {
        id: 3,
        title: "حملة تشجير وتجميل مداخل المدينة",
        content: "شارك العشرات من السكان في حملة تجميل وتشجير المداخل الرئيسية للمدينة، مما يضفي مظهراً جمالياً وحضارياً.",
        imageUrl: "https://picsum.photos/600/400?random=13",
        date: "2024-07-05",
        author: "لجنة البيئة",
        views: 750
    },
    {
        id: 4,
        title: "جدول انقطاع المياه المخطط له لأعمال الصيانة",
        content: "نحيط علم سيادتكم بأنه سيتم قطع المياه عن المنطقة الثالثة يوم الثلاثاء القادم من الساعة 10 صباحاً حتى 4 عصراً لأعمال الصيانة الدورية.",
        imageUrl: "https://picsum.photos/600/400?random=14",
        date: "2024-07-02",
        author: "شركة المياه",
        views: 2100
    },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'عرض خاص في مطعم ومقهى هيليو!',
    content: 'استمتع بخصم 20% على جميع المأكولات والمشروبات عند زيارتك لنا هذا الأسبوع.',
    imageUrl: 'https://picsum.photos/400/200?random=101',
    serviceId: 1, // Link to "مطعم ومقهى هيليو"
    startDate: '2024-07-20',
    endDate: '2024-07-27',
  },
  {
    id: 2,
    title: 'صيانة طارئة لشبكة المياه',
    content: 'سيتم قطع المياه عن الحي الأول غداً من الساعة 10 صباحاً حتى 2 ظهراً لأعمال صيانة طارئة. نعتذر عن الإزعاج.',
    startDate: '2024-07-25',
    endDate: '2024-07-25',
    externalUrl: '#'
  },
  {
    id: 3,
    title: 'حملة تطعيم جديدة للأطفال',
    content: 'تعلن مستشفى هليوبوليس المركزي عن بدء حملة تطعيم شلل الأطفال من 1 أغسطس إلى 5 أغسطس.',
    imageUrl: 'https://picsum.photos/400/200?random=102',
    serviceId: 4, // Link to "مستشفى هليوبوليس المركزي"
    startDate: '2024-08-01',
    endDate: '2024-08-05',
  },
   {
    id: 4,
    title: 'إشعار قادم',
    content: 'هذا الإشعار لم يبدأ بعد.',
    startDate: '2025-01-01',
    endDate: '2025-01-05',
  },
   {
    id: 5,
    title: 'إشعار منتهي الصلاحية',
    content: 'هذا العرض انتهى الأسبوع الماضي.',
    startDate: '2024-07-01',
    endDate: '2024-07-07',
  },
];

export const mockProperties: Property[] = [
    {
        id: 1,
        title: "شقة فاخرة للبيع في كمبوند لايف بارك",
        description: "شقة بمساحة 180 متر مربع، تشطيب سوبر لوكس، 3 غرف نوم، 2 حمام، ريسبشن كبير، فيو مفتوح على حديقة.",
        images: ["https://picsum.photos/800/600?random=21", "https://picsum.photos/800/600?random=22"],
        location: { address: "كمبوند لايف بارك، هليوبوليس الجديدة" },
        type: 'sale',
        price: 2500000,
        contact: { name: "المالك", phone: "01001234567" },
        amenities: ["أمن 24 ساعة", "جراج خاص", "حديقة", "مصعد"],
        views: 1543,
        creationDate: '2024-07-18'
    },
    {
        id: 2,
        title: "فيلا للإيجار في حي الزهور",
        description: "فيلا مستقلة بمساحة 400 متر، حديقة خاصة 200 متر، حمام سباحة، 5 غرف نوم، مفروشة بالكامل.",
        images: ["https://picsum.photos/800/600?random=23", "https://picsum.photos/800/600?random=24"],
        location: { address: "الحي الثاني، فيلات، هليوبوليس الجديدة" },
        type: 'rent',
        price: 30000,
        contact: { name: "مكتب تسويق", phone: "01229876543" },
        amenities: ["حمام سباحة", "حديقة خاصة", "مفروشة بالكامل", "مطبخ مجهز"],
        views: 876,
        creationDate: '2024-07-05'
    },
    {
        id: 3,
        title: "دوبلكس للبيع بإطلالة مميزة",
        description: "دوبلكس 250 متر + روف 100 متر، موقع مميز على شارع رئيسي، نصف تشطيب، إمكانية التسهيلات في السداد.",
        images: ["https://picsum.photos/800/600?random=25", "https://picsum.photos/800/600?random=26"],
        location: { address: "الحي الثالث، هليوبوليس الجديدة" },
        type: 'sale',
        price: 3200000,
        contact: { name: "شركة التطوير العقاري", phone: "01117654321" },
        amenities: ["روف خاص", "فيو مفتوح", "قسط على سنتين"],
        views: 2041,
        creationDate: '2024-06-25'
    },
];

export const mockEmergencyContacts: EmergencyContact[] = [
    { id: 1, title: "رقم رئيس الجهاز", number: "0121234567", type: 'city' },
    { id: 2, title: "رقم مدير الامن", number: "0121234568", type: 'city' },
    { id: 3, title: "رقم خدمة العملاء", number: "0121234569", type: 'city' },
    { id: 4, title: "طوارئ كهرباء المدينة", number: "12348", type: 'city' },
    { id: 5, title: "طوارئ مياه المدينة", number: "12349", type: 'city' },
    { id: 6, title: "طوارئ غاز المدينة", number: "12350", type: 'city' },
    { id: 7, title: "طوارئ تليفونات المدينة", number: "12351", type: 'city' },
    { id: 8, title: "طلب الإسعاف", number: "123", type: 'national' },
    { id: 9, title: "أعطال الكهرباء", number: "121", type: 'national' },
    { id: 10, title: "الاستغاثة بالأمن العام", number: "115", type: 'national' },
    { id: 11, title: "الشكاوي الحكومية", number: "16528", type: 'national' },
    { id: 12, title: "الحالات الصحية الحرجة", number: "137", type: 'national' },
    { id: 13, title: "تسريب الغاز", number: "149-129", type: 'national' },
    { id: 14, title: "الإبلاغ عن جرائم المعلومات", number: "15008", type: 'national' },
    { id: 15, title: "شكاوي الاتصالات", number: "155", type: 'national' },
    { id: 16, title: "الاستغاثة بالطب الوقائي", number: "105", type: 'national' },
    { id: 17, title: "الصرف الصحي", number: "175", type: 'national' },
    { id: 18, title: "خدمات الطرق السريعة", number: "01221110000", type: 'national' },
    { id: 19, title: "إنقاذ المشردين", number: "16439", type: 'national' },
    { id: 20, title: "الخط الساخن لمكافحة الإدمان", number: "16023", type: 'national' },
    { id: 21, title: "الاستغاثة بالمطافئ", number: "180", type: 'national' },
    { id: 22, title: "الاستغاثة بشرطة النقل", number: "145", type: 'national' },
    { id: 23, title: "شرطة السياحة", number: "126", type: 'national' },
    { id: 24, title: "أعطال المياه", number: "125", type: 'national' },
    { id: 25, title: "طلب النجدة", number: "122", type: 'national' },
    { id: 26, title: "التواصل مع حماية المستهلك", number: "19588", type: 'national' },
    { id: 27, title: "الإبلاغ عن التحرش بالأطفال", number: "16000", type: 'national' },
];

export const mockServiceGuides: ServiceGuide[] = [
    {
        id: 1,
        title: "التقديم على عداد مياه",
        steps: [
            "تقديم طلب بالمركز التجاري لجهاز المدينة.",
            "سداد رسوم المعاينة والتوريد.",
            "إجراء المعاينة الفنية بواسطة الفني المختص.",
            "استلام العداد وتركيبه بعد استيفاء الشروط.",
        ],
        documents: [
            "صورة بطاقة الرقم القومي سارية.",
            "صورة عقد الملكية أو التخصيص.",
            "آخر إيصال سداد رسوم الصيانة.",
            "توكيل رسمي في حالة عدم حضور المالك.",
        ],
    },
    {
        id: 2,
        title: "التقديم على عداد كهرباء",
        steps: [
            "شراء كراسة الشروط من شركة الكهرباء.",
            "تقديم المستندات المطلوبة ودفع الرسوم.",
            "تحديد موعد للمعاينة الفنية.",
            "تركيب العداد بعد الموافقة.",
        ],
        documents: [
            "صورة بطاقة الرقم القومي.",
            "موافقة من جهاز المدينة.",
            "صورة رخصة البناء.",
        ],
    },
    {
        id: 3,
        title: "استخراج تصريح تشطيب",
        steps: [
            "تقديم طلب لإدارة التنمية بالجهاز.",
            "تحديد نوع التشطيبات (داخلية/خارجية).",
            "سداد تأمين أعمال قابل للاسترداد.",
            "الحصول على التصريح والبدء في الأعمال.",
        ],
        documents: [
            "صورة بطاقة المالك.",
            "صورة محضر استلام الوحدة.",
            "مخطط تفصيلي بالأعمال المطلوبة.",
        ],
    },
     {
        id: 4,
        title: "تصريح خروج أثاث",
        steps: [
            "التوجه لمكتب أمن الجهاز.",
            "إثبات ملكية الوحدة.",
            "تسجيل بيانات السيارة التي ستقوم بالنقل.",
            "الحصول على التصريح وتسليمه لأمن البوابة عند الخروج.",
        ],
        documents: [
            "أصل بطاقة الرقم القومي للمالك.",
            "صورة من عقد الملكية.",
            "آخر إيصال سداد صيانة.",
        ],
    },
];

export const mockUsers: AppUser[] = [
  { id: 1, name: 'أحمد المصري', email: 'ahmed.masri@example.com', avatar: 'https://picsum.photos/200/200?random=1', status: 'active', joinDate: '2023-05-12' },
  { id: 2, name: 'فاطمة الزهراء', email: 'fatima.z@example.com', avatar: 'https://picsum.photos/200/200?random=2', status: 'active', joinDate: '2023-06-20' },
  { id: 3, name: 'خالد عبدالله', email: 'khaled.a@example.com', avatar: 'https://picsum.photos/200/200?random=3', status: 'pending', joinDate: '2024-01-10' },
  { id: 4, name: 'سارة إبراهيم', email: 'sara.ibrahim@example.com', avatar: 'https://picsum.photos/200/200?random=4', status: 'banned', joinDate: '2023-03-15' },
  { id: 5, name: 'محمد حسين', email: 'mohamed.h@example.com', avatar: 'https://picsum.photos/200/200?random=5', status: 'active', joinDate: '2023-09-01' },
  { id: 6, name: 'نور الهدى', email: 'nour.h@example.com', avatar: 'https://picsum.photos/200/200?random=6', status: 'pending', joinDate: '2024-02-05' },
];

export const mockAdmins: AdminUser[] = [
  { id: 1, name: 'علي حسن', email: 'ali.hassan@helio.com', avatar: 'https://picsum.photos/200/200?random=11', role: 'مسؤول العقارات' },
  { id: 2, name: 'مريم أحمد', email: 'mariam.ahmed@helio.com', avatar: 'https://picsum.photos/200/200?random=12', role: 'مسؤول الاخبار والاعلانات والاشعارات' },
  { id: 3, name: 'يوسف خالد', email: 'youssef.khaled@helio.com', avatar: 'https://picsum.photos/200/200?random=13', role: 'مسؤول الباصات' },
  { id: 4, name: 'هند سالم', email: 'hind.salem@helio.com', avatar: 'https://picsum.photos/200/200?random=14', role: 'مسؤول ادارة الخدمات' },
];


// Transportation Data
export const mockInternalSupervisor: Supervisor = { name: 'أ. محمد عبدالسلام', phone: '012-3456-7890' };
export const mockExternalSupervisor: Supervisor = { name: 'أ. حسين فهمي', phone: '015-4321-0987' };
export const mockInternalDrivers: Driver[] = [
    { id: 1, name: 'أحمد المصري', phone: '010-1111-2222', avatar: 'https://picsum.photos/200/200?random=1' },
    { id: 2, name: 'خالد عبدالله', phone: '011-2222-3333', avatar: 'https://picsum.photos/200/200?random=3' },
    { id: 3, name: 'ياسر القحطاني', phone: '015-3333-4444', avatar: 'https://picsum.photos/200/200?random=7' },
    { id: 4, name: 'سعيد العويران', phone: '012-4444-5555', avatar: 'https://picsum.photos/200/200?random=8' },
];
export const mockWeeklySchedule: WeeklyScheduleItem[] = [
    { day: 'الأحد', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }] },
    { day: 'الإثنين', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }, { name: 'سعيد العويران', phone: '012-4444-5555' }] },
    { day: 'الثلاثاء', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
    { day: 'الأربعاء', drivers: [{ name: 'سعيد العويران', phone: '012-4444-5555' }] },
    { day: 'الخميس', drivers: [{ name: 'أحمد المصري', phone: '010-1111-2222' }, { name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
    { day: 'الجمعة', drivers: [{ name: 'خالد عبدالله', phone: '011-2222-3333' }] },
    { day: 'السبت', drivers: [{ name: 'ياسر القحطاني', phone: '015-3333-4444' }] },
];
export const mockExternalRoutes: ExternalRoute[] = [
    { id: 1, name: 'هليوبوليس الجديدة <> ميدان رمسيس', timings: ['07:00 ص', '09:00 ص', '02:00 م', '05:00 م'], waitingPoint: 'أمام البوابة الرئيسية للمدينة' },
    { id: 2, name: 'هليوبوليس الجديدة <> التجمع الخامس', timings: ['08:00 ص', '11:00 ص', '03:00 م', '06:00 م'], waitingPoint: 'بجوار مول سيتي بلازا' },
    { id: 3, name: 'هليوبوليس الجديدة <> مدينة نصر', timings: ['07:30 ص', '10:30 ص', '01:30 م', '04:30 م'], waitingPoint: 'أمام محطة الوقود' },
];