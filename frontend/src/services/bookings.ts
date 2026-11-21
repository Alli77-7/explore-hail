import type { BookingRequest } from '../features/booking/booking.types';

export async function createBooking(request: BookingRequest): Promise<{ bookingId: number }> {
  const response = await fetch('/api/booking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Failed to create booking');
  }

  return response.json();
}
