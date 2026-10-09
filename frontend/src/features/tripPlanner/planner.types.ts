// أنواع مخطط الرحلات

export type Interest = 'nature' | 'history' | 'adventure' | 'food';

export type TripDays = 1 | 2 | 3;

// اختيارات المستخدم
export interface TripPreferences {
  interests: Interest[];
  days: TripDays;
}

// نشاط واحد داخل اليوم، مثال: 09:00 — جبال أجا
export interface PlanActivity {
  time: string;
  title: string;
  titleAr: string;
}

export interface PlanDay {
  day: number;
  activities: PlanActivity[];
}
