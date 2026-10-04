USE explore_hail;

INSERT INTO users (full_name, email, phone, password, user_type) VALUES
('Faisal Almarshedi', 'faisal.marshedi@gmail.com', '0545451381', 'hashed_admin_pass_123', 'admin'),
('Mohammed Al-Shammari', 'm.alshammari@gmail.com', '0501112222', 'hashed_pass_1', 'tourist'),
('Sara Al-Tamimi', 'sara.t@gmail.com', '0533334444', 'hashed_pass_2', 'tourist'),
('Fahad Al-Rashidi', 'fahad.rashidi@outlook.com', '0555556666', 'hashed_pass_3', 'provider'),
('Khaled Al-Anazi', 'khaled.anazi@outlook.com', '0566667777', 'hashed_pass_4', 'provider');

INSERT INTO attractions (name, description, google_map_url, category, rating, price, has_inscriptions) VALUES
('Jubbah Rock Art', 'Ancient rock carvings featuring Thamudic inscriptions and rock art dating back to 10,000 BC.', 'https://www.google.com/maps/search/?api=1&query=Jubbah+Rock+Art+Hail', 'historical', 4.9, 0.00, TRUE),
('Aja Mountains', 'A spectacular mountain range famous for its granite peaks and natural beauty.', 'https://www.google.com/maps/search/?api=1&query=Aja+Mountains+Hail', 'nature', 4.7, 0.00, FALSE),
('Al-Qishlah Palace', 'A historic mud-brick fortress in the center of Hail city.', 'https://www.google.com/maps/search/?api=1&query=Qishlah+Palace+Hail', 'cultural', 4.5, 15.00, FALSE),
('Hail Regional Museum', 'A museum showcasing the rich history and cultural heritage of the Hail region.', 'https://www.google.com/maps/search/?api=1&query=Hail+Regional+Museum', 'cultural', 4.6, 25.00, FALSE),
('Hatim Al-Tai Hearth', 'The historic site associated with the legendary pre-Islamic poet Hatim Al-Tai.', 'https://www.google.com/maps/search/?api=1&query=Mawqad+Hatim+Al-Tai+Hail', 'historical', 4.3, 0.00, FALSE);

INSERT INTO inscriptions (attraction_id, original_script_desc, translated_text, accuracy_score) VALUES
(1, 'Thamudic inscription depicting a large camel.', 'By [Name], he hunted the wild camels here.', 95.50),
(1, 'Thamudic script carved deeply into sandstone.', 'I am [Name] son of [Name], and I camped in this valley.', 89.20),
(1, 'Rock art showing an ibex and brief text.', 'To the deity, a successful hunt.', 92.10);

INSERT INTO service_providers (user_id, business_name, category, description, contact_info, rating, price_range) VALUES
(4, 'Hail Desert Safari', 'tour', 'Professional guided tours to the Nafud desert and Jubbah rock art.', '0555556666', 4.8, '200-500 SAR'),
(5, 'Millennium Hotel Hail', 'hotel', 'Luxury hotel located in the heart of Hail.', '0566667777', 4.6, '400-800 SAR'),
(4, 'Al-Turathi Restaurant', 'restaurant', 'Authentic traditional Hail cuisine, famously located near Al-Qishlah Palace.', '0555556666', 4.7, '50-150 SAR');

INSERT INTO bookings (tourist_id, provider_id, booking_date, status, total_price, phone, num_adults, num_children, notes) VALUES
(2, 1, '2026-11-10 08:30:00', 'confirmed', 450.00, '0501112222', 2, 0, 'Focus the tour on Jubbah rock art.'),
(3, 2, '2026-11-15 14:00:00', 'pending', 1200.00, '0533334444', 2, 2, 'Mountain view room if possible.'),
(2, 3, '2026-11-10 20:00:00', 'completed', 180.00, '0501112222', 2, 0, 'Dinner reservation after the tour.');
