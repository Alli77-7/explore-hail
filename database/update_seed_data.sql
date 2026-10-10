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


ALTER TABLE attractions
ADD COLUMN name_ar VARCHAR(150) AFTER name,
ADD COLUMN description_ar TEXT AFTER description;

DESCRIBE attractions;

UPDATE attractions
SET
name_ar = CASE id
    WHEN 1 THEN 'نقوش جبة الصخرية'
    WHEN 2 THEN 'قلعة أعيرف'
    WHEN 3 THEN 'جبال أجا'
    WHEN 4 THEN 'متحف حائل'
    WHEN 5 THEN 'قصر القشلة'
    WHEN 6 THEN 'جبال سلمى'
    WHEN 7 THEN 'نقوش الشويمس الصخرية'
    WHEN 8 THEN 'جبل السمراء'
    WHEN 9 THEN 'مدينة فيد الأثرية'
    WHEN 10 THEN 'أبراج قصر برزان'
    WHEN 11 THEN 'قصر حاتم الطائي'
    WHEN 12 THEN 'قرية طابة الأثرية'
    WHEN 13 THEN 'وادي مشار'
    WHEN 14 THEN 'صحراء النفود الكبير'
    WHEN 15 THEN 'محمية رملة السياحية'
    WHEN 16 THEN 'محمية توارن'
    WHEN 17 THEN 'محمية الإمام تركي بن عبدالله الملكية'
    WHEN 18 THEN 'محمية الملك سلمان بن عبدالعزيز الملكية'
END,

description_ar = CASE id
    WHEN 1 THEN 'نقوش وفنون صخرية قديمة تعكس آلاف السنين من الوجود البشري في منطقة حائل.'
    WHEN 2 THEN 'قلعة تاريخية مبنية من الطين تقع على مرتفع وتوفر إطلالة بانورامية على مدينة حائل.'
    WHEN 3 THEN 'من أبرز المعالم الطبيعية في حائل، وتشتهر بتكويناتها الصخرية المميزة وأوديتها الجميلة.'
    WHEN 4 THEN 'وجهة ثقافية تعرّف الزوار بتاريخ المنطقة وهويتها ونمط الحياة التقليدي فيها.'
    WHEN 5 THEN 'أحد معالم التراث المعماري في حائل ومن أشهر المباني التاريخية في المدينة.'
    WHEN 6 THEN 'وجهة جبلية للمغامرة والمناظر الصحراوية والمشي والتصوير.'
    WHEN 7 THEN 'متحف مفتوح مدرج في قائمة اليونسكو، يضم نقوشًا صخرية قديمة وسط جروف صحراوية وتضاريس بركانية مهيبة.'
    WHEN 8 THEN 'إطلالة محببة على مدينة حائل بمشاهد بانورامية واسعة ومساحات للمشي، وتزداد جمالًا وقت الغروب والمساء.'
    WHEN 9 THEN 'استكشف بقايا محطة رئيسية على درب زبيدة التاريخي، بما فيها الأسوار والآبار والمنشآت المائية القديمة.'
    WHEN 10 THEN 'أبراج طينية باقية من قصر تاريخي بارز كان يومًا في قلب الحياة السياسية والاجتماعية بمدينة حائل.'
    WHEN 11 THEN 'أطلال طينية في توارن ترتبط بالشاعر العربي الشهير ورمز الكرم الخالد حاتم الطائي.'
    WHEN 12 THEN 'قرية تاريخية تحتضنها فوهة بركان قديم، وتحيط بها المزارع وبساتين النخيل وجبال سلمى.'
    WHEN 13 THEN 'وادٍ جميل بين جبال أجا يشتهر بصخور الجرانيت الوردي وأشجار الطلح والخضرة الموسمية ومسارات المشي.'
    WHEN 14 THEN 'كثبان حمراء وذهبية شاسعة شمال حائل، مناسبة للرحلات الصحراوية مع مرشد ومراقبة النجوم والتصوير والتخييم الشتوي.'
    WHEN 15 THEN 'وجهة للمغامرات الصحراوية في توارن، تقدم تجارب خارجية مميزة بين جبال حائل والكثبان الرملية والمساحات الطبيعية المفتوحة.'
    WHEN 16 THEN 'محمية طبيعية ضمن امتداد جبال أجا، تتميز بتنوع تضاريسها وغطائها النباتي الموسمي والجبال المحيطة.'
    WHEN 17 THEN 'محمية ملكية واسعة تجمع بين الكثبان الرملية والسهول والأودية والهضاب، وتتميز بالتنوع الحيوي والسياحة البيئية.'
    WHEN 18 THEN 'محمية ملكية واسعة في شمال المملكة تجمع بين التنوع الطبيعي والتضاريس المتنوعة والمواقع الأثرية والتراث الطبيعي والثقافي.'
END
WHERE id BETWEEN 1 AND 18;

SELECT id, name, name_ar, description_ar
FROM attractions
ORDER BY id;

