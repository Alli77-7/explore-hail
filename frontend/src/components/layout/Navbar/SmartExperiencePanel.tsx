import { Link } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';
import type { NavigationPanelProps } from './navbar.types';

const smartItems = [
  {
    to: '/translation',
    icon: '⌁',
    name: 'AI Translation',
    nameAr: 'ترجمة النقوش',
    description: 'Upload and explore ancient Thamudic inscriptions.',
    descriptionAr: 'ارفع صور النقوش الثمودية القديمة واستكشفها.',
  },
  {
    to: '/trip-planner',
    icon: '◇',
    name: 'Trip Planner',
    nameAr: 'مخطط الرحلات',
    description: 'Build a personalized itinerary around Hail.',
    descriptionAr: 'أنشئ جدولًا مخصصًا لرحلتك في حائل.',
  },
  {
    to: '/booking',
    icon: '⌖',
    name: 'Booking',
    nameAr: 'الحجوزات',
    description: 'Book tourism services from one place.',
    descriptionAr: 'احجز الخدمات السياحية من مكان واحد.',
  },
] as const;

export default function SmartExperiencePanel({ onNavigate }: NavigationPanelProps) {
  const { pick } = useLanguage();

  return (
    <div className="smart-panel">
      {smartItems.map(item => (
        <Link key={item.to} to={item.to} onClick={onNavigate}>
          <span className="smart-panel-icon" aria-hidden="true">{item.icon}</span>
          <span>
            <b>{pick(item.name, item.nameAr)}</b>
            <small>{pick(item.description, item.descriptionAr)}</small>
          </span>
          <span className="smart-panel-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
