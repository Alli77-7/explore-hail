USE explore_hail;

DESCRIBE attractions;

INSERT INTO attractions
(
    id,
    name,
    description,
    google_map_url,
    category,
    rating,
    price,
    image_url,
    has_inscriptions
)
VALUES

(
    1,
    'Jubbah Rock Art',
    'Ancient rock art and inscriptions that reflect thousands of years of human presence in the Hail region.',
    'https://www.google.com/maps/search/?api=1&query=Jubbah%20Rock%20Art%2C%20Jubbah%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'historical',
    4.9,
    50.00,
    '/uploads/attractions-img/jubbah.svg',
    TRUE
),

(
    2,
    'A''arif Fort',
    'A historic mud-brick fort on a hilltop with panoramic views over the city of Hail.',
    'https://www.google.com/maps/search/?api=1&query=A%27arif%20Fort%2C%20Hail%2C%20Saudi%20Arabia',
    'historical',
    4.7,
    30.00,
    '/uploads/attractions-img/arif.svg',
    FALSE
),

(
    3,
    'Aja Mountains',
    'One of Hail’s most recognizable natural landmarks, known for dramatic rock formations and scenic valleys.',
    'https://www.google.com/maps/search/?api=1&query=Aja%20Mountains%2C%20Hail%2C%20Saudi%20Arabia',
    'natural',
    4.9,
    0.00,
    '/uploads/attractions-img/aja.svg',
    FALSE
),

(
    4,
    'Hail Museum',
    'A cultural destination introducing visitors to the history, identity, and traditional life of the region.',
    'https://www.google.com/maps/search/?api=1&query=Hail%20Regional%20Museum%2C%20Hail%2C%20Saudi%20Arabia',
    'cultural',
    4.6,
    20.00,
    '/uploads/attractions-img/museum.svg',
    FALSE
),

(
    5,
    'Qishlah Palace',
    'A landmark of Hail’s architectural heritage and one of the city’s best-known historic buildings.',
    'https://www.google.com/maps/search/?api=1&query=Qishlah%20Palace%2C%20Hail%2C%20Saudi%20Arabia',
    'historical',
    4.8,
    25.00,
    '/uploads/attractions-img/qishlah.svg',
    FALSE
),

(
    6,
    'Salma Mountains',
    'A mountain destination for adventure, desert landscapes, hiking, and photography.',
    'https://www.google.com/maps/search/?api=1&query=Salma%20Mountains%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'adventure',
    4.8,
    0.00,
    '/uploads/attractions-img/salma.svg',
    FALSE
),

(
    7,
    'Shuwaymis Rock Art',
    'A UNESCO-listed open-air gallery of ancient petroglyphs set among dramatic desert cliffs and volcanic landscapes.',
    'https://www.google.com/maps/search/?api=1&query=Shuwaymis%20Rock%20Art%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'historical',
    4.9,
    0.00,
    '/uploads/attractions-img/shuwaymis.jpg',
    FALSE
),

(
    8,
    'Al Samra Mountain',
    'A favorite Hail viewpoint with sweeping city panoramas, walking areas, and especially memorable sunset and evening views.',
    'https://www.google.com/maps/search/?api=1&query=Al%20Samra%20Mountain%2C%20Hail%2C%20Saudi%20Arabia',
    'natural',
    4.7,
    0.00,
    '/uploads/attractions-img/samra.jpg',
    FALSE
),

(
    9,
    'Fayd Archaeological City',
    'Explore the remains of a major station on the historic Zubaydah pilgrimage route, including walls, wells, and waterworks.',
    'https://www.google.com/maps/search/?api=1&query=Fayd%20Archaeological%20City%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'historical',
    4.6,
    0.00,
    '/uploads/attractions-img/fayd.jpg',
    FALSE
),

(
    10,
    'Barzan Palace Towers',
    'The surviving mud-brick towers of a landmark palace that once stood at the heart of Hail’s political and social life.',
    'https://www.google.com/maps/search/?api=1&query=Barzan%20Palace%20Towers%2C%20Hail%2C%20Saudi%20Arabia',
    'historical',
    4.5,
    0.00,
    '/uploads/attractions-img/barzan.jpg',
    FALSE
),

