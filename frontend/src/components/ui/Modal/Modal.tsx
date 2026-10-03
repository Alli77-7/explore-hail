// نافذة منبثقة عامة: تقفل بزر ✕ أو بالضغط خارجها أو بزر Esc
import { useEffect, type ReactNode } from 'react';
import { useLanguage } from '../../../hooks/useLanguage';
import './Modal.css';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, labelledBy, children }: ModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    // نمنع تمرير الصفحة الخلفية وقت فتح النافذة
    document.body.classList.add('no-scroll');
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button type="button" className="modal-close" onClick={onClose} aria-label={t('close')} autoFocus>
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
