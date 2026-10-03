// البانر الداكن أعلى كل صفحة داخلية (المعالم، الحجز، الترجمة، المخطط)
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import './PageHeader.css';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  text: string;
}

export default function PageHeader({ eyebrow, title, text }: PageHeaderProps) {
  const ref = useScrollReveal<HTMLElement>();

  return (
    <header ref={ref} className="page-header reveal">
      <span className="page-header-eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{text}</p>
    </header>
  );
}
