// تعرض الرسالة القادمة من useToast
import type { ToastMessage } from '../../../hooks/useToast';
import { classNames } from '../../../utils/helpers';
import './Toast.css';

export default function Toast({ toast }: { toast: ToastMessage | null }) {
  return (
    <div className={classNames('toast', toast && 'show', toast?.type)} role="status" aria-live="polite">
      {toast?.text}
    </div>
  );
}
