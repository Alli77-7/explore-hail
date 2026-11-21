-- جديد — يضيف حالة رفض مقدم الخدمة لقاعدة بيانات موجودة.
USE explore_hail;

ALTER TABLE bookings
    MODIFY COLUMN status ENUM('pending', 'confirmed', 'rejected', 'cancelled', 'completed')
    NOT NULL DEFAULT 'pending';
