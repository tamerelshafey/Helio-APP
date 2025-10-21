# لوحة تحكم تطبيق Helio

مرحباً بك في المستودع الخاص بلوحة تحكم تطبيق Helio. هذا المستند هو دليلك الشامل كمهندس واجهة خلفية (Backend) لفهم بنية المشروع، وكيفية التكامل معه، ونقاط النهاية (API Endpoints) المطلوبة.

---

## 1. نظرة عامة على المشروع

لوحة التحكم هذه هي واجهة إدارية شاملة مصممة لإدارة جميع جوانب تطبيق Helio، وهو تطبيق يخدم سكان مدينة هليوبوليس الجديدة. تتيح اللوحة للمسؤولين إدارة المستخدمين، الخدمات، العقارات، الأخبار، المحتوى العام، وغيرها من الوحدات الأساسية للتطبيق.

---

## 2. التقنيات المستخدمة (Tech Stack)

تم بناء الواجهة الأمامية باستخدام التقنيات التالية:

- **React 19:** لإدارة وبناء واجهة المستخدم.
- **TypeScript:** لضمان سلامة الأنواع (Type Safety) وجعل الكود أكثر قوة وموثوقية.
- **Tailwind CSS:** لبناء واجهة مستخدم سريعة ومتجاوبة.
- **React Router:** لإدارة التنقل بين الصفحات (Routing).
- **TanStack Query (React Query):** لإدارة حالة الخادم (Server State) وجلب البيانات من الـ API بكفاءة عالية (Caching, Retries, etc.).
- **Recharts:** لعرض الرسوم البيانية والإحصائيات.

---

## 3. هيكل المشروع (Project Structure)

فهم هيكل الملفات سيساعدك على معرفة أماكن التكامل. الملفات والمجلدات الرئيسية تقع داخل مجلد `src/`:

```
src/
├── api/             # ✨ [مهم جداً] طبقة الخدمة (Service Layer). هنا تتم جميع استدعاءات الـ API.
├── components/      # مكونات React القابلة لإعادة الاستخدام (أزرار، بطاقات، نماذج).
├── context/         # إدارة الحالة العامة للتطبيق (UI State, Auth State).
├── data/            # [مؤقت] ملفات البيانات الوهمية (Mock Data) التي سيتم استبدالها ببيانات الـ API.
├── pages/           # المكونات الرئيسية التي تمثل كل صفحة في التطبيق (لوحة التحكم، صفحة المستخدمين، إلخ).
└── types.ts         # ✨ [مهم جداً] العقد (Contract) بين الواجهة الأمامية والخلفية. يحدد أشكال البيانات (Data Shapes) المتوقعة من الـ API.
```

---

## 4. دليل التكامل مع الـ API (API Integration Guide)

التعاون بيننا سيعتمد بشكل أساسي على ثلاثة مفاهيم: **عقد الـ API**، **طبقة الخدمة**، و**إدارة حالة الخادم**.

### أ. عقد الـ API (`types.ts`)

هذا الملف هو أهم ملف للتعاون بيننا. إنه يمثل "العقد" الذي يحدد شكل وهيكل كل جزء من البيانات التي يجب أن يرجعها الـ API.

**مثال:** الواجهة `Service` في `types.ts` تحدد بالضبط الحقول والأنواع التي تتوقعها الواجهة الأمامية عند طلب بيانات خدمة معينة. **الرجاء الالتزام بهذه الهياكل في استجابات الـ API الخاصة بك.**

### ب. طبقة الخدمة (`src/api/`)

هذا المجلد يحتوي على جميع الوظائف المسؤولة عن التواصل مع الـ API. حالياً، هذه الوظائف تقوم بإرجاع بيانات وهمية مع تأخير محاكى للشبكة.

**مهمتك** هي استبدال محتوى هذه الوظائف باستدعاءات `fetch` أو `axios` حقيقية لنقاط النهاية (Endpoints) الخاصة بك.

**مثال حالي (وهمي) في `src/api/dashboardApi.ts`:**
```typescript
import { mockServices } from '../data/mock-data';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getDashboardStats = async () => {
  await delay(800);
  // ... منطق حساب الإحصائيات من البيانات الوهمية
  return { services: { total: mockServices.length, ... } };
};
```

