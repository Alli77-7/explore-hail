USE explore_hail;

-- 1. إضافة المستخدمين (من ضمنهم حسابك كمدير وبيانات واقعية لسياح ومقدمي خدمات)
INSERT INTO users (full_name, email, phone, password, user_type) VALUES
('Faisal Almarshedi', 'faisal.marshedi@gmail.com', '0545451381', 'hashed_admin_pass_123', 'admin'),
('Mohammed Al-Shammari', 'm.alshammari@gmail.com', '0501112222', 'hashed_pass_1', 'tourist'),
('Sara Al-Tamimi', 'sara.t@hotmail.com', '0533334444', 'hashed_pass_2', 'tourist'),
('Fahad Al-Rashidi', 'fahad.rashidi@hailtours.com', '0555556666', 'hashed_pass_3', 'provider'),
('Khaled Al-Anazi', 'khaled.anazi@millennium.com', '0566667777', 'hashed_pass_4', 'provider');

-- 2. إضافة المعالم السياحية (معالم حقيقية في حائل مع إحداثيات دقيقة تقريبياً)
INSERT INTO attractions (name, description, latitude, longitude, category, rating, price, has_inscriptions, image_url) VALUES
('Jubbah Rock Art (Jabal Umm Sinman)', 'One of the most prominent archaeological sites in Saudi Arabia, featuring thousands of Thamudic inscriptions and rock art dating back to 10,000 BC. A UNESCO World Heritage Site.', 28.016667, 40.933333, 'historical', 4.9, 0.00, TRUE, '/assets/images/attractions/jubbah.jpg'),
('Aja Mountains (Jabal Aja)', 'A spectacular mountain range famous for its granite peaks, deep valleys, and natural beauty. Perfect for hiking and camping.', 27.466667, 41.533333, 'nature', 4.7, 0.00, FALSE, '/assets/images/attractions/aja_mountains.jpg'),
('Al-Qishlah Palace', 'A historic mud-brick fortress in the center of Hail city, built in the 1940s during the reign of King Abdulaziz. Features impressive traditional Najdi architecture.', 27.514722, 41.692222, 'cultural', 4.5, 15.00, FALSE, '/assets/images/attractions/qishlah.jpg'),
('Hail Regional Museum', 'A modern museum showcasing the rich history, archaeology, and cultural heritage of the Hail region from prehistoric times to the modern era.', 27.512000, 41.694000, 'cultural', 4.6, 25.00, FALSE, '/assets/images/attractions/hail_museum.jpg'),
('Hatim Al-Tai Hearth (Mawqad Hatim)', 'The historic site associated with the legendary pre-Islamic poet Hatim Al-Tai, known across the Arab world for his extreme generosity.', 27.483333, 41.716667, 'historical', 4.3, 0.00, FALSE, '/assets/images/attractions/hatim_hearth.jpg');

-- 3. إضافة النقوش الثمودية (مرتبطة بمنطقة جبة)
INSERT INTO inscriptions (attraction_id, image_url, original_script_desc, translated_text, accuracy_score) VALUES
(1, '/assets/images/inscriptions/jubbah_camel.jpg', 'Clear Thamudic inscription depicting a large camel alongside a human figure with a spear.', 'By [Name], he hunted the wild camels here.', 95.50),
(1, '/assets/images/inscriptions/jubbah_text.jpg', 'Ancient Thamudic script carved deeply into sandstone, showing tribal signatures.', 'I am [Name] son of [Name], and I camped in this valley.', 89.20),
(1, '/assets/images/inscriptions/jubbah_ibex.jpg', 'Rock art showing an ibex with long curved horns and brief text.', 'To the deity, a successful hunt.', 92.10);

-- 4. إضافة مقدمي الخدمات (فنادق ومرشدين حقيقيين أو واقعيين في حائل)
INSERT INTO service_providers (user_id, business_name, category, description, contact_info, rating, price_range, image_url) VALUES
(4, 'Hail Desert Safari', 'tour', 'Professional guided tours to the Nafud desert, Jubbah rock art, and camping in Aja mountains.', '0555556666', 4.8, '200-500 SAR', '/assets/images/providers/desert_safari.jpg'),
(5, 'Millennium Hotel Hail', 'hotel', 'Luxury 5-star hotel located in the heart of Hail, offering premium services for tourists and business travelers.', '0566667777', 4.6, '400-800 SAR', '/assets/images/providers/millennium.jpg'),
(4, 'Traditional Hail Kitchen', 'restaurant', 'Authentic traditional Hail cuisine serving Kebeba, Temman, and Marqooq.', '0555556666', 4.7, '50-150 SAR', '/assets/images/providers/hail_kitchen.jpg');

-- 5. إضافة الحجوزات
INSERT INTO bookings (tourist_id, provider_id, booking_date, status, total_price, phone, num_adults, num_children, notes) VALUES
(2, 1, '2026-11-10 08:30:00', 'confirmed', 450.00, '0501112222', 2, 0, 'We would like to focus the tour on Jubbah rock art.'),
(3, 2, '2026-11-15 14:00:00', 'pending', 1200.00, '0533334444', 2, 2, 'Requesting a room with a mountain view if possible.'),
(2, 3, '2026-11-10 20:00:00', 'completed', 180.00, '0501112222', 2, 0, 'Dinner reservation after the safari tour.');
