import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import DiscoverPanel from './DiscoverPanel';
import ServicesPanel from './ServicesPanel';
import SmartExperiencePanel from './SmartExperiencePanel';
import type { DropdownDirection, MenuId } from './navbar.types';

const panelWidths: Record<MenuId, number> = {
  discover: 760,
  services: 840,
  smart: 480,
};

interface MorphingDropdownProps {
  activeMenu: MenuId;
  previousMenu: MenuId | null;
  direction: DropdownDirection;
  open: boolean;
  triggerElements: Partial<Record<MenuId, HTMLButtonElement>>;
  layoutKey: string;
  onNavigate: () => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
}

interface DropdownMetrics {
  x: number;
  width: number;
  height: number;
}

export default function MorphingDropdown({
  activeMenu,
  previousMenu,
  direction,
  open,
  triggerElements,
  layoutKey,
  onNavigate,
  onCancelClose,
  onScheduleClose,
}: MorphingDropdownProps) {
  const { pick } = useLanguage();
  const measureRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<DropdownMetrics>({ x: 16, width: panelWidths.discover, height: 380 });
  const [hasMetrics, setHasMetrics] = useState(false);
  const [firstOpen, setFirstOpen] = useState(true);
  const wasOpenRef = useRef(false);

  const desiredWidth = Math.min(panelWidths[activeMenu], typeof window === 'undefined' ? panelWidths[activeMenu] : window.innerWidth - 32);

  const renderPanel = (menu: MenuId) => {
    if (menu === 'discover') return <DiscoverPanel onNavigate={onNavigate} />;
    if (menu === 'services') return <ServicesPanel onNavigate={onNavigate} />;
    return <SmartExperiencePanel onNavigate={onNavigate} />;
  };

  useLayoutEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    const measure = () => {
      const trigger = triggerElements[activeMenu];
      const measuredContent = measureRef.current;
      if (!trigger || !measuredContent) return;

      const width = Math.min(panelWidths[activeMenu], window.innerWidth - 32);
      const triggerRect = trigger.getBoundingClientRect();
      const height = Math.ceil(measuredContent.getBoundingClientRect().height);
      const centeredX = triggerRect.left + triggerRect.width / 2 - width / 2;
      const x = Math.min(Math.max(16, centeredX), window.innerWidth - width - 16);

      if (!wasOpenRef.current) setFirstOpen(true);
      setMetrics({ x, width, height });
      setHasMetrics(true);
      wasOpenRef.current = true;
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeMenu, layoutKey, open, triggerElements]);

  useLayoutEffect(() => {
    if (!open || !firstOpen) return;
    const timer = window.setTimeout(() => setFirstOpen(false), 420);
    return () => window.clearTimeout(timer);
  }, [firstOpen, open]);

  const shellStyle: CSSProperties = {
    left: metrics.x,
    width: metrics.width,
    height: metrics.height,
  };

  return (
    <>
      <div ref={measureRef} className="dropdown-measurer" style={{ width: desiredWidth }} aria-hidden="true">
        {renderPanel(activeMenu)}
      </div>

      <div
        id="desktop-morphing-dropdown"
        className={`morphing-dropdown move-${direction} ${open && hasMetrics ? 'open' : ''} ${firstOpen ? 'first-open' : ''}`}
        style={shellStyle}
        aria-hidden={!open}
        aria-label={pick('Explore Hail navigation', 'قائمة استكشف حائل')}
        onMouseEnter={onCancelClose}
        onMouseLeave={onScheduleClose}
      >
        <div className="morphing-dropdown-sheen" aria-hidden="true" />
        {previousMenu && previousMenu !== activeMenu && (
          <div key={`previous-${previousMenu}`} className="dropdown-panel-layer exiting" aria-hidden="true">
            {renderPanel(previousMenu)}
          </div>
        )}
        <div key={activeMenu} className="dropdown-panel-layer entering">
          {renderPanel(activeMenu)}
        </div>
      </div>
    </>
  );
}
