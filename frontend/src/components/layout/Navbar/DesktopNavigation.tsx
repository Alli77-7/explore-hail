import { useLanguage } from '../../../hooks/useLanguage';
import type { MenuId } from './navbar.types';

const menuItems: Array<{ id: MenuId; name: string; nameAr: string }> = [
  { id: 'discover', name: 'Discover', nameAr: 'اكتشف' },
  { id: 'services', name: 'Services', nameAr: 'الخدمات' },
  { id: 'smart', name: 'Smart Experience', nameAr: 'التجربة الذكية' },
];

interface DesktopNavigationProps {
  activeMenu: MenuId;
  dropdownOpen: boolean;
  registerTrigger: (menu: MenuId, element: HTMLButtonElement | null) => void;
  onOpen: (menu: MenuId) => void;
  onToggle: (menu: MenuId) => void;
}

export default function DesktopNavigation({
  activeMenu,
  dropdownOpen,
  registerTrigger,
  onOpen,
  onToggle,
}: DesktopNavigationProps) {
  const { pick } = useLanguage();

  return (
    <div className="desktop-navigation" aria-label={pick('Main navigation', 'التنقل الرئيسي')}>
      {menuItems.map(item => {
        const expanded = dropdownOpen && activeMenu === item.id;

        return (
          <button
            key={item.id}
            ref={element => registerTrigger(item.id, element)}
            type="button"
            className={expanded ? 'active' : ''}
            aria-haspopup="true"
            aria-expanded={expanded}
            aria-controls="desktop-morphing-dropdown"
            onMouseEnter={() => onOpen(item.id)}
            onFocus={() => onOpen(item.id)}
            onClick={() => onToggle(item.id)}
            onKeyDown={event => {
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                onOpen(item.id);
              }
            }}
          >
            <span>{pick(item.name, item.nameAr)}</span>
            <svg viewBox="0 0 12 8" aria-hidden="true">
              <path d="m1 1.5 5 5 5-5" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
