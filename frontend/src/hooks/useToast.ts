// رسالة قصيرة تظهر أسفل الشاشة ثم تختفي (مثل: تم إرسال الحجز)
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

export function useToast(duration = 3800) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // نخفي الرسالة بعد مدة
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(timer);
  }, [toast, duration]);

  const showToast = (text: string, type: ToastType = 'success') => setToast({ text, type });

  return { toast, showToast };
}
