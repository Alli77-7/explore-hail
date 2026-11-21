import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getCurrentRole, isAuthenticated, type UserRole } from '../../services/auth';
export default function ProtectedRoute({ role }: { role: UserRole }) {
  const location = useLocation();
  if (!isAuthenticated()) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (getCurrentRole() !== role) {
    const destination = getCurrentRole() === 'restaurant' ? '/restaurant-queue' : getCurrentRole() === 'hotel' ? '/hotel-dashboard' : '/dashboard';
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
}
