// خطوات الميزة: صوّر ← ارفع ← تحليل ← ترجمة محتملة ← سياق تاريخي
import Card from '../../../components/ui/Card/Card';
import { useLanguage } from '../../../hooks/useLanguage';
import type { TranslationKey } from '../../../utils/translations';

const steps: { icon: string; title: TranslationKey; text: TranslationKey }[] = [
  { icon: '▣', title: 'stepCaptureTitle', text: 'stepCaptureText' },
  { icon: '⇧', title: 'stepUploadTitle', text: 'stepUploadText' },
  { icon: 'AI', title: 'stepAnalyzeTitle', text: 'stepAnalyzeText' },
  { icon: '✎', title: 'stepMeaningTitle', text: 'stepMeaningText' },
  { icon: '⌛', title: 'stepContextTitle', text: 'stepContextText' },
];

export default function TranslationSteps() {
  const { t } = useLanguage();

  return (
    <div className="translation-steps">
      {steps.map((step, index) => (
        <Card key={step.title} className="step-card">
          <span className="step-number">0{index + 1}</span>
          <div className="step-icon">{step.icon}</div>
          <h3>{t(step.title)}</h3>
          <p>{t(step.text)}</p>
        </Card>
      ))}
    </div>
  );
}
