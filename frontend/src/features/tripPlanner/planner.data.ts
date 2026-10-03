// إعدادات مخطط الرحلات
import type { TranslationKey } from '../../utils/translations';
import type { AttractionCategory } from '../attractions/attractions.types';
import { services } from '../booking/booking.data';
import type { Interest, TripDays } from './planner.types';

// خيارات الاهتمامات في النموذج
export const interestOptions: { id: Interest; label: TranslationKey }[] = [
  { id: 'nature', label: 'interestNature' },
  { id: 'history', label: 'interestHistory' },
  { id: 'adventure', label: 'interestAdventure' },
  { id: 'food', label: 'interestFood' },
];

// خيارات مدة الرحلة
export const dayOptions: { value: TripDays; label: TranslationKey }[] = [
  { value: 1, label: 'days1' },
  { value: 2, label: 'days2' },
  { value: 3, label: 'days3' },
];

// كل اهتمام وش يقابله من تصنيفات المعالم
export const interestCategories: Record<Interest, AttractionCategory[]> = {
  nature: ['natural'],
  history: ['historical', 'cultural'],
  adventure: ['adventure'],
  food: [],
};

// الجهات المقترحة نأخذها من بيانات الحجز نفسها (بدون تكرار البيانات)
const recommendedPartnerIds = ['millennium', 'flox', 'rumlah'];
export const recommendedPartners = services.filter(service => recommendedPartnerIds.includes(service.id));
