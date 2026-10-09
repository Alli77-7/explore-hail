# Explore Hail — منصة سياحية ذكية لمنطقة حائل

مشروع تخرج: واجهة أمامية (Frontend) مبنية بـ **React + Vite + TypeScript**.

## التشغيل

```bash
npm install      # تثبيت الحزم (مرة وحدة فقط)
npm run dev      # تشغيل الموقع على http://localhost:5173
npm run build    # بناء نسخة النشر داخل مجلد dist
npm run preview  # معاينة نسخة النشر
```

## هيكل المشروع

```text
src/
├── main.tsx                 نقطة البداية
├── app/
│   ├── App.tsx              التصميم العام (Navbar + الصفحة + Footer)
│   ├── router.tsx           الروابط: / , /attractions , /booking , /translation , /trip-planner
│   └── providers.tsx        يلف التطبيق بـ اللغة + الثيم
├── components/
│   ├── layout/              Navbar, Footer, PageHeader, BackToTop
│   └── ui/                  Button, Badge, Card, Rating, SectionTitle, FilterPills,
│                            LanguageSwitcher, ThemeToggle, Modal, Toast
├── features/                كل ميزة في مجلد مستقل
│   ├── home/                Hero, SmartTourismFeatures, StatsSection, FeaturedDestinations
│   ├── attractions/         البيانات + الأنواع + AttractionCard, AttractionFilters, AttractionDetails
│   ├── booking/             البيانات + الأنواع + ServiceCard, ServiceFilters, BookingForm
│   ├── translation/         TranslationSteps, ImageUploader, TranslationResult
│   └── tripPlanner/         PlannerForm, TripTimeline, RecommendedPartners + منطق بناء الجدول
├── contexts/                LanguageContext (عربي/إنجليزي), ThemeContext (ليلي/نهاري)
├── hooks/                   useLanguage, useTheme, useScrollReveal, useToast
├── utils/                   translations.ts (نصوص الواجهة), helpers.ts
├── types/                   أنواع مشتركة (Language, Theme, FilterOption)
├── assets/images/           attractions, hotels, restaurants, cafes, tours, branding, translation
└── styles/                  variables.css, globals.css, animations.css, responsive.css
```

**القاعدة:** كل ميزة = صفحة (Page) + مكوّنات (components) + بيانات (data) + أنواع (types) + تنسيق (css).

## أين البيانات؟

| البيانات | الملف |
|---|---|
| المعالم السياحية | `src/features/attractions/attractions.data.ts` |
| الفنادق والمطاعم والكوفيهات والمحميات والسيارات | `src/features/booking/booking.data.ts` |
| الجهات المقترحة في مخطط الرحلات | تُؤخذ من `booking.data.ts` (بدون تكرار) |
| نصوص الواجهة بالعربي والإنجليزي | `src/utils/translations.ts` |

## اللغة والثيم

- `LanguageContext` يحفظ اللغة في `localStorage` ويغيّر `dir` بين `rtl` و `ltr` تلقائياً.
- داخل أي مكوّن: `const { t, pick } = useLanguage();`
  - `t('heroTitle')` → نص من ملف الترجمات
  - `pick(item.name, item.nameAr)` → يختار الاسم حسب اللغة
- `ThemeContext` يحط `data-theme="dark"` على `<html>`، والألوان تتغير من `variables.css` فقط.

## فيديو الواجهة (لاحقاً)

حط الفيديو في `src/assets/videos/hail-drone.mp4` ثم في `HomePage.tsx`:

```tsx
import droneVideo from '../../assets/videos/hail-drone.mp4';
<Hero videoSrc={droneVideo} />
```

## ميزات تجريبية (Prototype)

- **ترجمة النقوش الثمودية:** التحليل والنتيجة محاكاة لعرض الواجهة فقط، وليست ترجمة علمية.
- **الحجز:** الطلب ما يُرسل لسيرفر، يظهر تأكيد فقط.
- **أرقام التواصل** في بيانات الخدمات أرقام توضيحية.

## الصور

صور المعالم والخدمات صور حقيقية من مصادر عامة على الإنترنت (قوقل)، وحقوقها لأصحابها.
مناسبة للعرض الأكاديمي، ولو بيُنشر الموقع رسمياً لازم أخذ إذن أصحاب الصور.
