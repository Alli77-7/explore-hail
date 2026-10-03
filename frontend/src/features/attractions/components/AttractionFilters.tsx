// فلاتر المعالم: الكل / تاريخي / طبيعي / ثقافي / مغامرة
import FilterPills from '../../../components/ui/FilterPills/FilterPills';
import { useLanguage } from '../../../hooks/useLanguage';
import type { AttractionCategory } from '../attractions.types';

export type AttractionFilter = 'all' | AttractionCategory;

interface AttractionFiltersProps {
  active: AttractionFilter;
  onChange: (filter: AttractionFilter) => void;
}

export default function AttractionFilters({ active, onChange }: AttractionFiltersProps) {
  const { t } = useLanguage();

  const options: { id: AttractionFilter; label: string }[] = [
    { id: 'all', label: t('filterAll') },
    { id: 'historical', label: t('historical') },
    { id: 'natural', label: t('natural') },
    { id: 'cultural', label: t('cultural') },
    { id: 'adventure', label: t('adventure') },
  ];

  return <FilterPills options={options} active={active} onChange={onChange} />;
}
