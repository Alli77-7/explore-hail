const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const db = require('../src/config/database');

const accounts = [
    ['flox', 'flox1234', 'مطعم Flox', 'flox'],
    ['roga', 'roga1234', 'مطعم Roga Roko', 'roga-roko'],
    ['hotel', 'hotel1234', 'فندق جولدن توليب حائل', 'golden-tulip'],
    ['millennium', 'millennium1234', 'فندق ميلينيوم حائل', 'millennium'],
];

const serviceTranslations = [
    ['golden-tulip', 'فندق جولدن توليب حائل', 'فندق', 'طريق الملك عبدالعزيز، حائل'],
    ['millennium', 'فندق ميلينيوم حائل', 'فندق فاخر', 'حائل، المملكة العربية السعودية'],
    ['roga-roko', 'مطعم روغو روكا الإيطالي', 'مطعم إيطالي', 'حائل، المملكة العربية السعودية'],
    ['flox', 'مطعم فلوكس', 'مطعم راقٍ', 'حائل، المملكة العربية السعودية'],
    ['rumlah', 'محمية رملة', 'محمية وتجربة سياحية', 'منطقة حائل، المملكة العربية السعودية'],
    ['geisha', 'جيشا كافيه', 'كافيه', 'حائل، المملكة العربية السعودية'],
    ['sakura', 'ساكورا كافيه', 'كافيه', 'حائل، المملكة العربية السعودية'],
    ['peacock', 'الطاووس كافيه', 'كافيه', 'حائل، المملكة العربية السعودية'],
    ['eveness', 'إيفينس كافيه', 'كافيه عصري', 'حائل، المملكة العربية السعودية'],
    ['al-tone', 'التون كافيه', 'كافيه', 'حائل، المملكة العربية السعودية'],
    ['trip-cars', 'سيارات وتجهيز الرحلات', 'سيارات وتجهيز رحلات', 'حائل، المملكة العربية السعودية'],
];

(async () => {
    const connection = db.promise();
    // Migrate the original demo usernames to the production usernames.
    await connection.query("UPDATE users SET username='admin', email='admin@explore-hail.local' WHERE username='flox' AND user_type='admin'");
    await connection.query("UPDATE users SET username='flox', email='flox@explore-hail.local' WHERE username='restaurant' AND user_type='provider'");
    const adminHash = await bcrypt.hash('admin1234', 12);
    await connection.query(
        `INSERT INTO users (full_name, email, username, password, user_type)
         VALUES ('Explore Hail Admin', 'admin@explore-hail.local', 'admin', ?, 'admin')
         ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password=VALUES(password), user_type='admin'`,
        [adminHash],
    );
    for (const [username, password, fullName, slug] of accounts) {
        const hash = await bcrypt.hash(password, 12);
        await connection.query(
            `INSERT INTO users (full_name, email, username, password, user_type)
             VALUES (?, CONCAT(?, '@explore-hail.local'), ?, ?, 'provider')
             ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), password=VALUES(password), user_type='provider'`,
            [fullName, username, username, hash],
        );
        await connection.query(
            `UPDATE service_providers sp JOIN users u ON u.username = ? SET sp.user_id = u.id WHERE sp.slug = ?`,
            [username, slug],
        );
    }

    const [[attractionCount]] = await connection.query('SELECT COUNT(*) AS total FROM attractions');
    if (Number(attractionCount.total) === 0) {
        const attractionSql = fs.readFileSync(
            path.join(__dirname, '../../database/attractions_from_frontend.sql'),
            'utf8',
        );
        for (const statement of attractionSql.split(';').map(item => item.trim()).filter(Boolean)) {
            if (/^INSERT\s+INTO\s+attractions/i.test(statement)) {
                await connection.query(statement);
            }
        }
        console.log('Attraction catalog seeded');
    }

    const attractionImageMigration = fs.readFileSync(
        path.join(__dirname, '../../database/migrate_attraction_images.sql'),
        'utf8',
    );
    for (const statement of attractionImageMigration.split(';').map(item => item.trim()).filter(Boolean)) {
        if (!/^USE\s+/i.test(statement)) await connection.query(statement);
    }

    for (const [slug, nameAr, typeLabelAr, locationAr] of serviceTranslations) {
        await connection.query(
            'UPDATE service_providers SET name_ar = ?, type_label_ar = ?, location_ar = ? WHERE slug = ?',
            [nameAr, typeLabelAr, locationAr, slug],
        );
    }

    console.log('Production provider accounts seeded');
    process.exit(0);
})().catch(error => { console.error(error); process.exit(1); });
