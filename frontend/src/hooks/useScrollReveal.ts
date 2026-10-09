// حركة الظهور عند النزول: نربط ref بالعنصر، ولما يظهر في الشاشة نضيف له كلاس "show"
import { useEffect, useRef } from 'react';

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // متصفحات قديمة ما تدعم IntersectionObserver: نعرض العنصر مباشرة
    if (!('IntersectionObserver' in window)) {
      element.classList.add('show');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('show');
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return ref;
}
