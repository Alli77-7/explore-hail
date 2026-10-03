// شارة نص صغيرة: "gold" فوق العناوين، و "dark" فوق صور الكروت
import type { ReactNode } from 'react';
import { classNames } from '../../../utils/helpers';
import './Badge.css';

interface BadgeProps {
  variant?: 'gold' | 'dark';
  className?: string;
  children: ReactNode;
}

export default function Badge({ variant = 'gold', className, children }: BadgeProps) {
  return <span className={classNames('badge', `badge-${variant}`, className)}>{children}</span>;
}
