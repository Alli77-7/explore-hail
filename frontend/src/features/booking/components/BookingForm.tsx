// نموذج الحجز. يعرض الخدمة المختارة ويرسل الطلب (تجريبي بدون سيرفر)
import { useState, type ChangeEvent, type FormEvent } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { classNames } from '../../../utils/helpers';
import type { BookingRequest, Service } from '../booking.types';

type FormFields = Omit<BookingRequest, 'serviceId' | 'checkIn' | 'checkOut' | 'roomType' | 'roomPrice'> & { checkIn: string; checkOut: string; roomType: string; roomPrice: number };

const emptyForm: FormFields = { fullName: '', email: '', phone: '', date: '', checkIn: '', checkOut: '', guests: '1', notes: '', roomType: 'studio', roomPrice: 250 };

const roomOptions = [
  { value: 'studio', label: 'استديو', price: 250 },
  { value: 'one-bedroom', label: 'غرفة وصالة', price: 350 },
  { value: 'two-bedroom', label: 'غرفتين وصالة', price: 450 },
];

interface BookingFormProps {
  selectedService: Service | null;
  onSubmit: (request: BookingRequest) => Promise<boolean>;
  onMissingService: () => void;
}

export default function BookingForm({ selectedService, onSubmit, onMissingService }: BookingFormProps) {
  const { t, pick } = useLanguage();
  const ref = useScrollReveal<HTMLFormElement>();
  const [form, setForm] = useState<FormFields>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دالة واحدة تحدّث أي حقل حسب اسمه (name)
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    if (!selectedService) {
      onMissingService();
      return;
    }
    setIsSubmitting(true);
    try {
      const submitted = await onSubmit({
        serviceId: selectedService.id,
        ...form,
        date: selectedService.type === 'hotel' ? form.checkIn : form.date,
        roomType: selectedService.type === 'hotel' ? form.roomType : undefined,
        roomPrice: selectedService.type === 'hotel' ? form.roomPrice : undefined,
      });
      if (submitted) setForm(emptyForm);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={ref} id="booking-form" className="booking-form panel reveal" onSubmit={handleSubmit}>
      <div>
        <Badge>{t('yourRequest')}</Badge>
        <h2>{t('bookingDetails')}</h2>
      </div>

      <div className={classNames('selected-service-box', selectedService && 'filled')}>
        <small>{t('selectedService')}</small>
        <strong>
          {selectedService ? `✓ ${pick(selectedService.name, selectedService.nameAr)}` : t('chooseService')}
        </strong>
      </div>

      <label className="field">
        <span>{t('fullName')}</span>
        <input className="input" name="fullName" value={form.fullName} onChange={handleChange} placeholder={t('fullNamePlaceholder')} required />
      </label>

      <label className="field">
        <span>{t('email')}</span>
        <input className="input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" required />
      </label>

      <label className="field">
        <span>{t('phone')}</span>
        <input className="input" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+966 5X XXX XXXX" required />
      </label>

      <div className="form-row">
        {selectedService?.type === 'hotel' ? <>
          <label className="field">
            <span>تسجيل الدخول</span>
            <input className="input" type="date" name="checkIn" value={form.checkIn} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>تسجيل الخروج</span>
            <input className="input" type="date" name="checkOut" value={form.checkOut} onChange={handleChange} min={form.checkIn || undefined} required />
          </label>
          <label className="field">
            <span>نوع السكن</span>
            <select className="input" name="roomType" value={form.roomType} onChange={event => { const option = roomOptions.find(item => item.value === event.target.value) ?? roomOptions[0]; setForm(current => ({ ...current, roomType: option.value, roomPrice: option.price })); }} required>
              {roomOptions.map(option => <option key={option.value} value={option.value}>{option.label} — {option.price} ريال / ليلة</option>)}
            </select>
            <strong className="room-price">السعر: {form.roomPrice} ريال / ليلة</strong>
          </label>
        </> : selectedService?.type === 'restaurant' ? null : <label className="field">
          <span>{t('date')}</span>
          <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>}

        <label className="field">
          <span>{t('guests')}</span>
          <select className="input" name="guests" value={form.guests} onChange={handleChange}>
            <option value="1">{t('guests1')}</option>
            <option value="2">{t('guests2')}</option>
            <option value="3">{t('guests3')}</option>
            <option value="4+">{t('guests4')}</option>
          </select>
        </label>
      </div>

      <label className="field">
        <span>{t('notes')}</span>
        <textarea className="input" name="notes" value={form.notes} onChange={handleChange} placeholder={t('notesPlaceholder')} />
      </label>

      <Button type="submit" fullWidth disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'جاري إرسال الطلب...' : t('sendBooking')}
      </Button>
    </form>
  );
}
