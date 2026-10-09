// نموذج اختيار الاهتمامات ومدة الرحلة
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { dayOptions, interestOptions } from '../planner.data';
import type { Interest, TripDays, TripPreferences } from '../planner.types';

interface PlannerFormProps {
  preferences: TripPreferences;
  onChange: (preferences: TripPreferences) => void;
  onGenerate: () => void;
}

export default function PlannerForm({ preferences, onChange, onGenerate }: PlannerFormProps) {
  const { t } = useLanguage();
  const ref = useScrollReveal<HTMLDivElement>();

  // إضافة الاهتمام إذا مو موجود، وحذفه إذا موجود
  const toggleInterest = (interest: Interest) => {
    const interests = preferences.interests.includes(interest)
      ? preferences.interests.filter(item => item !== interest)
      : [...preferences.interests, interest];
    onChange({ ...preferences, interests });
  };

  return (
    <div ref={ref} className="planner-form panel reveal">
      <Badge>{t('yourPreferences')}</Badge>
      <h2>{t('planJourney')}</h2>

      <span className="field-title">{t('interests')}</span>
      <div className="check-grid">
        {interestOptions.map(option => (
          <label key={option.id}>
            <input
              type="checkbox"
              checked={preferences.interests.includes(option.id)}
              onChange={() => toggleInterest(option.id)}
            />
            <span>{t(option.label)}</span>
          </label>
        ))}
      </div>

      <label className="field-title" htmlFor="trip-days">{t('tripDuration')}</label>
      <select
        id="trip-days"
        className="input"
        value={preferences.days}
        onChange={event => onChange({ ...preferences, days: Number(event.target.value) as TripDays })}
      >
        {dayOptions.map(option => (
          <option key={option.value} value={option.value}>{t(option.label)}</option>
        ))}
      </select>

      <Button fullWidth onClick={onGenerate}>{t('generatePlan')}</Button>
    </div>
  );
}
