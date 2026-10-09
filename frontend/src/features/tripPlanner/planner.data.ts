// إعدادات مخطط الرحلات
import type { TranslationKey } from '../../utils/translations';
import type { AttractionCategory } from '../attractions/attractions.types';
import { services } from '../booking/booking.data';
import type { Interest, TripPace } from './planner.types';

// خيارات الاهتمامات في النموذج
export const interestOptions: { id: Interest; label: TranslationKey }[] = [
  { id: 'nature', label: 'interestNature' },
  { id: 'history', label: 'interestHistory' },
  { id: 'adventure', label: 'interestAdventure' },
  { id: 'food', label: 'interestFood' },
];

// خيارات مدة الرحلة السريعة (لو كتب المستخدم مدة في طلبه، طلبه هو اللي يمشي)
export const dayOptions = [1, 2, 3, 5, 7];

// أمثلة يضغط عليها المستخدم عشان يعرف وش يكتب
export const requestExamples: TranslationKey[] = ['requestExample1', 'requestExample2', 'requestExample3'];

export const paceLabels: Record<TripPace, TranslationKey> = {
  relaxed: 'paceRelaxed',
  balanced: 'paceBalanced',
  packed: 'pacePacked',
};

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
