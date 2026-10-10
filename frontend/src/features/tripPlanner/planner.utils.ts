import { getAttractions } from '../../services/attractions';
import type { Attraction } from '../attractions/attractions.types';
import { services } from '../booking/booking.data';
import { interestCategories } from './planner.data';
import type {
  PlanActivity,
  PlanDay,
  TripPreferences,
} from './planner.types';

type ResolvedPlace = Omit<PlanActivity, 'time' | 'reason'>;

export function resolvePlace(
  placeId: string,
  attractions: Attraction[]
): ResolvedPlace | null {
  if (placeId === 'local-lunch') {
    return {
      kind: 'lunch',
      title: 'Local lunch',
      titleAr: 'غداء محلي',
    };
  }

  if (placeId === 'free-time') {
    return {
      kind: 'rest',
      title: 'Free time to rest',
      titleAr: 'وقت حر للراحة',
    };
  }

  const attraction = attractions.find(
    place => String(place.id) === placeId
  );

  if (attraction) {
    return {
      kind: 'attraction',
      title: attraction.name,
      titleAr: attraction.name_ar ?? attraction.name,
      image: attraction.image_url
        ? `http://localhost:3000${attraction.image_url}`
        : undefined,
      mapsUrl: attraction.google_map_url ?? undefined,
    };
  }

  const service = services.find(
    item => item.id === placeId
  );

  if (
    service &&
    (service.type === 'restaurant' || service.type === 'cafe')
  ) {
    return {
      kind: service.type,
      title: service.name,
      titleAr: service.nameAr,
      image: service.image,
    };
  }

  return null;
}

export async function buildItinerary({
  interests,
  days,
}: TripPreferences): Promise<PlanDay[]> {
  const attractions = await getAttractions();

  const categories = interests.flatMap(
    interest => interestCategories[interest]
  );

  let places = attractions.filter(
    place => categories.includes(place.category)
  );

  if (places.length < 2) {
    places = attractions;
  }

  const restaurants = services.filter(
    service => service.type === 'restaurant'
  );

  const cafes = services.filter(
    service => service.type === 'cafe'
  );

  const lovesFood = interests.includes('food');

  const plan: PlanDay[] = [];

  for (let day = 1; day <= days; day++) {
    const index = day - 1;

    const ids: string[] = [
      String(places[(index * 2) % places.length].id),

      lovesFood
        ? restaurants[index % restaurants.length].id
        : 'local-lunch',

      String(
        places[(index * 2 + 1) % places.length].id
      ),

      cafes[index % cafes.length].id,
    ];

    const times = [
      '09:00',
      '13:00',
      '17:00',
      '20:00',
    ];

    plan.push({
      day,
      activities: ids.flatMap((id, i) => {
        const place = resolvePlace(
          id,
          attractions
        );

        return place
          ? [{ ...place, time: times[i] }]
          : [];
      }),
    });
  }

  return plan;
}