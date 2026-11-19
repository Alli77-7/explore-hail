import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentRole, isAuthenticated, signIn } from '../../services/auth';
import './auth.css';

export default function LoginPage() {
  const navigate = useNavigate(); const location = useLocation(); const [username, setUsername] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  if (isAuthenticated()) { const role = getCurrentRole(); return <Navigate to={role === 'restaurant' ? '/restaurant-queue' : role === 'hotel' ? '/hotel-dashboard' : '/dashboard'} replace />; }
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setError(''); setLoading(true); const role = await signIn(username.trim(), password); setLoading(false); if (!role) { setError('بيانات الدخول غير صحيحة أو الخادم غير متاح'); return; } const from = (location.state as { from?: string } | null)?.from; navigate(from || (role === 'restaurant' ? '/restaurant-queue' : role === 'hotel' ? '/hotel-dashboard' : '/dashboard'), { replace: true }); };
  return <section className="auth-page page-container"><div className="auth-card"><p className="auth-eyebrow">Explore Hail</p><h1>تسجيل الدخول</h1><p className="auth-description">سجّل الدخول إلى لوحة منشأتك.</p><form className="auth-form" onSubmit={submit}><label className="field"><span>اسم المستخدم</span><input className="input" value={username} onChange={e => setUsername(e.target.value)} required /></label><label className="field"><span>كلمة المرور</span><input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p className="auth-error">{error}</p>}<button className="btn btn-primary btn-full" type="submit" disabled={loading}>{loading ? 'جارٍ الدخول...' : 'دخول'}</button></form><p className="auth-demo-note">الحسابات تدار من قاعدة البيانات.</p></div></section>;
}
