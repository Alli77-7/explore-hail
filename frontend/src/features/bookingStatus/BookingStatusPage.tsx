import { useState, type FormEvent } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import { useLanguage } from '../../hooks/useLanguage';
import { lookupBooking, type BookingStatus } from '../../services/bookingStatus';
import './bookingStatus.css';

const statusLabels = { pending: 'قيد المراجعة', confirmed: 'مؤكد', completed: 'مكتمل', cancelled: 'ملغي' };

export default function BookingStatusPage() {
  const { lang } = useLanguage();
  const [bookingId, setBookingId] = useState('');
  const [phone, setPhone] = useState('');
  const [booking, setBooking] = useState<BookingStatus | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setBooking(null); setLoading(true);
    try { setBooking(await lookupBooking(bookingId, phone)); }
    catch { setError(lang === 'ar' ? 'لم يتم العثور على حجز بهذه البيانات.' : 'No booking was found with these details.'); }
    finally { setLoading(false); }
  };

  const isArabic = lang === 'ar';
  const statusText = booking ? (isArabic ? statusLabels[booking.status] : booking.status) : '';
  return <main className="container page-container booking-status-page">
    <PageHeader eyebrow={isArabic ? 'متابعة' : 'Track'} title={isArabic ? 'تتبع حالة الحجز' : 'Track your booking'} text={isArabic ? 'أدخل رقم الطلب ورقم الجوال لمعرفة آخر حالة لحجزك.' : 'Enter your booking number and phone number to see the latest status.'} />
    <section className="booking-status-card panel">
      <form className="booking-status-form" onSubmit={submit}>
        <label className="field"><span>{isArabic ? 'رقم الطلب' : 'Booking number'}</span><input className="input" inputMode="numeric" value={bookingId} onChange={event => setBookingId(event.target.value)} required /></label>
        <label className="field"><span>{isArabic ? 'رقم الجوال' : 'Phone number'}</span><input className="input" type="tel" placeholder="+966 5X XXX XXXX" value={phone} onChange={event => setPhone(event.target.value)} required /></label>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? (isArabic ? 'جاري البحث...' : 'Searching...') : (isArabic ? 'عرض حالة الحجز' : 'View booking status')}</button>
      </form>
      {booking && <div className="booking-status-result"><div className="booking-status-result-head"><div><small>{isArabic ? 'المنشأة' : 'Provider'}</small><h2>{isArabic ? booking.name_ar : booking.business_name}</h2></div><strong className={`booking-status-badge ${booking.status}`}>{statusText}</strong></div><div className="booking-status-details"><span>{isArabic ? 'رقم الطلب' : 'Booking number'} <b>#{booking.id}</b></span>{booking.queue_position && <span>{isArabic ? 'رقم الانتظار' : 'Queue number'} <b>#{booking.queue_position}</b></span>}{booking.check_in_date && <span>{isArabic ? 'الوصول' : 'Check-in'} <b>{booking.check_in_date}</b></span>}{booking.check_out_date && <span>{isArabic ? 'المغادرة' : 'Check-out'} <b>{booking.check_out_date}</b></span>}</div></div>}
    </section>
  </main>;
}
