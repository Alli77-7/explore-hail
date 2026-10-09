// صفحة مخطط الرحلات: النموذج + الجدول + الجهات المقترحة
import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import PlannerForm from './components/PlannerForm';
import RecommendedPartners from './components/RecommendedPartners';
import TripTimeline from './components/TripTimeline';
import type { TripPreferences } from './planner.types';
import { buildItinerary } from './planner.utils';
import './tripPlanner.css';

export default function TripPlannerPage() {
  const { t } = useLanguage();
  const { toast, showToast } = useToast();
  const [preferences, setPreferences] = useState<TripPreferences>({ interests: ['nature', 'history'], days: 2 });

  // الجدول يتحدّث مباشرة مع أي تغيير في الاختيارات
  const plan = buildItinerary(preferences);

  const handleGenerate = () => {
    showToast(t('planUpdated'));
    document.getElementById('trip-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="container page-container">
      <PageHeader eyebrow={t('plannerEyebrow')} title={t('plannerTitle')} text={t('plannerText')} />

      <div className="planner-layout">
        <PlannerForm preferences={preferences} onChange={setPreferences} onGenerate={handleGenerate} />
        <TripTimeline plan={plan} />
        <RecommendedPartners />
      </div>

      <Toast toast={toast} />
    </div>
  );
}
