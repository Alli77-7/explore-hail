// خريطة الصفحات: كل رابط (path) يعرض صفحة معيّنة داخل التصميم العام App
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import HomePage from '../features/home/HomePage';
import AttractionsPage from '../features/attractions/AttractionsPage';
import BookingPage from '../features/booking/BookingPage';
import TranslationPage from '../features/translation/TranslationPage';
import TripPlannerPage from '../features/tripPlanner/TripPlannerPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'attractions', element: <AttractionsPage /> },
      { path: 'booking', element: <BookingPage /> },
      { path: 'translation', element: <TranslationPage /> },
      { path: 'trip-planner', element: <TripPlannerPage /> },
      // أي رابط غير معروف يرجع للرئيسية
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
