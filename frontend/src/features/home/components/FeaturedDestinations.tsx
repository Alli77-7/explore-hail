// أول 3 معالم كـ "وجهات مميزة"، والضغط على الكرت يفتح التفاصيل
import { useState } from 'react';
import Card from '../../../components/ui/Card/Card';
import SectionTitle from '../../../components/ui/SectionTitle/SectionTitle';
import { useLanguage } from '../../../hooks/useLanguage';
import { attractions } from '../../attractions/attractions.data';
import type { Attraction } from '../../attractions/attractions.types';
import AttractionDetails from '../../attractions/components/AttractionDetails';

export default function FeaturedDestinations() {
  const { t, pick } = useLanguage();
  const [selected, setSelected] = useState<Attraction | null>(null);
  const featured = attractions.slice(0, 3);

  return (
    <section className="container home-section home-destinations">
      <SectionTitle eyebrow={t('featuredEyebrow')} title={t('featuredTitle')} />

      <div className="destination-grid">
        {featured.map(attraction => (
          <Card
            key={attraction.id}
            className="destination-card"
            role="button"
            tabIndex={0}
            onClick={() => setSelected(attraction)}
            onKeyDown={event => event.key === 'Enter' && setSelected(attraction)}
          >
            <img src={attraction.image} alt={pick(attraction.name, attraction.nameAr)} loading="lazy" decoding="async" />
            <div>
              <h3>{pick(attraction.name, attraction.nameAr)}</h3>
              <p className="destination-meta">
                <span>{t(attraction.category)}</span>
                <span aria-hidden="true">•</span>
                <span>{pick(attraction.location, attraction.locationAr)}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      <AttractionDetails attraction={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
