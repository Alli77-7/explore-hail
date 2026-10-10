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

export default function AttractionDetails({
  attraction,
  onClose,
}: AttractionDetailsProps) {
  const { t, pick } = useLanguage();
  const navigate = useNavigate();

  if (!attraction) return null;

  const name = pick(
    attraction.name,
    attraction.name_ar ?? attraction.name
  );

  const description = pick(
    attraction.description ?? '',
    attraction.description_ar ?? attraction.description ?? ''
  );

  const imageUrl = attraction.image_url
    ? `http://localhost:3000${attraction.image_url}`
    : '';

  const addToTrip = () => {
    onClose();
    navigate('/trip-planner');
  };

  return (
    <Modal
      open
      onClose={onClose}
      labelledBy="attraction-details-title"
    >
      <div className="details-media">
        <img src={imageUrl} alt={name} />

        <Badge variant="dark">
          {t(attraction.category)}
        </Badge>
      </div>

      <div className="details-body">
        <div className="card-top">
          <h2 id="attraction-details-title">
            {name}
          </h2>

          {attraction.rating !== null && (
            <Rating value={Number(attraction.rating)} />
          )}
        </div>

        <p className="text-soft">
          {description}
        </p>

        <ul className="details-facts">
          {attraction.price !== null && (
            <li>
              <small>{t('entry')}</small>

              <b>
                {Number(attraction.price) > 0
                  ? `${Number(attraction.price)} ${t('sar')}`
                  : t('free')}
              </b>
            </li>
          )}
        </ul>

        <div className="details-actions">
          <Button onClick={addToTrip}>
            {t('addToTrip')}
          </Button>

          {attraction.google_map_url && (
            <Button
              variant="ghost"
              href={attraction.google_map_url}
            >
              {t('openInMaps')}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}