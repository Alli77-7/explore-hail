export type UserRole = 'admin' | 'provider' | 'restaurant' | 'hotel';
export type AuthUser = { id: number; fullName: string; role: UserRole; providerId: string | null; providerName: string | null };
const TOKEN_KEY = 'exploreHailToken';
const USER_KEY = 'exploreHailUser';
export function isAuthenticated() { return Boolean(localStorage.getItem(TOKEN_KEY)); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function getCurrentUser(): AuthUser | null { try { return JSON.parse(localStorage.getItem(USER_KEY) || 'null') as AuthUser | null; } catch { return null; } }
export function getCurrentRole(): UserRole { return getCurrentUser()?.role || 'admin'; }
export function getCurrentProviderId() { return getCurrentUser()?.providerId || null; }
export function getCurrentProviderName() { return getCurrentUser()?.providerName || 'Explore Hail'; }
export async function signIn(username: string, password: string): Promise<UserRole | null> {
  const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
  if (!response.ok) return null;
  const data = await response.json() as { token: string; user: AuthUser };
  localStorage.setItem(TOKEN_KEY, data.token); localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data.user.role;
}
export function signOut() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
