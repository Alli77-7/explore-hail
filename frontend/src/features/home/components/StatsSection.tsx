// شريط الأرقام البرتقالي
import { useLanguage } from '../../../hooks/useLanguage';
import { attractions } from '../../attractions/attractions.data';

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { value: `${attractions.length}+`, label: t('statDestinations') },
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
