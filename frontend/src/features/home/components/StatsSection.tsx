import { useEffect, useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { getAttractions } from '../../../services/attractions';

export default function StatsSection() {
  const { t } = useLanguage();
  const [attractionsCount, setAttractionsCount] = useState(0);

  useEffect(() => {
    async function loadAttractionsCount() {
      try {
        const data = await getAttractions();
        setAttractionsCount(data.length);
      } catch (error) {
        console.error('Failed to load attractions count:', error);
      }
    }

    loadAttractionsCount();
  }, []);

  const stats = [
    { value: `${attractionsCount}+`, label: t('statDestinations') },
    { value: '1000+', label: t('statInscriptions') },
    { value: '24/7', label: t('statExperience') },
  ];

  return (
    <section className="stats" aria-label={t('statExperience')}>
      {stats.map(stat => (
        <div key={stat.label}>
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}