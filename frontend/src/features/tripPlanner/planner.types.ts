// أنواع مخطط الرحلات

export type Interest = 'nature' | 'history' | 'adventure' | 'food';

export type TripPace = 'relaxed' | 'balanced' | 'packed';

// اختيارات المستخدم: الطلب الحر + الاختيارات السريعة
export interface TripPreferences {
  request: string;
  interests: Interest[];
  days: number;
}

// نوع النشاط يحدد الصورة والعنوان الصغير اللي فوقه
export type ActivityKind = 'attraction' | 'restaurant' | 'cafe' | 'lunch' | 'rest';

// نشاط واحد داخل اليوم، مثال: 09:00 جبال أجا
export interface PlanActivity {
  time: string;
  kind: ActivityKind;
  title: string;
  titleAr: string;
  image?: string;
  mapsUrl?: string;
  // سبب اختيار النشاط (يجي من الخطة الذكية فقط، بلغة الطلب)
  reason?: string;
}

export interface PlanDay {
  day: number;
  theme?: string;
  activities: PlanActivity[];
}

// "قلت لي" ← "فسويت لك"
export interface PlanInsight {
  quote: string;
  decision: string;
}

export interface SmartPlan {
  request: string;
  understanding: {
    travelers: string;
    tripDays: number;
    pace: TripPace;
    interests: Interest[];
    summary: string;
  };
  insights: PlanInsight[];
  stay: { hotelId: string; title: string; titleAr: string; image: string; reason: string } | null;
  days: PlanDay[];
}
