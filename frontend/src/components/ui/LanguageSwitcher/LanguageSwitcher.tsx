// زرّين للتبديل بين English و العربية
import { useLanguage } from '../../../hooks/useLanguage';
import './LanguageSwitcher.css';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="lang-switcher">
      <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
        English
      </button>
      <button type="button" className={lang === 'ar' ? 'active' : ''} onClick={() => setLang('ar')}>
        العربية
      </button>
    </div>
  );
}
