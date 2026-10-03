// مربع رفع صورة النقش (ضغط أو سحب وإفلات) مع معاينة الصورة
import { useState, type ChangeEvent } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { classNames } from '../../../utils/helpers';

interface ImageUploaderProps {
  imageUrl: string;
  imageName: string;
  onUpload: (file: File) => void;
}

export default function ImageUploader({ imageUrl, imageName, onUpload }: ImageUploaderProps) {
  const { t } = useLanguage();
  const ref = useScrollReveal<HTMLDivElement>();
  const [dragging, setDragging] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div
      ref={ref}
      className={classNames('upload-box', 'reveal', dragging && 'dragging')}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={() => setDragging(false)}
    >
      {/* الـ input شفاف ويغطي المربع كامل، فأي ضغطة أو سحب صورة يفتح الاختيار */}
      <input type="file" accept="image/*" onChange={handleChange} aria-label={t('uploadTitle')} />

      <div className="upload-icon">⌑</div>
      <Badge>{t('yourInscription')}</Badge>
      <h3>{t('uploadTitle')}</h3>
      <p>{t('uploadText')}</p>
      <span className="upload-btn">{t('chooseImage')}</span>
      <img src={imageUrl} alt={imageName} />
    </div>
  );
}
