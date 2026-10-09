// صفحة المعالم: بحث + فلاتر + شبكة كروت + نافذة التفاصيل
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { useLanguage } from '../../hooks/useLanguage';
import { attractions } from './attractions.data';
import type { Attraction } from './attractions.types';
import AttractionCard from './components/AttractionCard';
import AttractionDetails from './components/AttractionDetails';
import AttractionFilters, { type AttractionFilter } from './components/AttractionFilters';
import './attractions.css';

const reserveDisplayOrder = [
  'ramlah-tourist-reserve',
  'tuwarin-reserve',
  'imam-turki-royal-reserve',
  'king-salman-royal-reserve',
];

export default function AttractionsPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const initialFilter: AttractionFilter = ['historical', 'natural', 'cultural', 'adventure'].includes(requestedCategory ?? '')
    ? requestedCategory as AttractionFilter
    : 'all';
  const [filter, setFilter] = useState<AttractionFilter>(initialFilter);
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [selected, setSelected] = useState<Attraction | null>(null);

  useEffect(() => {
    setFilter(initialFilter);
  }, [requestedCategory]);

  const handleFilterChange = (nextFilter: AttractionFilter) => {
    setFilter(nextFilter);
    const nextParams = new URLSearchParams(searchParams);
    if (nextFilter === 'all') nextParams.delete('category');
    else nextParams.set('category', nextFilter);
    setSearchParams(nextParams, { replace: true });
  };

  // نطبّق الفلتر والبحث (بالعربي أو الإنجليزي)
  const query = search.trim().toLowerCase();
  const visibleAttractions = attractions
    .filter(attraction => {
      const matchesFilter = filter === 'all' || attraction.category === filter;
      const searchableText = `${attraction.name} ${attraction.nameAr} ${attraction.location} ${attraction.locationAr}`.toLowerCase();
      return matchesFilter && searchableText.includes(query);
    })
    .sort((first, second) => {
      const firstIndex = reserveDisplayOrder.indexOf(first.id);
      const secondIndex = reserveDisplayOrder.indexOf(second.id);
      if (firstIndex === -1 && secondIndex === -1) return 0;
      if (firstIndex === -1) return 1;
      if (secondIndex === -1) return -1;
      return firstIndex - secondIndex;
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
        <AttractionFilters active={filter} onChange={handleFilterChange} />
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