(
    11,
    'Hatim Al Tai Palace',
    'Atmospheric mud-brick ruins in Tuwaren linked to the celebrated Arab poet and enduring symbol of generosity, Hatim Al Tai.',
    'https://www.google.com/maps/search/?api=1&query=Hatim%20Al%20Tai%20Palace%2C%20Tuwaren%2C%20Hail%2C%20Saudi%20Arabia',
    'cultural',
    4.6,
    0.00,
    '/uploads/attractions-img/hatim-palace.jpg',
    FALSE
),

(
    12,
    'Taba Archaeological Village',
    'A historic village built around an ancient volcanic crater, framed by farms, palm groves, and the Salma Mountains.',
    'https://www.google.com/maps/search/?api=1&query=Taba%20Archaeological%20Village%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'historical',
    4.7,
    0.00,
    '/uploads/attractions-img/taba.jpg',
    FALSE
),

(
    13,
    'Wadi Mashar',
    'A scenic valley within the Aja Mountains known for pink granite, acacia trees, seasonal greenery, and hiking terrain.',
    'https://www.google.com/maps/search/?api=1&query=Wadi%20Mashar%2C%20Hail%2C%20Saudi%20Arabia',
    'natural',
    4.8,
    0.00,
    '/uploads/attractions-img/mashar.jpg',
    FALSE
),

(
    14,
    'Great Nafud Desert',
    'Vast red and golden dunes north of Hail invite guided desert drives, stargazing, photography, and winter camping.',
    'https://www.google.com/maps/search/?api=1&query=Great%20Nafud%20Desert%2C%20Hail%20Region%2C%20Saudi%20Arabia',
    'adventure',
    4.9,
    0.00,
    '/uploads/attractions-img/nafud.jpg',
    FALSE
),

(
    15,
    'Ramlah Tourist Reserve',
    'A desert adventure destination in Tuwarin offering immersive outdoor experiences among Hail''s mountains, dunes and open landscapes.',
    'https://www.google.com/maps/search/?api=1&query=Ramlah%20Tourist%20Reserve%2C%20Tuwarin%2C%20Hail%2C%20Saudi%20Arabia',
    'adventure',
    0.0,
    0.00,
    '/uploads/attractions-img/rumlah.svg',
    FALSE
),

(
    16,
    'Tuwarin Reserve',
    'A scenic natural reserve within the Aja mountain landscape, known for its desert scenery, seasonal vegetation and dramatic mountain surroundings.',
    'https://www.google.com/maps/search/?api=1&query=Tuwarin%20Reserve%2C%20Hail%2C%20Saudi%20Arabia',
    'adventure',
    0.0,
    0.00,
    '/uploads/attractions-img/tuwarin-reserve.jpg',
    FALSE
),

(
    17,
    'Imam Turki bin Abdullah Royal Reserve',
    'A vast royal reserve featuring dunes, plains, valleys and plateaus, with rich biodiversity and opportunities for sustainable ecotourism.',
    'https://www.google.com/maps/search/?api=1&query=Imam%20Turki%20bin%20Abdullah%20Royal%20Reserve%2C%20Saudi%20Arabia',
    'adventure',
    0.0,
    0.00,
    '/uploads/attractions-img/imam-turki-reserve.jpg',
    FALSE
),

(
    18,
    'King Salman bin Abdulaziz Royal Reserve',
    'A vast protected landscape in northern Saudi Arabia featuring diverse terrain, natural heritage, biodiversity and archaeological sites.',
    'https://www.google.com/maps/search/?api=1&query=King%20Salman%20bin%20Abdulaziz%20Royal%20Reserve%2C%20Saudi%20Arabia',
    'adventure',
    0.0,
    0.00,
    '/uploads/attractions-img/king-salman-reserve.jpg',
    FALSE
)

ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    google_map_url = VALUES(google_map_url),
    category = VALUES(category),
    rating = VALUES(rating),
    price = VALUES(price),
    image_url = VALUES(image_url),
    has_inscriptions = VALUES(has_inscriptions);
    
    SELECT COUNT(*) AS total_attractions
FROM attractions;