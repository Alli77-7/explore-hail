USE explore_hail;

ALTER TABLE service_providers
    ADD COLUMN slug VARCHAR(80) NULL AFTER id,
    ADD COLUMN name_ar VARCHAR(150) NULL AFTER business_name,
    ADD COLUMN type_label VARCHAR(100) NULL AFTER category,
    ADD COLUMN type_label_ar VARCHAR(100) NULL AFTER type_label,
    ADD COLUMN price_range_ar VARCHAR(100) NULL AFTER price_range,
    ADD COLUMN location VARCHAR(200) NULL AFTER price_range_ar,
    ADD COLUMN location_ar VARCHAR(200) NULL AFTER location;

ALTER TABLE service_providers ADD UNIQUE KEY uq_service_providers_slug (slug);

INSERT INTO users (full_name, email, password, user_type)
VALUES ('Explore Hail Services', 'services@explore-hail.local', 'seed-only', 'provider')
ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id);

INSERT INTO service_providers
    (user_id, slug, business_name, name_ar, category, type_label, type_label_ar,
     description, contact_info, rating, price_range, price_range_ar, location, location_ar, image_url)
VALUES
    (LAST_INSERT_ID(), 'golden-tulip', 'Golden Tulip Hail', 'فندق جولدن توليب حائل', 'hotel', 'Hotel', 'فندق', 'Hotel in Hail.', '+966 6 533 3333', 4.5, '500-800 SAR/night', '500-800 ريال / ليلة', 'King Abdulaziz Road, Hail', 'طريق الملك عبدالعزيز، حائل', '/uploads/services/hotels/golden-tulip.svg'),
    (LAST_INSERT_ID(), 'millennium', 'Millennium Hotel Hail', 'فندق ميلينيوم حائل', 'hotel', 'Luxury hotel', 'فندق فاخر', 'Luxury hotel in Hail.', '+966 55 222 2222', 4.8, '650-1200 SAR/night', '650-1200 ريال / ليلة', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/hotels/millennium.svg'),
    (LAST_INSERT_ID(), 'roga-roko', 'Roga Roko Italian Restaurant', 'مطعم روغو روكا الإيطالي', 'restaurant', 'Italian restaurant', 'مطعم إيطالي', 'Italian restaurant.', '+966 55 000 0000', 4.9, '120-250 SAR/person', '120-250 ريال / شخص', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/restaurants/roga-roko.svg'),
    (LAST_INSERT_ID(), 'flox', 'Flox Restaurant', 'مطعم فلوكس', 'restaurant', 'Fine dining', 'مطعم راقٍ', 'Fine dining.', '+966 55 111 1111', 4.9, '180-350 SAR/person', '180-350 ريال / شخص', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/restaurants/flox.svg'),
    (LAST_INSERT_ID(), 'rumlah', 'Rumlah Reserve', 'محمية رملة', 'tour', 'Nature reserve experience', 'محمية وتجربة سياحية', 'Nature reserve experience.', '+966 55 000 0000', 4.9, '150-400 SAR/visit', '150-400 ريال / زيارة', 'Hail Region, Saudi Arabia', 'منطقة حائل، المملكة العربية السعودية', '/uploads/services/tours/rumlah.svg'),
    (LAST_INSERT_ID(), 'geisha', 'Geisha Cafe', 'جيشا كافيه', 'cafe', 'Cafe', 'كافيه', 'Cafe.', '+966 55 333 1111', 4.9, '25-90 SAR', '25-90 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/cafes/geisha.svg'),
    (LAST_INSERT_ID(), 'sakura', 'Sakura Cafe', 'ساكورا كافيه', 'cafe', 'Cafe', 'كافيه', 'Cafe.', '+966 55 333 2222', 4.8, '20-80 SAR', '20-80 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/cafes/sakura.svg'),
    (LAST_INSERT_ID(), 'peacock', 'Peacock Cafe', 'الطاووس كافيه', 'cafe', 'Cafe', 'كافيه', 'Cafe.', '+966 55 333 3333', 4.7, '20-75 SAR', '20-75 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/cafes/peacock.svg'),
    (LAST_INSERT_ID(), 'eveness', 'Eveness Cafe', 'إيفينس كافيه', 'cafe', 'Modern cafe', 'كافيه عصري', 'Modern cafe.', '+966 55 333 4444', 4.8, '30-95 SAR', '30-95 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/cafes/eveness.svg'),
    (LAST_INSERT_ID(), 'al-tone', 'Al Tone Cafe', 'التون كافيه', 'cafe', 'Cafe', 'كافيه', 'Cafe.', '+966 55 333 5555', 4.8, '25-100 SAR', '25-100 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/cafes/al-tone.svg'),
    (LAST_INSERT_ID(), 'trip-cars', 'Adventure Trip Cars', 'سيارات تجهيز الرحلات', 'cars', 'Cars & trip preparation', 'سيارات وتجهيز رحلات', 'Cars and trip preparation.', '+966 55 777 7777', 4.9, '250-1200 SAR', '250-1200 ريال', 'Hail, Saudi Arabia', 'حائل، المملكة العربية السعودية', '/uploads/services/tours/trip-cars.svg')
ON DUPLICATE KEY UPDATE
    business_name = VALUES(business_name), name_ar = VALUES(name_ar), category = VALUES(category),
    type_label = VALUES(type_label), type_label_ar = VALUES(type_label_ar), description = VALUES(description),
    contact_info = VALUES(contact_info), rating = VALUES(rating), price_range = VALUES(price_range),
    price_range_ar = VALUES(price_range_ar), location = VALUES(location), location_ar = VALUES(location_ar),
    image_url = VALUES(image_url);
