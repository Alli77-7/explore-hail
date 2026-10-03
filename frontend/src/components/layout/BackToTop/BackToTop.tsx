// زر ↑ يظهر بعد النزول في الصفحة ويرجّعك للأعلى
import { useEffect, useState } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import { classNames } from '../../../utils/helpers';
import './BackToTop.css';

export default function BackToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={classNames('back-to-top', visible && 'show')}
      aria-label={t('backToTop')}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      ↑
    </button>
  );
}
