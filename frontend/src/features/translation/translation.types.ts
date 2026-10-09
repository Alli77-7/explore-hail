// حالة التحليل: idle = ما فيه صورة جديدة، analyzing = جاري التحليل، done = النتيجة جاهزة
export type AnalysisStatus = 'idle' | 'analyzing' | 'done';

export interface TranslationState {
  imageUrl: string;
  imageName: string;
  status: AnalysisStatus;
  confidence: number; // نسبة الثقة التجريبية %
}
