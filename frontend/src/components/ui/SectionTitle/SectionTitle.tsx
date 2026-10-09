// عنوان قسم: شارة صغيرة + عنوان كبير + وصف اختياري
import Badge from '../Badge/Badge';
import { classNames } from '../../../utils/helpers';
import './SectionTitle.css';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  text?: string;
  centered?: boolean;
}

export default function SectionTitle({ eyebrow, title, text, centered = false }: SectionTitleProps) {
  return (
    <div className={classNames('section-title', centered && 'section-title-centered')}>
      <Badge>{eyebrow}</Badge>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
