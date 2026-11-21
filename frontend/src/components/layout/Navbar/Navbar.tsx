import { useEffect, useRef, useState, type FocusEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../../hooks/useLanguage';
import { classNames } from '../../../utils/helpers';
import { getCurrentRole, isAuthenticated } from '../../../services/auth';
import LanguageSwitcher from '../../ui/LanguageSwitcher/LanguageSwitcher';
import ThemeToggle from '../../ui/ThemeToggle/ThemeToggle';
import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import MorphingDropdown from './MorphingDropdown';
import type { DropdownDirection, MenuId } from './navbar.types';
import './Navbar.css';

const CLOSE_DELAY = 140;
const MORPH_DURATION = 500;

export default function Navbar() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const navbarRef = useRef<HTMLElement>(null);
  const triggerElementsRef = useRef<Partial<Record<MenuId, HTMLButtonElement>>>({});
  const closeTimerRef = useRef<number | null>(null);
  const morphTimerRef = useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId>('discover');
  const [previousMenu, setPreviousMenu] = useState<MenuId | null>(null);
  const [direction, setDirection] = useState<DropdownDirection>('right');
  const [scrolled, setScrolled] = useState(false);

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const closeNavigation = () => {
    clearCloseTimer();
    setDropdownOpen(false);
    setMobileOpen(false);
    setPreviousMenu(null);
  };

  const openMenu = (menu: MenuId) => {
    clearCloseTimer();

    if (dropdownOpen && menu !== activeMenu) {
      const currentRect = triggerElementsRef.current[activeMenu]?.getBoundingClientRect();
      const nextRect = triggerElementsRef.current[menu]?.getBoundingClientRect();

      if (currentRect && nextRect) {
        const currentCenter = currentRect.left + currentRect.width / 2;
        const nextCenter = nextRect.left + nextRect.width / 2;
        setDirection(nextCenter >= currentCenter ? 'right' : 'left');
      }

      setPreviousMenu(activeMenu);
      if (morphTimerRef.current !== null) window.clearTimeout(morphTimerRef.current);
      morphTimerRef.current = window.setTimeout(() => setPreviousMenu(null), MORPH_DURATION);
    }

    setActiveMenu(menu);
    setDropdownOpen(true);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
      setPreviousMenu(null);
    }, CLOSE_DELAY);
  };

  const registerTrigger = (menu: MenuId, element: HTMLButtonElement | null) => {
    if (element) triggerElementsRef.current[menu] = element;
    else delete triggerElementsRef.current[menu];
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    closeNavigation();
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!navbarRef.current?.contains(event.target as Node)) closeNavigation();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNavigation();
    };
    const onResize = () => {
      if (window.innerWidth <= 860) setDropdownOpen(false);
      else setMobileOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => () => {
    clearCloseTimer();
    if (morphTimerRef.current !== null) window.clearTimeout(morphTimerRef.current);
  }, []);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!navbarRef.current?.contains(event.relatedTarget as Node | null)) scheduleClose();
  };

  const solidNavbar = scrolled || location.pathname !== '/';

  return (
    <nav
      ref={navbarRef}
      className={classNames('navbar', solidNavbar && 'navbar-solid', mobileOpen && 'mobile-open')}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
      onBlur={handleBlur}
    >
      <Link to="/" className="navbar-logo" aria-label={t('brand')} onClick={closeNavigation}>
        <span className="navbar-logo-mark" aria-hidden="true">⌖</span>
        <b>{t('brand')}</b>
      </Link>

      <DesktopNavigation
        activeMenu={activeMenu}
        dropdownOpen={dropdownOpen}
        registerTrigger={registerTrigger}
        onOpen={openMenu}
        onToggle={openMenu}
      />

      <div className="navbar-actions">
        <Link to="/booking-status" className="navbar-track-link" onClick={closeNavigation}>
          {lang === 'ar' ? 'تتبع الحجز' : 'Track booking'}
        </Link>
        <button
          type="button"
          className="navbar-login-btn"
          onClick={() => {
            const authenticated = isAuthenticated();
            const role = getCurrentRole();
            window.location.assign(
              !authenticated
                ? '/login'
                : role === 'restaurant'
                  ? '/restaurant-queue'
                  : role === 'hotel'
                    ? '/hotel-dashboard'
                    : '/dashboard',
            );
          }}
          aria-label={lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <path d="m10 17 5-5-5-5" />
            <path d="M15 12H3" />
          </svg>
          <span>{lang === 'ar' ? 'تسجيل الدخول' : 'Sign in'}</span>
        </button>
        <LanguageSwitcher />
        <ThemeToggle />
        <button
          type="button"
          className="navbar-menu-btn"
          aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setDropdownOpen(false);
            setMobileOpen(open => !open);
          }}
        >
          <span />
          <span />
        </button>
      </div>

      <MorphingDropdown
        activeMenu={activeMenu}
        previousMenu={previousMenu}
        direction={direction}
        open={dropdownOpen}
        triggerElements={triggerElementsRef.current}
        layoutKey={lang}
        onNavigate={closeNavigation}
        onCancelClose={clearCloseTimer}
        onScheduleClose={scheduleClose}
      />

      <MobileNavigation open={mobileOpen} onNavigate={closeNavigation} />
    </nav>
  );
}
