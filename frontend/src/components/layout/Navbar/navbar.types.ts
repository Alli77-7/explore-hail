export type MenuId = 'discover' | 'services' | 'smart';

export type DropdownDirection = 'left' | 'right';

export interface NavigationPanelProps {
  onNavigate: () => void;
}
