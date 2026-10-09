// التصميم العام لكل الصفحات: الشريط العلوي + محتوى الصفحة + الفوتر
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import BackToTop from '../components/layout/BackToTop/BackToTop';

export default function App() {
  const { pathname } = useLocation();

  // عند الانتقال لصفحة جديدة نرجع لأعلى الصفحة
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <>
      <Navbar />
      {/* key يعيد تشغيل حركة دخول الصفحة مع كل انتقال */}
      <main key={pathname} className="page">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
