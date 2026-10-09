// تقييم بالنجمة، مثال: ★ 4.9
import './Rating.css';

export default function Rating({ value }: { value: number }) {
  return <span className="rating" aria-label={`Rating ${value} of 5`}>★ {value}</span>;
}
