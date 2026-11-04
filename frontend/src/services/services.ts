import type { Service } from '../features/booking/booking.types';

export async function getServices(): Promise<Service[]> {
  const response = await fetch('/api/booking');
  if (!response.ok) throw new Error('Failed to fetch services');
  return response.json();
}
