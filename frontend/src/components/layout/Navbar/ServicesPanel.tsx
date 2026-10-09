import { Link } from 'react-router-dom';
import hotelImg from '../../../assets/images/hotels/golden-tulip.svg';
import diningImg from '../../../assets/images/restaurants/roga-roko.svg';
import cafeImg from '../../../assets/images/cafes/geisha.svg';
import tourImg from '../../../assets/images/tours/rumlah.svg';
import { useLanguage } from '../../../hooks/useLanguage';
import type { NavigationPanelProps } from './navbar.types';

const serviceItems = [
  {
    id: 'hotel',
    name: 'Hotels',
    nameAr: 'الفنادق',
    description: 'Selected stays for your time in Hail.',
    descriptionAr: 'إقامات مختارة لرحلتك في حائل.',
    image: hotelImg,
  },
  {
    id: 'restaurant',
    name: 'Dining',
    nameAr: 'المطاعم',
    description: 'Local flavors and refined dining.',
    descriptionAr: 'نكهات محلية وتجارب طعام راقية.',
    image: diningImg,
  },
  {
    id: 'cafe',
    name: 'Cafes',
    nameAr: 'المقاهي',
    description: 'Discover Hail coffee experiences.',
    descriptionAr: 'اكتشف تجارب القهوة في حائل.',
    image: cafeImg,
  },
  {
    id: 'tour',
    name: 'Tours & Adventures',
    nameAr: 'الجولات والمغامرات',
    description: 'Reserves, outdoor trips, and guides.',
    descriptionAr: 'محميات ورحلات خارجية ومرشدون.',
    image: tourImg,
  },
] as const;

export default function ServicesPanel({ onNavigate }: NavigationPanelProps) {
  const { pick } = useLanguage();

  return (
    <div className="services-panel">
      {serviceItems.map(item => (
        <Link key={item.id} to={`/booking?category=${item.id}`} onClick={onNavigate}>
          <img src={item.image} alt="" />
          <span className="service-panel-card-copy">
            <b>{pick(item.name, item.nameAr)}</b>
            <small>{pick(item.description, item.descriptionAr)}</small>
          </span>
        </Link>
      ))}
    </div>
  );
}
