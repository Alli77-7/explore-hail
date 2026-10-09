// أنواع مشتركة يستخدمها التطبيق كله

export type Language = 'en' | 'ar';

export type Theme = 'light' | 'dark';

// خيار واحد في شريط الفلاتر (مثل: الكل، تاريخي، طبيعي...)
export interface FilterOption<T extends string = string> {
  id: T;
  label: string;
}
