// صفحة الحجز: قائمة الخدمات (يسار) + نموذج الحجز (يمين)
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { getServices } from '../../services/services';
import { createBooking } from '../../services/bookings';
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices).catch(error => console.error(error));
  }, []);

  useEffect(() => {
    setFilter(initialFilter);
  }, [requestedCategory]);

  const handleFilterChange = (nextFilter: ServiceFilter) => {
    setFilter(nextFilter);
    const nextParams = new URLSearchParams(searchParams);
    if (nextFilter === 'all') nextParams.delete('category');
    else nextParams.set('category', nextFilter);
    setSearchParams(nextParams, { replace: true });
  };

  const visibleServices = services.filter(service => filter === 'all' || service.type === filter);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    // في الجوال النموذج تحت القائمة، فننزل له تلقائياً
  };

  const handleSubmit = async (request: BookingRequest) => {
    const service = services.find(item => item.id === request.serviceId);
    if (!service) return;
    try {
      await createBooking(request);
      showToast(t('bookingSent').replace('{name}', pick(service.name, service.nameAr)));
    } catch (error) {
      console.error(error);
      showToast('تعذر إرسال الحجز، حاول مرة أخرى', 'error');
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

          <ServiceFilters active={filter} onChange={handleFilterChange} />

          <div className="service-list">
            {visibleServices.map(service => (
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
