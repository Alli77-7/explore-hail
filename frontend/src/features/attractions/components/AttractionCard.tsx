// كرت معلم واحد: صورة + تصنيف + اسم + تقييم + وصف + موقع + سعر
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import Card from '../../../components/ui/Card/Card';
import Rating from '../../../components/ui/Rating/Rating';
import { useLanguage } from '../../../hooks/useLanguage';
import type { Attraction } from '../attractions.types';

interface AttractionCardProps {
  attraction: Attraction;
  onViewDetails: (attraction: Attraction) => void;
}

export default function AttractionCard({ attraction, onViewDetails }: AttractionCardProps) {
  const { t, pick } = useLanguage();
  const name = pick(attraction.name, attraction.nameAr);

  return (
    <Card className="attraction-card">
      <div className="attraction-card-image">
        <img src={attraction.image} alt={name} loading="lazy" decoding="async" />
        <Badge variant="dark">{t(attraction.category)}</Badge>
      </div>

      <div className="attraction-card-body">
        <div className="card-top">
          <h3>{name}</h3>
          {attraction.rating !== undefined && <Rating value={attraction.rating} />}
        </div>
        <p>{pick(attraction.description, attraction.descriptionAr)}</p>
        <div className="attraction-card-meta">
          <span>⌖ {pick(attraction.location, attraction.locationAr)}</span>
          {attraction.price !== undefined && (
            <strong>{attraction.price ? `${attraction.price} ${t('sar')}` : t('free')}</strong>
          )}
        </div>
        <div className="attraction-card-actions">
          <Button size="sm" onClick={() => onViewDetails(attraction)}>
            {t('viewDetails')} →
          </Button>
          <Button size="sm" variant="ghost" href={attraction.googleMapsUrl}>
            {t('openInMaps')}
          </Button>
        </div>
      </div>
    </Card>
  );
}
