// الصفحة الرئيسية = مجموعة أقسام مرتبة
import FeaturedDestinations from './components/FeaturedDestinations';
import Hero from './components/Hero';
import SmartTourismFeatures from './components/SmartTourismFeatures';
import StatsSection from './components/StatsSection';
import './home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <SmartTourismFeatures />
      <StatsSection />
      <FeaturedDestinations />
    </div>
  );
}
