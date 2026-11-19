import { getToken } from './auth';
import type { BookingRequest, Service } from '../features/booking/booking.types';
export type RestaurantQueueStatus = 'pending' | 'confirmed' | 'completed';
export type BookingSubmissionResponse = { bookingId: number; status: RestaurantQueueStatus; queuePosition: number | null };
export type RestaurantBooking = { id: number; provider_slug: string; business_name: string; full_name: string; email: string; phone: string; num_adults: number; notes: string; status: RestaurantQueueStatus };
const headers = () => ({ Authorization: `Bearer ${getToken() || ''}` });
export async function getRestaurantBookings(): Promise<RestaurantBooking[]> { const response = await fetch('/api/provider/bookings', { headers: headers() }); if (!response.ok) throw new Error('Failed to load restaurant queue'); return response.json(); }
export async function addRestaurantBooking(request: BookingRequest, _restaurant: Service): Promise<BookingSubmissionResponse> { const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.code ?? body?.error ?? 'Failed to send booking'); return body; }
export async function updateRestaurantBookingStatus(id: number, status: 'served' | 'next' | RestaurantQueueStatus) { const apiStatus = status === 'served' ? 'completed' : status === 'next' ? 'confirmed' : status; const response = await fetch(`/api/provider/bookings/${id}`, { method: 'PATCH', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ status: apiStatus }) }); if (!response.ok) throw new Error('Failed to update queue'); return response.json(); }
