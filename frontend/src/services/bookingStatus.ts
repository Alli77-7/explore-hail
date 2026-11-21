export type BookingStatus = {
  id: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  queue_position: number | null;
  booking_date: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_type: string | null;
  room_price: number | null;
  business_name: string;
  name_ar: string;
  category: string;
};

export async function lookupBooking(bookingId: string, phone: string): Promise<BookingStatus> {
  const params = new URLSearchParams({ bookingId, phone });
  const response = await fetch(`/api/bookings/lookup?${params.toString()}`);
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? 'Booking not found');
  return body;
}
