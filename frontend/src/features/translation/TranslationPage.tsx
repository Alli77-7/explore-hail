// صفحة ترجمة النقوش الثمودية (نموذج أولي للواجهة — بدون ذكاء اصطناعي حقيقي)
import { useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import sampleInscription from '../../assets/images/translation/sample-inscription.jpg';
import ImageUploader from './components/ImageUploader';
import TranslationResult from './components/TranslationResult';
import TranslationSteps from './components/TranslationSteps';
import type { TranslationState } from './translation.types';
import './translation.css';

const ANALYSIS_TIME = 1800; // مدة "التحليل" التجريبية بالملي ثانية

export default function TranslationPage() {
  const { t } = useLanguage();
  const { toast, showToast } = useToast();
  const [state, setState] = useState<TranslationState>({
    imageUrl: sampleInscription,
    imageName: 'Sample Thamudic inscription',
    status: 'done',
    confidence: 97,
  });

  // محاكاة التحليل: بعد ثانيتين تقريباً نعرض النتيجة بنسبة ثقة عشوائية بين 90 و 98
  useEffect(() => {
    if (state.status !== 'analyzing') return;
    const timer = setTimeout(() => {
      setState(current => ({ ...current, status: 'done', confidence: 90 + Math.floor(Math.random() * 9) }));
    }, ANALYSIS_TIME);
    return () => clearTimeout(timer);
  }, [state.status]);

  const handleUpload = (file: File) => {
    // نحرر رابط الصورة القديمة من الذاكرة قبل ما نعرض الجديدة
    if (state.imageUrl.startsWith('blob:')) URL.revokeObjectURL(state.imageUrl);
    setState({ imageUrl: URL.createObjectURL(file), imageName: file.name, status: 'analyzing', confidence: 0 });
  };

  return (
    <div className="container page-container">
      <PageHeader eyebrow={t('translationEyebrow')} title={t('translationTitle')} text={t('translationText')} />

      <TranslationSteps />

      <div className="translation-layout">
        <ImageUploader imageUrl={state.imageUrl} imageName={state.imageName} onUpload={handleUpload} />
        <TranslationResult
          status={state.status}
          confidence={state.confidence}
          onSave={() => showToast(t('translationSaved'))}
        />
      </div>

      <Toast toast={toast} />
    </div>
  );
}
