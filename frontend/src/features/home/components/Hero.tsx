// الواجهة الرئيسية بصورة حائل.
// لإضافة فيديو الدرون لاحقاً: حط الملف في src/assets/videos/hail-drone.mp4
// ثم استورده في HomePage ومرّره هنا: <Hero videoSrc={droneVideo} />
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import heroImage from '../../../assets/images/branding/hail-hero.jpg';

interface HeroProps {
  videoSrc?: string;
}

export default function Hero({ videoSrc }: HeroProps) {
  const { t } = useLanguage();

  return (
    <header className="hero">
      {videoSrc ? (
        <video className="hero-media" src={videoSrc} poster={heroImage} autoPlay muted loop playsInline />
      ) : (
        <img className="hero-media" src={heroImage} alt="" />
      )}

      <div className="hero-content">
        <span className="hero-badge">{t('heroBadge')}</span>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
        <div className="hero-actions">
          <Button to="/attractions">{t('heroExplore')}</Button>
          <Button to="/trip-planner" variant="glass">{t('heroPlan')}</Button>
        </div>
      </div>
    </header>
  );
}
