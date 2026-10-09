// عرض الجدول المقترح يوم بيوم
import Badge from '../../../components/ui/Badge/Badge';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import type { PlanDay } from '../planner.types';

export default function TripTimeline({ plan }: { plan: PlanDay[] }) {
  const { t, pick } = useLanguage();
  const ref = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref} id="trip-timeline" className="timeline panel reveal">
      <Badge>{t('generatedPlan')}</Badge>
      <h2>{t('yourJourney')}</h2>
      <p className="timeline-intro">{t('yourJourneyText')}</p>

      {plan.map(day => (
        <div key={day.day} className="timeline-day">
          <h3>{t('day')} {day.day}</h3>
          {day.activities.map(activity => (
            <p key={activity.time}>
              <b>{activity.time}</b> — {pick(activity.title, activity.titleAr)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
