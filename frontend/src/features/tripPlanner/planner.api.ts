// طلب الخطة الذكية من الباك إند (LLM)
// الباك إند يرجع id بس، والأسماء والصور نأخذها من بياناتنا هنا
import type { Language } from '../../types';
import { services } from '../booking/booking.data';
import { resolvePlace } from './planner.utils';
import type { Interest, PlanInsight, SmartPlan, TripPace, TripPreferences } from './planner.types';

interface SmartPlanResponse {
  understanding: { travelers: string; tripDays: number; pace: TripPace; interests: Interest[]; summary: string };
  insights: PlanInsight[];
  stay: { hotelId: string; reason: string } | null;
  days: { day: number; theme: string; activities: { time: string; placeId: string; reason: string }[] }[];
}

export async function fetchSmartPlan(preferences: TripPreferences, lang: Language): Promise<SmartPlan> {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...preferences, lang }),
  });

  if (!response.ok) throw new Error(`Plan request failed: ${response.status}`);

  const data: SmartPlanResponse = await response.json();
  const hotel = data.stay && services.find(service => service.id === data.stay?.hotelId);

  return {
    request: preferences.request,
    understanding: data.understanding,
    insights: data.insights,
    stay: hotel && data.stay
      ? { hotelId: hotel.id, title: hotel.name, titleAr: hotel.nameAr, image: hotel.image, reason: data.stay.reason }
      : null,
    days: data.days.map(day => ({
      day: day.day,
      theme: day.theme,
      activities: day.activities.flatMap(activity => {
        const place = resolvePlace(activity.placeId);
        // لو المكان مو موجود عندنا نتجاهله
        return place ? [{ ...place, time: activity.time, reason: activity.reason }] : [];
      }),
    })),
  };
}
