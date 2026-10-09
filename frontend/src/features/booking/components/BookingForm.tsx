// نموذج الحجز. يعرض الخدمة المختارة ويرسل الطلب (تجريبي بدون سيرفر)
import { useState, type ChangeEvent, type FormEvent } from 'react';
import Badge from '../../../components/ui/Badge/Badge';
import Button from '../../../components/ui/Button/Button';
import { useLanguage } from '../../../hooks/useLanguage';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import { classNames } from '../../../utils/helpers';
import type { BookingRequest, Service } from '../booking.types';

type FormFields = Omit<BookingRequest, 'serviceId'>;

const emptyForm: FormFields = { fullName: '', email: '', phone: '', date: '', guests: '1', notes: '' };

interface BookingFormProps {
  selectedService: Service | null;
  onSubmit: (request: BookingRequest) => void;
  onMissingService: () => void;
}

export default function BookingForm({ selectedService, onSubmit, onMissingService }: BookingFormProps) {
  const { t, pick } = useLanguage();
  const ref = useScrollReveal<HTMLFormElement>();
  const [form, setForm] = useState<FormFields>(emptyForm);

  // دالة واحدة تحدّث أي حقل حسب اسمه (name)
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedService) {
      onMissingService();
      return;
    }
    onSubmit({ serviceId: selectedService.id, ...form });
    setForm(emptyForm);
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
        <label className="field">
          <span>{t('date')}</span>
          <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

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

      <Button type="submit" fullWidth>{t('sendBooking')}</Button>
    </form>
  );
}
