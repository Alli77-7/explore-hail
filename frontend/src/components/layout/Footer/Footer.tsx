// الفوتر أسفل كل الصفحات
import { useLanguage } from '../../../hooks/useLanguage';
import './Footer.css';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div>
        <b><span className="footer-mark">⌖</span> {t('brand')}</b>
        <small>{t('footerTagline')}</small>
      </div>
    </footer>
  );
}
