import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card/Card';
import SectionTitle from '../../../components/ui/SectionTitle/SectionTitle';
import { useLanguage } from '../../../hooks/useLanguage';
import { getAttractions } from '../../../services/attractions';
import type { Attraction } from '../../attractions/attractions.types';
import AttractionDetails from '../../attractions/components/AttractionDetails';

export default function FeaturedDestinations() {
  const { t, pick } = useLanguage();

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [selected, setSelected] = useState<Attraction | null>(null);

  useEffect(() => {
    async function loadAttractions() {
      try {
        const data = await getAttractions();
        setAttractions(data);
      } catch (error) {
        console.error('Failed to load featured destinations:', error);
      }
    }

    loadAttractions();
  }, []);

  const featured = attractions.slice(0, 3);

  return (
    <section className="container home-section home-destinations">
      <SectionTitle
        eyebrow={t('featuredEyebrow')}
        title={t('featuredTitle')}
      />

      <div className="destination-grid">
        {featured.map(attraction => (
          <Card
            key={attraction.id}
            className="destination-card"
            role="button"
            tabIndex={0}
            onClick={() => setSelected(attraction)}
            onKeyDown={event =>
              event.key === 'Enter' && setSelected(attraction)
            }
          >
            <img
              src={
                attraction.image_url
                  ? `http://localhost:3000${attraction.image_url}`
                  : ''
              }
              alt={pick(
                attraction.name,
                attraction.name_ar ?? attraction.name
              )}
              loading="lazy"
              decoding="async"
            />

            <div>
              <h3>
                {pick(
                  attraction.name,
                  attraction.name_ar ?? attraction.name
                )}
              </h3>

              <p className="destination-meta">
                <span>{t(attraction.category)}</span>
              </p>
            </div>
          </Card>
        ))}
      </div>

      <AttractionDetails
        attraction={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}