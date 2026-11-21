// شكل بيانات مقدم الخدمة (فندق، مطعم، كوفي...)

export type ServiceType = 'hotel' | 'restaurant' | 'tour' | 'cafe' | 'cars';

export interface Service {
  id: string;
  name: string;
  nameAr: string;
  type: ServiceType;
  typeLabel: string;
  typeLabelAr: string;
  rating: number;
  googleRatingCount?: number | null;
  ratingUpdatedAt?: string | null;
  googleMapsUrl?: string | null;
  price: string;
  priceAr: string;
  location: string;
  locationAr: string;
  contact: string;
  image: string;
}

// بيانات نموذج الحجز
export interface BookingRequest {
  serviceId: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  roomType?: string;
  roomPrice?: number;
  guests: string;
  notes: string;
}
