// زر واحد نستخدمه في كل الموقع.
// - to   → رابط داخلي (صفحة ثانية في الموقع)
// - href → رابط خارجي (يفتح في تبويب جديد)
// - بدونهم → زر عادي
import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../../utils/helpers';
import './Button.css';

type ButtonVariant = 'primary' | 'glass' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  fullWidth?: boolean;
  to?: string;
  href?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  to,
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = classNames('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', fullWidth && 'btn-full', className);

  if (to) {
    return <Link to={to} className={classes}>{children}</Link>;
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
