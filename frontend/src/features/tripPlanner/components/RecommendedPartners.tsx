// الجهات المقترحة (فندق + مطعم + محمية) من بيانات الحجز
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { recommendedPartnerIds } from '../planner.data';
import { getServices } from '../../../services/services';
import type { Service } from '../../booking/booking.types';

export default function RecommendedPartners() {
  const { t, pick } = useLanguage();
  const ref = useScrollReveal<HTMLElement>();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices).catch(error => console.error(error));
  }, []);
  const recommendedPartners = services.filter(service => recommendedPartnerIds.includes(service.id));

  return (
    <aside ref={ref} className="partner-card panel reveal">
      <Badge>{t('recommended')}</Badge>
      <h2>{t('tripPartners')}</h2>
      <p className="text-soft">{t('tripPartnersText')}</p>

      {recommendedPartners.map(partner => (
        <Link key={partner.id} to="/booking" className="partner-item">
          <img src={partner.image} alt={pick(partner.name, partner.nameAr)} loading="lazy" />
          <div>
            <h4>{pick(partner.name, partner.nameAr)}</h4>
            <span>{pick(partner.typeLabel, partner.typeLabelAr)}</span>
          </div>
        </Link>
      ))}
    </aside>
  );
}
