// منطق بناء الجدول بعيد عن واجهة React، عشان يكون سهل القراءة والاختبار
import { attractions } from '../attractions/attractions.data';
import { services } from '../booking/booking.data';
import { interestCategories } from './planner.data';
import type { PlanDay, TripPreferences } from './planner.types';

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
    const morning = places[(index * 2) % places.length];
    const evening = places[(index * 2 + 1) % places.length];
    const restaurant = restaurants[index % restaurants.length];
    const cafe = cafes[index % cafes.length];

    plan.push({
      day,
      activities: [
        { time: '09:00', title: morning.name, titleAr: morning.nameAr },
        lovesFood
          ? { time: '13:00', title: restaurant.name, titleAr: restaurant.nameAr }
          : { time: '13:00', title: 'Local lunch experience', titleAr: 'تجربة غداء محلية' },
        { time: '17:00', title: evening.name, titleAr: evening.nameAr },
        { time: '20:00', title: cafe.name, titleAr: cafe.nameAr },
      ],
    });
  }

  return plan;
}
