USE explore_hail;

INSERT INTO users (full_name, email, phone, password, user_type) VALUES
('Faisal Almarshedi', 'faisal.marshedi@gmail.com', '0545451381', 'hashed_admin_pass_123', 'admin'),
('Mohammed Al-Shammari', 'm.alshammari@gmail.com', '0501112222', 'hashed_pass_1', 'tourist'),
('Sara Al-Tamimi', 'sara.t@hotmail.com', '0533334444', 'hashed_pass_2', 'tourist'),
('Fahad Al-Rashidi', 'fahad.rashidi@hailtours.com', '0555556666', 'hashed_pass_3', 'provider'),
('Khaled Al-Anazi', 'khaled.anazi@millennium.com', '0566667777', 'hashed_pass_4', 'provider');

INSERT INTO attractions (name, description, latitude, longitude, category, rating, price, has_inscriptions, image_url) VALUES
('Jubbah Rock Art', 'Ancient rock carvings featuring Thamudic inscriptions and rock art dating back to 10,000 BC.', 28.016667, 40.933333, 'historical', 4.9, 0.00, TRUE, '/assets/images/attractions/jubbah.jpg'),
('Aja Mountains', 'A spectacular mountain range famous for its granite peaks and natural beauty.', 27.466667, 41.533333, 'nature', 4.7, 0.00, FALSE, '/assets/images/attractions/aja_mountains.jpg'),
('Al-Qishlah Palace', 'A historic mud-brick fortress in the center of Hail city.', 27.514722, 41.692222, 'cultural', 4.5, 15.00, FALSE, '/assets/images/attractions/qishlah.jpg'),
('Hail Regional Museum', 'A museum showcasing the rich history and cultural heritage of the Hail region.', 27.512000, 41.694000, 'cultural', 4.6, 25.00, FALSE, '/assets/images/attractions/hail_museum.jpg'),
('Hatim Al-Tai Hearth', 'The historic site associated with the legendary pre-Islamic poet Hatim Al-Tai.', 27.483333, 41.716667, 'historical', 4.3, 0.00, FALSE, '/assets/images/attractions/hatim_hearth.jpg');

INSERT INTO inscriptions (attraction_id, image_url, original_script_desc, translated_text, accuracy_score) VALUES
(1, '/assets/images/inscriptions/jubbah_camel.jpg', 'Thamudic inscription depicting a large camel.', 'By [Name], he hunted the wild camels here.', 95.50),
(1, '/assets/images/inscriptions/jubbah_text.jpg', 'Thamudic script carved deeply into sandstone.', 'I am [Name] son of [Name], and I camped in this valley.', 89.20),
(1, '/assets/images/inscriptions/jubbah_ibex.jpg', 'Rock art showing an ibex and brief text.', 'To the deity, a successful hunt.', 92.10);

INSERT INTO service_providers (user_id, business_name, category, description, contact_info, rating, price_range, image_url) VALUES
(4, 'Hail Desert Safari', 'tour', 'Professional guided tours to the Nafud desert and Jubbah rock art.', '0555556666', 4.8, '200-500 SAR', '/assets/images/providers/desert_safari.jpg'),
(5, 'Millennium Hotel Hail', 'hotel', 'Luxury hotel located in the heart of Hail.', '0566667777', 4.6, '400-800 SAR', '/assets/images/providers/millennium.jpg'),
(4, 'Traditional Hail Kitchen', 'restaurant', 'Authentic traditional Hail cuisine serving Kebeba and Temman.', '0555556666', 4.7, '50-150 SAR', '/assets/images/providers/hail_kitchen.jpg');

INSERT INTO bookings (tourist_id, provider_id, booking_date, status, total_price, phone, num_adults, num_children, notes) VALUES
(2, 1, '2026-11-10 08:30:00', 'confirmed', 450.00, '0501112222', 2, 0, 'Focus the tour on Jubbah rock art.'),
(3, 2, '2026-11-15 14:00:00', 'pending', 1200.00, '0533334444', 2, 2, 'Mountain view room if possible.'),
(2, 3, '2026-11-10 20:00:00', 'completed', 180.00, '0501112222', 2, 0, 'Dinner reservation after the tour.');
