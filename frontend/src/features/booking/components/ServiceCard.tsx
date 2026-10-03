// كرت مقدم خدمة. الضغط على الكرت أو الزر يختار الخدمة
import Button from '../../../components/ui/Button/Button';
import Card from '../../../components/ui/Card/Card';
import Rating from '../../../components/ui/Rating/Rating';
import { useLanguage } from '../../../hooks/useLanguage';
import { classNames } from '../../../utils/helpers';
import type { Service } from '../booking.types';

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export default function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  const { t, pick } = useLanguage();
  const name = pick(service.name, service.nameAr);

  return (
    <Card
      hoverable={false}
      className={classNames('service-card', isSelected && 'selected')}
      onClick={() => onSelect(service)}
    >
      <img src={service.image} alt={name} loading="lazy" decoding="async" />
      <div>
        <div className="card-top">
          <h3>{name}</h3>
          <Rating value={service.rating} />
        </div>
        <p>{pick(service.typeLabel, service.typeLabelAr)}</p>
        <p>⌖ {pick(service.location, service.locationAr)}</p>
        <p dir="ltr" className="service-contact">☎ {service.contact}</p>
        <div className="service-card-footer">
          <b>{pick(service.price, service.priceAr)}</b>
          <Button size="sm" variant={isSelected ? 'ghost' : 'primary'}>
            {isSelected ? `✓ ${t('selected')}` : `${t('selectService')} →`}
          </Button>
        </div>
      </div>
    </Card>
  );
}
