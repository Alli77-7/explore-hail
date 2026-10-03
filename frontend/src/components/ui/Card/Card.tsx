// كرت بخلفية بيضاء وظل، ويظهر بحركة عند النزول للصفحة
import type { HTMLAttributes } from 'react';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { classNames } from '../../../utils/helpers';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLElement> {
  hoverable?: boolean;
}

export default function Card({ hoverable = true, className, children, ...rest }: CardProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <article ref={ref} className={classNames('card', 'reveal', hoverable && 'card-hoverable', className)} {...rest}>
      {children}
    </article>
  );
}
