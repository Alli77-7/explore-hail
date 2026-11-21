// فلاتر الخدمات: الكل / فنادق / مطاعم / جولات / كوفيهات / سيارات
import FilterPills from '../../../components/ui/FilterPills/FilterPills';
import { useLanguage } from '../../../hooks/useLanguage';
import type { ServiceType } from '../booking.types';

export type ServiceFilter = 'all' | ServiceType;

interface ServiceFiltersProps {
  active: ServiceFilter;
  onChange: (filter: ServiceFilter) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
}

export default function ServiceFilters({ active, onChange, rating, onRatingChange }: ServiceFiltersProps) {
  const { t, lang } = useLanguage();

  const options: { id: ServiceFilter; label: string }[] = [
    { id: 'all', label: t('allServices') },
    { id: 'hotel', label: t('hotels') },
    { id: 'restaurant', label: t('restaurants') },
    { id: 'tour', label: t('tours') },
    { id: 'cafe', label: t('cafes') },
    { id: 'cars', label: t('tripCars') },
  ];

  return <div className="service-filter-controls"><FilterPills options={options} active={active} onChange={onChange} /><label className="rating-filter"><span>{lang === 'ar' ? 'التقييم' : 'Rating'}</span><select value={rating} onChange={event => onRatingChange(Number(event.target.value))}><option value="0">{lang === 'ar' ? 'كل التقييمات' : 'All ratings'}</option><option value="4">4+ ★</option><option value="4.5">4.5+ ★</option><option value="4.8">4.8+ ★</option></select></label></div>;
}
