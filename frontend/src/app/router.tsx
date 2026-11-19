// خريطة الصفحات: كل رابط (path) يعرض صفحة معيّنة داخل التصميم العام App
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import HomePage from '../features/home/HomePage';
import AttractionsPage from '../features/attractions/AttractionsPage';
import BookingPage from '../features/booking/BookingPage';
import BookingStatusPage from '../features/bookingStatus/BookingStatusPage';
import TranslationPage from '../features/translation/TranslationPage';
import TripPlannerPage from '../features/tripPlanner/TripPlannerPage';
import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from '../features/auth/ProtectedRoute';
import DashboardPage from '../features/dashboard/DashboardPage';
import RestaurantQueuePage from '../features/restaurant/RestaurantQueuePage';
import HotelDashboardPage from '../features/hotel/HotelDashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'booking-status', element: <BookingStatusPage /> },
      { path: 'translation', element: <TranslationPage /> },
      { path: 'trip-planner', element: <TripPlannerPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <ProtectedRoute role="admin" />,
        children: [{ path: 'dashboard', element: <DashboardPage /> }],
      },
      {
        element: <ProtectedRoute role="restaurant" />,
        children: [{ path: 'restaurant-queue', element: <RestaurantQueuePage /> }],
      },
      {
        element: <ProtectedRoute role="hotel" />,
        children: [{ path: 'hotel-dashboard', element: <HotelDashboardPage /> }],
      },
      // أي رابط غير معروف يرجع للرئيسية
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
