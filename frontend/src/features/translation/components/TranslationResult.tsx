// كرت النتيجة: النوع + المعنى المحتمل + السياق التاريخي (نتيجة تجريبية للعرض فقط)
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import type { AnalysisStatus } from '../translation.types';

interface TranslationResultProps {
  status: AnalysisStatus;
  confidence: number;
  onSave: () => void;
}

export default function TranslationResult({ status, confidence, onSave }: TranslationResultProps) {
  const { t } = useLanguage();
  const ref = useScrollReveal<HTMLDivElement>();
  const isAnalyzing = status === 'analyzing';

  return (
    <div ref={ref} className="result-card reveal">
      <div className="result-header">
        <span className="result-scan">{t('aiAnalysis')}</span>
        <b className={isAnalyzing ? 'analyzing' : ''}>{isAnalyzing ? t('analyzing') : `${confidence}%`}</b>
      </div>

      <Badge>{t('preview')}</Badge>
      <h2>{t('translationPreview')}</h2>

      {/* أثناء التحليل نخفف ظهور النتائج */}
      <div className={isAnalyzing ? 'result-boxes loading' : 'result-boxes'}>
        <div className="result-box">
          <small>{t('detectedType')}</small>
          <h3>{t('thamudicInscription')}</h3>
        </div>
        <div className="result-box">
          <small>{t('possibleMeaning')}</small>
          <p>{t('possibleMeaningText')}</p>
        </div>
        <div className="result-box">
          <small>{t('historicalContext')}</small>
          <p>{t('historicalContextText')}</p>
        </div>
      </div>

      <p className="result-note">{t('prototypeNote')}</p>
      <Button variant="secondary" onClick={onSave} disabled={isAnalyzing}>
        {t('saveTranslation')}
      </Button>
    </div>
  );
}
