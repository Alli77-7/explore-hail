import { Link } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';

interface MobileNavigationProps {
  open: boolean;
  onNavigate: () => void;
}

const mobileGroups = [
  {
    title: 'Discover',
    titleAr: 'اكتشف',
    links: [
      { to: '/attractions?category=historical', label: 'Historical', labelAr: 'تاريخي' },
      { to: '/attractions?category=natural', label: 'Natural', labelAr: 'طبيعي' },
      { to: '/attractions?category=cultural', label: 'Cultural', labelAr: 'ثقافي' },
      { to: '/attractions?category=adventure', label: 'Adventure', labelAr: 'مغامرات' },
    ],
  },
  {
    title: 'Services',
    titleAr: 'الخدمات',
    links: [
      { to: '/booking?category=hotel', label: 'Hotels', labelAr: 'فنادق' },
      { to: '/booking?category=restaurant', label: 'Restaurants', labelAr: 'مطاعم' },
      { to: '/booking?category=cafe', label: 'Cafes', labelAr: 'مقاهٍ' },
      { to: '/booking?category=tour', label: 'Tours & Reserves', labelAr: 'جولات ومحميات' },
      { to: '/booking?category=cars', label: 'Trip Cars', labelAr: 'سيارات الرحلات' },
    ],
  },
  {
    title: 'Smart Experience',
    titleAr: 'التجربة الذكية',
    links: [
      { to: '/translation', label: 'AI Translation', labelAr: 'ترجمة النقوش' },
      { to: '/trip-planner', label: 'Trip Planner', labelAr: 'مخطط الرحلات' },
      { to: '/booking', label: 'Booking', labelAr: 'الحجوزات' },
    ],
  },
];

export default function MobileNavigation({ open, onNavigate }: MobileNavigationProps) {
  const { t, pick } = useLanguage();

  return (
    <div id="mobile-navigation" className={`mobile-navigation ${open ? 'open' : ''}`} aria-hidden={!open}>
      <Link to="/" className="mobile-home-link" tabIndex={open ? undefined : -1} onClick={onNavigate}>
        {t('navHome')} <span aria-hidden="true">↗</span>
      </Link>

      <div className="mobile-navigation-groups">
        {mobileGroups.map(group => (
          <section key={group.title}>
            <h2>{pick(group.title, group.titleAr)}</h2>
            <div>
              {group.links.map(link => (
                <Link key={link.to} to={link.to} tabIndex={open ? undefined : -1} onClick={onNavigate}>
                  {pick(link.label, link.labelAr)}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
