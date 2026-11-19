import { getToken } from './auth';
import type { BookingRequest, Service } from '../features/booking/booking.types';
export type HotelBookingStatus = 'pending' | 'confirmed' | 'completed';
export type BookingSubmissionResponse = { bookingId: number; status: HotelBookingStatus };
export type HotelBooking = { id: number; provider_slug: string; business_name: string; name_ar: string; full_name: string; email: string; phone: string; num_adults: number; status: HotelBookingStatus; notes: string; check_in_date: string | null; check_out_date: string | null; room_type: string | null; room_price: number | null; created_at?: string };
const headers = () => ({ Authorization: `Bearer ${getToken() || ''}`, 'Content-Type': 'application/json' });
export async function getHotelBookings(): Promise<HotelBooking[]> { const response = await fetch('/api/provider/bookings', { headers: headers() }); if (!response.ok) throw new Error('Failed to load hotel bookings'); return response.json(); }
export async function addHotelBooking(request: BookingRequest, _hotel: Service): Promise<BookingSubmissionResponse> { const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.code ?? body?.error ?? 'Failed to send booking'); return body; }
export async function updateHotelBookingStatus(id: number, status: 'checked-in' | HotelBookingStatus) { const response = await fetch(`/api/provider/bookings/${id}`, { method: 'PATCH', headers: headers(), body: JSON.stringify({ status: status === 'checked-in' ? 'completed' : status }) }); if (!response.ok) throw new Error('Failed to update booking'); return response.json(); }
