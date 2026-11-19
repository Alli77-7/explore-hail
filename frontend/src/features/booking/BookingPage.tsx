// صفحة الحجز: قائمة الخدمات (يسار) + نموذج الحجز (يمين)
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { getServices } from '../../services/services';
import { createBooking } from '../../services/bookings';
import { addHotelBooking } from '../../services/hotelBookings';
import { addRestaurantBooking } from '../../services/restaurantQueue';
import type { BookingRequest, Service } from './booking.types';
import BookingForm from './components/BookingForm';
import ServiceCard from './components/ServiceCard';
import ServiceFilters, { type ServiceFilter } from './components/ServiceFilters';
import './booking.css';

export default function BookingPage() {
  const { t, pick } = useLanguage();
  const { toast, showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const initialFilter: ServiceFilter = ['hotel', 'restaurant', 'tour', 'cafe', 'cars'].includes(requestedCategory ?? '')
    ? requestedCategory as ServiceFilter
    : 'all';
  const [filter, setFilter] = useState<ServiceFilter>(initialFilter);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    getServices()
      .then(data => { if (active) setServices(data); })
      .catch(loadError => {
        console.error(loadError);
        if (active) setError('تعذر تحميل الخدمات. حاول مرة أخرى.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reloadKey]);

  useEffect(() => {
    setFilter(initialFilter);
  }, [requestedCategory]);

  const handleFilterChange = (nextFilter: ServiceFilter) => {
    setFilter(nextFilter);
    if (selectedService && nextFilter !== 'all' && selectedService.type !== nextFilter) {
      setSelectedService(null);
    }
    const nextParams = new URLSearchParams(searchParams);
    if (nextFilter === 'all') nextParams.delete('category');
    else nextParams.set('category', nextFilter);
    setSearchParams(nextParams, { replace: true });
  };

  const visibleServices = services
    .filter(service => (filter === 'all' || service.type === filter) && service.rating >= ratingFilter)
    .sort((a, b) => b.rating - a.rating);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    // في الجوال النموذج تحت القائمة، فننزل له تلقائياً
  };

  const handleSubmit = async (request: BookingRequest): Promise<boolean> => {
    const service = services.find(item => item.id === request.serviceId);
    if (!service) return false;
    try {
    if (service.type === 'hotel') {
      const booking = await addHotelBooking(request, service);
      showToast(`تم إرسال طلب الحجز إلى ${pick(service.name, service.nameAr)}. رقم الطلب ${booking.bookingId}`);
      return true;
    }
    if (service.type === 'restaurant') {
      const booking = await addRestaurantBooking(request, service);
      showToast(`تمت إضافة طلبك إلى قائمة انتظار ${pick(service.name, service.nameAr)}. رقمك ${booking.queuePosition ?? booking.bookingId}`);
      return true;
    }
      await createBooking(request);
      showToast(t('bookingSent').replace('{name}', pick(service.name, service.nameAr)));
      return true;
    } catch (error) {
      console.error(error);
      const message = error instanceof Error && error.message === 'ACTIVE_BOOKING_EXISTS'
        ? 'لديك حجز نشط بالفعل لدى هذا المكان.'
        : 'تعذر إرسال الحجز، حاول مرة أخرى';
      showToast(message, 'error');
      return false;
    }
  };

  return (
    <div className="container page-container">
      <PageHeader eyebrow={t('bookingEyebrow')} title={t('bookingTitle')} text={t('bookingText')} />

      <div className="booking-layout">
        <section>
          <div className="booking-subheading">
            <h2>{t('providersTitle')}</h2>
            <p className="text-soft">{t('providersText')}</p>
          </div>

          <ServiceFilters active={filter} onChange={handleFilterChange} rating={ratingFilter} onRatingChange={setRatingFilter} />

          <div className="service-list">
            {loading && <p className="text-soft">جاري تحميل الخدمات...</p>}
            {!loading && error && <div className="booking-load-error"><p className="auth-error">تعذر تحميل الخدمات مؤقتًا.</p><button type="button" className="btn btn-secondary btn-sm" onClick={() => setReloadKey(value => value + 1)}>إعادة المحاولة</button></div>}
            {!loading && !error && visibleServices.length === 0 && <p className="text-soft">لا توجد خدمات ضمن هذا التصنيف.</p>}
            {!loading && !error && visibleServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                onSelect={handleSelect}
              />
            ))}
          </div>
        </section>

        <BookingForm
          selectedService={selectedService}
          onSubmit={handleSubmit}
          onMissingService={() => showToast(t('chooseServiceFirst'), 'error')}
        />
      </div>

      <Toast toast={toast} />
    </div>
  );
}
