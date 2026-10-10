// الجدول: شريط الأيام فوق، وتفاصيل اليوم المختار تحته
// (لو الرحلة 20 يوم ما نعرض قائمة طويلة، المستخدم يتنقل بين الأيام)
import { useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import type { TranslationKey } from '../../../utils/translations';
import type { ActivityKind, PlanDay } from '../planner.types';

const kindLabels: Record<ActivityKind, TranslationKey> = {
  attraction: 'kindAttraction',
  restaurant: 'kindRestaurant',
  cafe: 'kindCafe',
  lunch: 'kindLunch',
  rest: 'kindRest',
};

// لون النقطة حسب وقت اليوم: صبح، ظهر، غروب، ليل
function daypart(time: string) {
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return 'morning';
  if (hour < 16) return 'noon';
  if (hour < 19) return 'sunset';
  return 'night';
}

interface TripTimelineProps {
  plan: PlanDay[];
  note?: string;
}

export default function TripTimeline({ plan, note }: TripTimelineProps) {
  const { t, pick } = useLanguage();
  const [selected, setSelected] = useState(0);
  const day = plan[Math.min(selected, plan.length - 1)];

  return (
    <section id="trip-timeline" className="itinerary" aria-labelledby="itinerary-title">
      <h2 id="itinerary-title" className="visually-hidden">{t('yourJourney')}</h2>
      {note && <p className="itinerary-note">{note}</p>}

      {plan.length > 1 && (
        <div className="day-strip" role="tablist" aria-label={t('chooseDay')}>
          {plan.map((item, index) => (
            <button
              key={item.day}
              type="button"
              role="tab"
              aria-selected={index === selected}
              className="day-tab"
              onClick={() => setSelected(index)}
            >
              <b>{item.day}</b>
              {item.theme && <span>{item.theme}</span>}
            </button>
          ))}
        </div>
      )}

      <div className="day-detail" role="tabpanel">
        <header className="day-heading">
          <span>{t('day')} {day.day}</span>
          {day.theme && <h3>{day.theme}</h3>}
        </header>

        <ol className="day-line">
          {day.activities.map(activity => (
            <li key={`${activity.time}-${activity.title}`} className={`stop stop-${daypart(activity.time)}`}>
              <time className="stop-time">{activity.time}</time>
              <div className="stop-body">
                {activity.image ? (
                  <img src={activity.image} alt="" loading="lazy" className="stop-image" />
                ) : (
                  <span className={`stop-image stop-image-${activity.kind}`} aria-hidden="true" />
                )}
                <div className="stop-text">
                  <span className="stop-kind">{t(kindLabels[activity.kind])}</span>
                  <h4>{pick(activity.title, activity.titleAr)}</h4>
                  {activity.reason && <p>{activity.reason}</p>}
                  {activity.mapsUrl && (
                    <a href={activity.mapsUrl} target="_blank" rel="noopener noreferrer" className="stop-map">
                      {t('openMap')}
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
