// صفحة الحجز: قائمة الخدمات (يسار) + نموذج الحجز (يمين)
import { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import Toast from '../../components/ui/Toast/Toast';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../../hooks/useToast';
import { services } from './booking.data';
import type { BookingRequest, Service } from './booking.types';
import BookingForm from './components/BookingForm';
import ServiceCard from './components/ServiceCard';
import ServiceFilters, { type ServiceFilter } from './components/ServiceFilters';
import './booking.css';

export default function BookingPage() {
  const { t, pick } = useLanguage();
  const { toast, showToast } = useToast();
  const [filter, setFilter] = useState<ServiceFilter>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const visibleServices = services.filter(service => filter === 'all' || service.type === filter);

  const handleSelect = (service: Service) => {
    setSelectedService(service);
    // في الجوال النموذج تحت القائمة، فننزل له تلقائياً
    if (window.innerWidth <= 900) {
      document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (request: BookingRequest) => {
    const service = services.find(item => item.id === request.serviceId);
    if (!service) return;
    showToast(t('bookingSent').replace('{name}', pick(service.name, service.nameAr)));
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

          <ServiceFilters active={filter} onChange={setFilter} />

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
