// فلاتر الخدمات: الكل / فنادق / مطاعم / جولات / كوفيهات / سيارات
import FilterPills from '../../../components/ui/FilterPills/FilterPills';
import { useLanguage } from '../../../hooks/useLanguage';
import type { ServiceType } from '../booking.types';

export type ServiceFilter = 'all' | ServiceType;

interface ServiceFiltersProps {
  active: ServiceFilter;
  onChange: (filter: ServiceFilter) => void;
}

export default function ServiceFilters({ active, onChange }: ServiceFiltersProps) {
  const { t } = useLanguage();

  const options: { id: ServiceFilter; label: string }[] = [
    { id: 'all', label: t('allServices') },
    { id: 'hotel', label: t('hotels') },
    { id: 'restaurant', label: t('restaurants') },
    { id: 'tour', label: t('tours') },
    { id: 'cafe', label: t('cafes') },
    { id: 'cars', label: t('tripCars') },
  ];

  return <FilterPills options={options} active={active} onChange={onChange} />;
}
