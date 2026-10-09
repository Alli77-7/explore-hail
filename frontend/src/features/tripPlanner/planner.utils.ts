// منطق بناء الجدول بعيد عن واجهة React، عشان يكون سهل القراءة والاختبار
import { attractions } from '../attractions/attractions.data';
import { services } from '../booking/booking.data';
import { interestCategories } from './planner.data';
import type { PlanActivity, PlanDay, TripPreferences } from './planner.types';

type ResolvedPlace = Omit<PlanActivity, 'time' | 'reason'>;

// يحوّل id المكان (من الخطة الذكية أو المحلية) لاسم وصورة من بياناتنا
export function resolvePlace(placeId: string): ResolvedPlace | null {
  if (placeId === 'local-lunch') return { kind: 'lunch', title: 'Local lunch', titleAr: 'غداء محلي' };
  if (placeId === 'free-time') return { kind: 'rest', title: 'Free time to rest', titleAr: 'وقت حر للراحة' };

  const attraction = attractions.find(place => place.id === placeId);
  if (attraction) {
    return {
      kind: 'attraction',
      title: attraction.name,
      titleAr: attraction.nameAr,
      image: attraction.image,
      mapsUrl: attraction.googleMapsUrl,
    };
  }

  const service = services.find(item => item.id === placeId);
  if (service && (service.type === 'restaurant' || service.type === 'cafe')) {
    return { kind: service.type, title: service.name, titleAr: service.nameAr, image: service.image };
  }

  return null;
}

// الخطة الأساسية بدون AI: تظهر قبل الضغط على الزر أو لو المخطط الذكي ما اشتغل
export function buildItinerary({ interests, days }: TripPreferences): PlanDay[] {
  // 1) نختار المعالم اللي تناسب اهتمامات المستخدم
  const categories = interests.flatMap(interest => interestCategories[interest]);
  let places = attractions.filter(place => categories.includes(place.category));

  // لو ما فيه معالم كافية (مثلاً اختار "المطاعم" بس) نستخدم كل المعالم
  if (places.length < 2) places = attractions;

  const restaurants = services.filter(service => service.type === 'restaurant');
  const cafes = services.filter(service => service.type === 'cafe');
  const lovesFood = interests.includes('food');

  // 2) نبني كل يوم: معلم صباحي + غداء + معلم مسائي + كوفي
  const plan: PlanDay[] = [];

  for (let day = 1; day <= days; day++) {
    const index = day - 1;
    const ids = [
      places[(index * 2) % places.length].id,
      lovesFood ? restaurants[index % restaurants.length].id : 'local-lunch',
      places[(index * 2 + 1) % places.length].id,
      cafes[index % cafes.length].id,
    ];
    const times = ['09:00', '13:00', '17:00', '20:00'];

    plan.push({
      day,
      activities: ids.flatMap((id, i) => {
        const place = resolvePlace(id);
        return place ? [{ ...place, time: times[i] }] : [];
      }),
    });
  }

  return plan;
}
