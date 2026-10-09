import { useState } from 'react';
import { Link } from 'react-router-dom';
import ajaImg from '../../../assets/images/attractions/aja.svg';
import jubbahImg from '../../../assets/images/attractions/jubbah.svg';
import museumImg from '../../../assets/images/attractions/museum.svg';
import salmaImg from '../../../assets/images/attractions/salma.svg';
import { useLanguage } from '../../../hooks/useLanguage';
import type { AttractionCategory } from '../../../features/attractions/attractions.types';
import type { NavigationPanelProps } from './navbar.types';

const discoverItems: Array<{
  id: AttractionCategory;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  image: string;
}> = [
  {
    id: 'historical',
    name: 'Historical',
    nameAr: 'تاريخي',
    description: "Explore Hail's forts, palaces, and archaeological landmarks.",
    descriptionAr: 'استكشف حصون حائل وقصورها ومعالمها الأثرية.',
    image: jubbahImg,
  },
  {
    id: 'natural',
    name: 'Natural',
    nameAr: 'طبيعي',
    description: 'Discover mountains, valleys, and dramatic desert landscapes.',
    descriptionAr: 'اكتشف الجبال والأودية والمشاهد الصحراوية المهيبة.',
    image: ajaImg,
  },
  {
    id: 'cultural',
    name: 'Cultural',
    nameAr: 'ثقافي',
    description: 'Experience museums, heritage, and the living culture of Hail.',
    descriptionAr: 'عش تجربة المتاحف والتراث والثقافة الحية في حائل.',
    image: museumImg,
  },
  {
    id: 'adventure',
    name: 'Adventure',
    nameAr: 'مغامرات',
    description: 'Find mountain trails and memorable outdoor desert experiences.',
    descriptionAr: 'اكتشف المسارات الجبلية وتجارب الصحراء الخارجية.',
    image: salmaImg,
  },
];

export default function DiscoverPanel({ onNavigate }: NavigationPanelProps) {
  const { pick } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<AttractionCategory>('historical');

  return (
    <div className="discover-panel">
      <div className="discover-panel-list">
        {discoverItems.map(item => (
          <Link
            key={item.id}
            to={`/attractions?category=${item.id}`}
            className={activeCategory === item.id ? 'active' : ''}
            onMouseEnter={() => setActiveCategory(item.id)}
            onFocus={() => setActiveCategory(item.id)}
            onClick={onNavigate}
          >
            <span>
              <b>{pick(item.name, item.nameAr)}</b>
              <small>{pick(item.description, item.descriptionAr)}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>

      <div className="discover-preview" aria-hidden="true">
        {discoverItems.map(item => (
          <img
            key={item.id}
            src={item.image}
            alt=""
            className={activeCategory === item.id ? 'active' : ''}
          />
        ))}
        <div className="discover-preview-caption">
          {pick(
            discoverItems.find(item => item.id === activeCategory)!.name,
            discoverItems.find(item => item.id === activeCategory)!.nameAr,
          )}
        </div>
      </div>
    </div>
  );
}
