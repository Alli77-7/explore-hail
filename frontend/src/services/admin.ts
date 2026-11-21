import { getToken } from './auth';

export type AdminProvider = {
  id: number;
  slug: string;
  business_name: string;
  name_ar: string;
  category: string;
  type_label: string;
  type_label_ar: string;
  contact_info: string;
  location: string;
  location_ar: string;
  username: string;
  email: string;
  image_url: string;
};

const headers = () => ({ Authorization: `Bearer ${getToken() || ''}`, 'Content-Type': 'application/json' });

export async function getAdminProviders(): Promise<AdminProvider[]> {
  const response = await fetch('/api/admin/providers', { headers: headers() });
  if (!response.ok) throw new Error('Failed to load providers');
  return response.json();
}

export async function createAdminProvider(payload: Record<string, string>) {
  const response = await fetch('/api/admin/providers', { method: 'POST', headers: headers(), body: JSON.stringify(payload) });
  if (!response.ok) throw new Error((await response.json()).error || 'Failed to create provider');
  return response.json();
}

export async function uploadProviderImage(providerId: number, file: File): Promise<{ imageUrl: string }> {
  const response = await fetch(`/api/admin/providers/${providerId}/image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken() || ''}` },
    body: (() => { const data = new FormData(); data.append('image', file); return data; })(),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? 'Failed to upload provider image');
  return body;
}