**المطلوب منك (مثال حقيقي):**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // سيتم إضافته لاحقاً

export const getDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
};
```

### ج. إدارة حالة الخادم (TanStack Query)

تستخدم الواجهة الأمامية `TanStack Query` لجلب البيانات.
- **`useQuery`:** يستخدم لعمليات القراءة (GET). يقوم تلقائياً بالتخزين المؤقت (caching) وإعادة جلب البيانات.
- **`useMutation`:** يستخدم لعمليات الكتابة (POST, PUT, DELETE). بعد كل عملية ناجحة، نقوم بإلغاء صلاحية البيانات ذات الصلة (`invalidateQueries`)، مما يدفع `useQuery` لإعادة جلبها وتحديث الواجهة تلقائياً.

**لماذا هذا مهم لك؟**
لأفضل تجربة مستخدم، يفضل أن تقوم عمليات `POST` و `PUT` بإرجاع الكائن (Object) الذي تم إنشاؤه أو تحديثه في الاستجابة (Response Body).

---

## 5. نقاط النهاية المطلوبة (Required API Endpoints)

هذه هي قائمة شاملة لنقاط النهاية التي تحتاج الواجهة الأمامية إليها.

### Dashboard API
- `GET /api/dashboard/stats`: لإرجاع إحصائيات عامة للبطاقات الرئيسية.
- `GET /api/dashboard/user-growth`: لإرجاع بيانات نمو المستخدمين (مثلاً، لآخر 6 أشهر).
- `GET /api/dashboard/recent-activities`: لإرجاع آخر 5-10 أنشطة رئيسية في النظام.
- `GET /api/dashboard/alerts`: لإرجاع التنبيهات الفورية (تسجيل مستخدم جديد، إلخ).
- `GET /api/dashboard/pending-users`: لإرجاع قائمة المستخدمين الذين ينتظرون التفعيل.

### Authentication API
- `POST /api/auth/login`: لتسجيل دخول المسؤول. يجب أن يرجع بيانات `AdminUser` و Token.
- `POST /api/auth/logout`: لتسجيل الخروج.
- `GET /api/auth/me`: لجلب بيانات المسؤول الحالي باستخدام Token.

### Services & Categories API
- `GET /api/categories`: جلب كل الفئات الرئيسية والفرعية.
- `POST /api/categories`: إضافة فئة رئيسية جديدة.
- `PUT /api/categories/:id`: تعديل فئة رئيسية.
- `DELETE /api/categories/:id`: حذف فئة رئيسية (فقط إذا كانت فارغة).
- `POST /api/categories/:id/subcategories`: إضافة فئة فرعية.
- `PUT /api/subcategories/:id`: تعديل فئة فرعية.
- `DELETE /api/subcategories/:id`: حذف فئة فرعية (فقط إذا كانت فارغة).
- `GET /api/services`: جلب كل الخدمات (مع إمكانية الفلترة حسب الفئة الفرعية).
- `GET /api/services/:id`: جلب خدمة معينة.
- `POST /api/services`: إضافة خدمة جديدة.
- `PUT /api/services/:id`: تعديل خدمة.
- `DELETE /api/services/:id`: حذف خدمة.
- `PATCH /api/services/:id/toggle-favorite`: تفعيل/إلغاء تفعيل المفضلة.

### Reviews API
- `PUT /api/services/:serviceId/reviews/:reviewId`: تعديل محتوى تقييم.
- `POST /api/services/:serviceId/reviews/:reviewId/reply`: إضافة أو تعديل رد المدير.
- `DELETE /api/services/:serviceId/reviews/:reviewId`: حذف تقييم.

### Properties API
- `GET /api/properties`: جلب كل العقارات.
- `POST /api/properties`: إضافة عقار جديد.
- `PUT /api/properties/:id`: تعديل عقار.
- `DELETE /api/properties/:id`: حذف عقار.

### Content (News, Notifications, Ads) API
- `GET /api/news`: جلب كل الأخبار.
- `POST /api/news`: إضافة خبر جديد.
- `PUT /api/news/:id`: تعديل خبر.
- `DELETE /api/news/:id`: حذف خبر.
- `GET /api/notifications`: جلب كل الإشعارات.
- `POST /api/notifications`: إضافة إشعار جديد.
- `PUT /api/notifications/:id`: تعديل إشعار.
- `DELETE /api/notifications/:id`: حذف إشعار.
- `GET /api/ads`: جلب كل الإعلانات.
- `POST /api/ads`: إضافة إعلان جديد.
- `PUT /api/ads/:id`: تعديل إعلان.
- `DELETE /api/ads/:id`: حذف إعلان.

### User Management API
- `GET /api/users`: جلب كل مستخدمي التطبيق (`AppUser`).
- `PUT /api/users/:id`: تعديل بيانات مستخدم (بما في ذلك الحالة ونوع الحساب).
- `DELETE /api/users`: حذف مجموعة من المستخدمين (Bulk Delete).
- `GET /api/admins`: جلب كل المسؤولين (`AdminUser`).
- `POST /api/admins`: إضافة مسؤول جديد.
- `PUT /api/admins/:id`: تعديل بيانات مسؤول.
- `DELETE /api/admins/:id`: حذف مسؤول.

### General App Content API
- `GET /api/emergency-contacts`: جلب أرقام الطوارئ.
- `POST /api/emergency-contacts`: إضافة رقم.
- `PUT /api/emergency-contacts/:id`: تعديل رقم.
- `DELETE /api/emergency-contacts/:id`: حذف رقم.
- `GET /api/service-guides`: جلب أدلة خدمات المدينة.
- `POST /api/service-guides`: إضافة دليل.
- `PUT /api/service-guides/:id`: تعديل دليل.
- `DELETE /api/service-guides/:id`: حذف دليل.
- `GET /api/public-content`: جلب محتوى الصفحات العامة (الرئيسية، حول، الأسئلة الشائعة).
- `PUT /api/public-content/:page`: تحديث محتوى صفحة معينة.
- `GET /api/audit-logs`: جلب سجل التدقيق.

### Community & Marketplace API
- `GET /api/discussion-circles`: جلب دوائر النقاش.
- `POST /api/discussion-circles`: إضافة دائرة.
- `PUT /api/discussion-circles/:id`: تعديل دائرة.
- `DELETE /api/discussion-circles/:id`: حذف دائرة.
- `GET /api/community-posts`: جلب كل المنشورات والتعليقات.
- `PUT /api/community-posts/:id`: تعديل منشور.
- `DELETE /api/community-posts/:id`: حذف منشور.
- `PUT /api/community-posts/:postId/comments/:commentId`: تعديل تعليق.
- `DELETE /api/community-posts/:postId/comments/:commentId`: حذف تعليق.
- `POST /api/community-posts/:id/dismiss-reports`: تجاهل البلاغات على منشور.
- `POST /api/community-posts/:postId/comments/:commentId/dismiss-reports`: تجاهل البلاغات على تعليق.
- `GET /api/marketplace/sale-items`: جلب إعلانات البيع والشراء.
- `GET /api/marketplace/jobs`: جلب إعلانات الوظائف.
- `GET /api/lost-and-found`: جلب عناصر المفقودات.
- `POST /api/marketplace/items/:id/approve`: الموافقة على عنصر في السوق.
- `POST /api/marketplace/items/:id/reject`: رفض عنصر في السوق.
- `DELETE /api/marketplace/items/:id`: حذف عنصر من السوق.
- `POST /api/lost-and-found/:id/approve`: الموافقة على عنصر مفقودات.
- `POST /api/lost-and-found/:id/reject`: رفض عنصر مفقودات.
- `DELETE /api/lost-and-found/:id`: حذف عنصر مفقودات.

### Offers API
- `GET /api/offers`: جلب كل العروض.
- `POST /api/offers`: إضافة عرض.
- `PUT /api/offers/:id`: تعديل عرض.
- `DELETE /api/offers/:id`: حذف عرض.
- `GET /api/offers/:id/codes`: جلب الأكواد الخاصة بعرض معين.
- `DELETE /api/offer-codes/:id`: حذف كود.
- `PATCH /api/offer-codes/:id/toggle-redemption`: تفعيل/إلغاء استخدام كود.

---

شكراً لتعاونك. إذا كان لديك أي أسئلة، فلا تتردد في التواصل.
