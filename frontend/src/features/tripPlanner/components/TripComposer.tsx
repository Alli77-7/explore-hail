// مكان كتابة الطلب الحر + الاختيارات السريعة
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { dayOptions, interestOptions, requestExamples } from '../planner.data';
import type { Interest, TripPreferences } from '../planner.types';

const MAX_REQUEST_LENGTH = 800;

interface TripComposerProps {
  preferences: TripPreferences;
  onChange: (preferences: TripPreferences) => void;
  onGenerate: () => void;
  loading: boolean;
}

export default function TripComposer({ preferences, onChange, onGenerate, loading }: TripComposerProps) {
  const { t } = useLanguage();

  // إضافة الاهتمام إذا مو موجود، وحذفه إذا موجود
  const toggleInterest = (interest: Interest) => {
    const interests = preferences.interests.includes(interest)
      ? preferences.interests.filter(item => item !== interest)
      : [...preferences.interests, interest];
    onChange({ ...preferences, interests });
  };

  return (
    <form
      className="composer"
      onSubmit={event => {
        event.preventDefault();
        onGenerate();
      }}
    >
      <div className="composer-write">
        <label className="composer-label" htmlFor="trip-request">{t('requestLabel')}</label>
        <p className="composer-hint">{t('requestHint')}</p>

        <textarea
          id="trip-request"
          className="composer-input"
          rows={5}
          maxLength={MAX_REQUEST_LENGTH}
          placeholder={t('requestPlaceholder')}
          value={preferences.request}
          onChange={event => onChange({ ...preferences, request: event.target.value })}
        />

        <div className="composer-examples">
          <span>{t('requestExamplesLabel')}</span>
          <div>
            {requestExamples.map(example => (
              <button
                key={example}
                type="button"
                className="composer-example"
                onClick={() => onChange({ ...preferences, request: t(example) })}
              >
                {t(example)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="composer-quick">
        <span className="composer-quick-title">{t('quickOptions')}</span>
        <p className="composer-hint">{t('quickOptionsHint')}</p>

        <fieldset className="composer-group">
          <legend>{t('interests')}</legend>
          <div className="composer-chips">
            {interestOptions.map(option => (
              <label key={option.id} className="composer-chip">
                <input
                  type="checkbox"
                  checked={preferences.interests.includes(option.id)}
                  onChange={() => toggleInterest(option.id)}
                />
                <span>{t(option.label)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="composer-group">
          <legend>{t('tripDuration')}</legend>
          <div className="composer-chips">
            {dayOptions.map(days => (
              <label key={days} className="composer-chip">
                <input
                  type="radio"
                  name="trip-days"
                  checked={preferences.days === days}
                  onChange={() => onChange({ ...preferences, days })}
                />
                <span>{days} {t(days === 1 ? 'dayCountOne' : 'dayCount')}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <Button type="submit" fullWidth disabled={loading} aria-busy={loading}>
          {loading ? t('planGenerating') : t('generatePlan')}
        </Button>
      </div>
    </form>
  );
}
