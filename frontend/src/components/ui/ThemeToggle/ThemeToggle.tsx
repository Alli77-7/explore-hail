// زر الوضع الليلي 🌙 / النهاري ☀️
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../hooks/useTheme';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={t('toggleTheme')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
