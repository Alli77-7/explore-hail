// صفحة المعالم: بحث + فلاتر + شبكة كروت + نافذة التفاصيل
import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { useLanguage } from '../../hooks/useLanguage';
import { attractions } from './attractions.data';
import type { Attraction } from './attractions.types';
import AttractionCard from './components/AttractionCard';
import AttractionDetails from './components/AttractionDetails';
import AttractionFilters, { type AttractionFilter } from './components/AttractionFilters';
import './attractions.css';

export default function AttractionsPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<AttractionFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Attraction | null>(null);

  // نطبّق الفلتر والبحث (بالعربي أو الإنجليزي)
  const query = search.trim().toLowerCase();
  const visibleAttractions = attractions.filter(attraction => {
    const matchesFilter = filter === 'all' || attraction.category === filter;
    const searchableText = `${attraction.name} ${attraction.nameAr} ${attraction.location} ${attraction.locationAr}`.toLowerCase();
    return matchesFilter && searchableText.includes(query);
  });

  return (
    <div className="container page-container">
      <PageHeader eyebrow={t('attractionsEyebrow')} title={t('attractionsTitle')} text={t('attractionsText')} />

      <div className="attractions-toolbar">
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
          />
        </label>
        <AttractionFilters active={filter} onChange={setFilter} />
      </div>

      <div className="attractions-grid">
        {visibleAttractions.map(attraction => (
          <AttractionCard key={attraction.id} attraction={attraction} onViewDetails={setSelected} />
        ))}
      </div>

      {visibleAttractions.length === 0 && <p className="attractions-empty">{t('noResults')}</p>}

      <AttractionDetails attraction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
