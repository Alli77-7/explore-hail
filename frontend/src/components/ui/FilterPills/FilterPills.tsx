// أزرار فلترة دائرية (الكل / تاريخي / طبيعي...). الزر المختار يكون ذهبي
import type { FilterOption } from '../../../types';
import './FilterPills.css';

interface FilterPillsProps<T extends string> {
  options: FilterOption<T>[];
  active: T;
  onChange: (id: T) => void;
}

export default function FilterPills<T extends string>({ options, active, onChange }: FilterPillsProps<T>) {
  return (
    <div className="filter-pills">
      {options.map(option => (
        <button
          key={option.id}
          type="button"
          className={option.id === active ? 'active' : ''}
          aria-pressed={option.id === active}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
