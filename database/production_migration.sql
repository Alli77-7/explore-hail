USE explore_hail;

ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(80) NULL AFTER email;
ALTER TABLE users ADD UNIQUE KEY uq_users_username (username);
ALTER TABLE attractions ADD COLUMN IF NOT EXISTS name_ar VARCHAR(150) NULL AFTER name;
ALTER TABLE attractions ADD COLUMN IF NOT EXISTS description_ar TEXT NULL AFTER description;
ALTER TABLE bookings MODIFY booking_date DATETIME NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS check_in_date DATE NULL AFTER booking_date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS check_out_date DATE NULL AFTER check_in_date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_type VARCHAR(80) NULL AFTER check_out_date;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS room_price DECIMAL(10, 2) NULL AFTER room_type;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS queue_position INT NULL AFTER room_price;

-- Provider credentials use bcrypt hashes. Run backend/scripts/seed-production.js after this migration.
