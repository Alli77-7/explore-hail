// قسم "رفيقك السياحي الذكي" مع 4 كروت تشرح مميزات المنصة
import Card from '../../../components/ui/Card/Card';
import SectionTitle from '../../../components/ui/SectionTitle/SectionTitle';
import { useLanguage } from '../../../hooks/useLanguage';
import type { TranslationKey } from '../../../utils/translations';

const features: { icon: string; title: TranslationKey; text: TranslationKey }[] = [
  { icon: '⌖', title: 'featurePlacesTitle', text: 'featurePlacesText' },
  { icon: '✦', title: 'featureBookingTitle', text: 'featureBookingText' },
  { icon: 'AI', title: 'featureTranslationTitle', text: 'featureTranslationText' },
  { icon: '◫', title: 'featurePlannerTitle', text: 'featurePlannerText' },
];

export default function SmartTourismFeatures() {
  const { t } = useLanguage();

  return (
    <section id="home-experience" className="container home-section home-intro">
      <SectionTitle eyebrow={t('introEyebrow')} title={t('introTitle')} text={t('introText')} centered />

      <div className="feature-grid">
        {features.map(feature => (
          <Card key={feature.title} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{t(feature.title)}</h3>
            <p>{t(feature.text)}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
