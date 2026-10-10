// "كيف فهمت طلبك": نص المستخدم نفسه والجمل اللي اعتمد عليها الـ AI ملوّنة،
// وكل جملة مربوطة بالقرار اللي أخذه بسببها
import type { ReactNode } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { interestOptions, paceLabels } from '../planner.data';
import type { PlanInsight, SmartPlan } from '../planner.types';

// نوحّد الحروف عشان "انا" تطابق "أنا" و "٢٠" تطابق "20"
// كل حرف يتبدل بحرف واحد، فالمواقع تبقى نفسها في النص الأصلي
function normalize(text: string) {
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[٠-٩]/g, digit => String(digit.charCodeAt(0) - 0x0660))
    .toLowerCase();
}

// نقسم الطلب لقطع: عادية، وقطع مطابقة لاقتباس (معها رقمه)
function highlightRequest(request: string, insights: PlanInsight[]): ReactNode[] {
  const source = normalize(request);
  const ranges = insights
    .map((insight, index) => {
      const start = source.indexOf(normalize(insight.quote));
      return { start, end: start + insight.quote.length, number: index + 1 };
    })
    .filter(range => range.start >= 0)
    .sort((a, b) => a.start - b.start);

  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const range of ranges) {
    if (range.start < cursor) continue; // اقتباسين متداخلين: نكتفي بالأول
    parts.push(request.slice(cursor, range.start));
    parts.push(
      <mark key={range.number} className="reading-mark">
        {request.slice(range.start, range.end)}
        <sup>{range.number}</sup>
      </mark>,
    );
    cursor = range.end;
  }
  parts.push(request.slice(cursor));
  return parts;
}

export default function PlanReading({ plan }: { plan: SmartPlan }) {
  const { t, pick } = useLanguage();
  const { understanding, insights, stay, request } = plan;
  const interestLabels = interestOptions.filter(option => understanding.interests.includes(option.id));

  return (
    <section id="plan-reading" className="reading" aria-labelledby="reading-title">
      <div className="reading-request">
        <h2 id="reading-title">{t('readingTitle')}</h2>

        {request ? (
          <blockquote className="reading-quote">{highlightRequest(request, insights)}</blockquote>
        ) : (
          <p className="reading-empty">{t('readingNoRequest')}</p>
        )}

        <ul className="reading-facts">
          {understanding.travelers && <li>{understanding.travelers}</li>}
          <li>{understanding.tripDays} {t(understanding.tripDays === 1 ? 'dayCountOne' : 'dayCount')}</li>
          <li>{t(paceLabels[understanding.pace])}</li>
          {interestLabels.map(option => <li key={option.id}>{t(option.label)}</li>)}
        </ul>

        {understanding.summary && <p className="reading-summary">{understanding.summary}</p>}
      </div>

      <div className="reading-decisions">
        <div className="reading-columns" aria-hidden="true">
          <span>{t('youSaid')}</span>
          <span>{t('soIDid')}</span>
        </div>

        <ol>
          {insights.map((insight, index) => (
            <li key={index} className="reading-row">
              <span className="reading-number">{index + 1}</span>
              <q>{insight.quote}</q>
              <p>{insight.decision}</p>
            </li>
          ))}
        </ol>

        {stay && (
          <div className="reading-stay">
            <img src={stay.image} alt="" loading="lazy" />
            <div>
              <span>{t('stayTitle')}</span>
              <h3>{pick(stay.title, stay.titleAr)}</h3>
              <p>{stay.reason}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
