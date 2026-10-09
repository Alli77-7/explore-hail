// الشريط العلوي: الشعار + روابط الصفحات + اللغة + الوضع الليلي
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';
import type { TranslationKey } from '../../../utils/translations';
import { classNames } from '../../../utils/helpers';
import LanguageSwitcher from '../../ui/LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import './Navbar.css';

const navLinks: { to: string; label: TranslationKey }[] = [
  { to: '/', label: 'navHome' },
  { to: '/attractions', label: 'navAttractions' },
  { to: '/booking', label: 'navBooking' },
  { to: '/translation', label: 'navTranslation' },
  { to: '/trip-planner', label: 'navPlanner' },
];

export default function Navbar() {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // نضيف ظل أقوى للشريط بعد ما ينزل المستخدم
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={classNames('navbar', scrolled && 'scrolled')}>
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <span className="navbar-logo-mark">⌖</span>
        <b>{t('brand')}</b>
      </Link>

      <button
        type="button"
        className="navbar-menu-btn"
        aria-label={t('openMenu')}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(open => !open)}
      >
        ☰
      </button>

      <div className={classNames('navbar-links', menuOpen && 'open')}>
        {navLinks.map(link => (
          // NavLink يضيف كلاس "active" تلقائياً للصفحة الحالية
          <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={closeMenu}>
            {t(link.label)}
          </NavLink>
        ))}

        <div className="navbar-actions">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
