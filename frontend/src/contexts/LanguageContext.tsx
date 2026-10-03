// اللغة الحالية (عربي/إنجليزي) متاحة لكل الصفحات عن طريق Context
import { createContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '../types';
import { translations, type TranslationKey } from '../utils/translations';
import { readStorage, writeStorage } from '../utils/helpers';

const STORAGE_KEY = 'exploreHailLang';

export interface LanguageContextValue {
  lang: Language;
  isArabic: boolean;
  setLang: (lang: Language) => void;
  // يرجّع نص الواجهة باللغة الحالية من ملف الترجمات
  t: (key: TranslationKey) => string;
  // يختار بين نصين (للبيانات اللي فيها name و nameAr)
  pick: (en: string, ar: string) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>(() => (readStorage(STORAGE_KEY) === 'ar' ? 'ar' : 'en'));
  const isArabic = lang === 'ar';

  // كل ما تتغير اللغة: نحدّث اتجاه الصفحة ونحفظ الاختيار
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    writeStorage(STORAGE_KEY, lang);
  }, [lang, isArabic]);

  const value: LanguageContextValue = {
    lang,
    isArabic,
    setLang,
    t: key => translations[lang][key],
    pick: (en, ar) => (isArabic ? ar : en),
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
