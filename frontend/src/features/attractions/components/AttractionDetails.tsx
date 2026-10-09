// نافذة تفاصيل المعلم (تفتح من زر "عرض التفاصيل")
import { useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import Modal from '../../../components/ui/Modal/Modal';
import Rating from '../../../components/ui/Rating/Rating';
import { useLanguage } from '../../../hooks/useLanguage';
import type { Attraction } from '../attractions.types';

interface AttractionDetailsProps {
  attraction: Attraction | null;
  onClose: () => void;
}

export default function AttractionDetails({ attraction, onClose }: AttractionDetailsProps) {
  const { t, pick } = useLanguage();
  const navigate = useNavigate();

  if (!attraction) return null;

  const name = pick(attraction.name, attraction.nameAr);
  const description = pick(
    attraction.longDescription ?? attraction.description,
    attraction.longDescriptionAr ?? attraction.descriptionAr,
  );

  const addToTrip = () => {
    onClose();
    navigate('/trip-planner');
  };

  return (
    <Modal open onClose={onClose} labelledBy="attraction-details-title">
      <div className="details-media">
        <img src={attraction.image} alt={name} />
        <Badge variant="dark">{t(attraction.category)}</Badge>
      </div>

      <div className="details-body">
        <div className="card-top">
          <h2 id="attraction-details-title">{name}</h2>
          {attraction.rating !== undefined && <Rating value={attraction.rating} />}
        </div>
        <p className="text-soft">{description}</p>

        <ul className="details-facts">
          <li>
            <small>{t('location')}</small>
            <b>{pick(attraction.location, attraction.locationAr)}</b>
          </li>
          {attraction.price !== undefined && (
            <li>
              <small>{t('entry')}</small>
              <b>{attraction.price ? `${attraction.price} ${t('sar')}` : t('free')}</b>
            </li>
          )}
          {attraction.reviews !== undefined && (
            <li>
              <small>{t('reviews')}</small>
              <b>{attraction.reviews}+</b>
            </li>
          )}
        </ul>

        <div className="details-actions">
          <Button onClick={addToTrip}>{t('addToTrip')}</Button>
          <Button variant="ghost" href={attraction.googleMapsUrl}>{t('openInMaps')}</Button>
        </div>
      </div>
    </Modal>
  );
}
