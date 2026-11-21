USE explore_hail;

UPDATE attractions
SET image_url = CASE name
    WHEN 'Jubbah Rock Art' THEN '/uploads/attractions-img/jubbah.svg'
    WHEN 'A''arif Fort' THEN '/uploads/attractions-img/arif.svg'
    WHEN 'Aja Mountains' THEN '/uploads/attractions-img/aja.svg'
    WHEN 'Hail Museum' THEN '/uploads/attractions-img/museum.svg'
    WHEN 'Qishlah Palace' THEN '/uploads/attractions-img/qishlah.svg'
    WHEN 'Salma Mountains' THEN '/uploads/attractions-img/salma.svg'
    WHEN 'Shuwaymis Rock Art' THEN '/uploads/attractions-img/shuwaymis.jpg'
    WHEN 'Al Samra Mountain' THEN '/uploads/attractions-img/samra.jpg'
    WHEN 'Fayd Archaeological City' THEN '/uploads/attractions-img/fayd.jpg'
    WHEN 'Barzan Palace Towers' THEN '/uploads/attractions-img/barzan.jpg'
    WHEN 'Hatim Al Tai Palace' THEN '/uploads/attractions-img/hatim-palace.jpg'
    WHEN 'Taba Archaeological Village' THEN '/uploads/attractions-img/taba.jpg'
    WHEN 'Wadi Mashar' THEN '/uploads/attractions-img/mashar.jpg'
    WHEN 'Great Nafud Desert' THEN '/uploads/attractions-img/nafud.jpg'
    WHEN 'Ramlah Tourist Reserve' THEN '/uploads/attractions-img/rumlah.svg'
    WHEN 'Tuwarin Reserve' THEN '/uploads/attractions-img/tuwarin-reserve.jpg'
    WHEN 'Imam Turki bin Abdullah Royal Reserve' THEN '/uploads/attractions-img/imam-turki-reserve.jpg'
    WHEN 'King Salman bin Abdulaziz Royal Reserve' THEN '/uploads/attractions-img/king-salman-reserve.jpg'
    ELSE image_url
END
WHERE image_url IS NULL OR image_url = '';
