// دوال مساعدة صغيرة نستخدمها في أكثر من مكان

// يجمع أسماء الكلاسات ويتجاهل الفارغ، مثال: classNames('btn', isActive && 'active')
export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}

// رابط بحث في قوقل ماب لمكان معيّن
export function googleMapsUrl(placeName: string): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${placeName} Hail Saudi Arabia`)}`;
}

// قراءة آمنة من localStorage (بعض المتصفحات تمنعه في الوضع الخاص)
export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // نتجاهل الخطأ: الإعداد ببساطة ما راح ينحفظ
  }
}
