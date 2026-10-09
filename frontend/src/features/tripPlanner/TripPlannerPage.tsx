// صفحة مخطط الرحلات: الطلب ← كيف فهمه الـ AI ← الأيام + الجهات المقترحة
import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import PlanReading from './components/PlanReading';
import RecommendedPartners from './components/RecommendedPartners';
import TripComposer from './components/TripComposer';
import TripTimeline from './components/TripTimeline';
import { fetchSmartPlan } from './planner.api';
import type { SmartPlan, TripPreferences } from './planner.types';
import { buildItinerary } from './planner.utils';
import './tripPlanner.css';

export default function TripPlannerPage() {
  const { t, lang } = useLanguage();
  const { toast, showToast } = useToast();
  const [preferences, setPreferences] = useState<TripPreferences>({ request: '', interests: ['nature', 'history'], days: 2 });
  const [smartPlan, setSmartPlan] = useState<SmartPlan | null>(null);
  const [planVersion, setPlanVersion] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      setSmartPlan(await fetchSmartPlan(preferences, lang));
      setPlanVersion(version => version + 1);
      showToast(t('planUpdated'));
      requestAnimationFrame(() =>
        document.getElementById('plan-reading')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    } catch (error) {
      // لو الموديل أو الباك إند ما اشتغل نكمل بالخطة الأساسية
      console.error(error);
      setSmartPlan(null);
      showToast(t('planFallback'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-container">
      <PageHeader eyebrow={t('plannerEyebrow')} title={t('plannerTitle')} text={t('plannerTextSmart')} />

      <TripComposer preferences={preferences} onChange={setPreferences} onGenerate={handleGenerate} loading={loading} />

      {smartPlan && <PlanReading plan={smartPlan} />}

      <div className="planner-results" aria-busy={loading}>
        <TripTimeline
          key={planVersion}
          plan={smartPlan ? smartPlan.days : buildItinerary(preferences)}
          note={smartPlan ? undefined : t('basePlanNote')}
        />
        <RecommendedPartners />
      </div>

      <Toast toast={toast} />
    </div>
  );
}
