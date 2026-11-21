const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require("mysql2");

<<<<<<< HEAD
<<<<<<< HEAD
// Local previews use the checked-in seed snapshot unless MySQL is configured.
const mode = process.env.DATABASE_MODE ||
    (process.env.NODE_ENV === "production" || process.env.DB_HOST ? "mysql" : "demo");
if (!["mysql", "demo"].includes(mode)) throw new Error("DATABASE_MODE must be mysql or demo");
const db = mode === "mysql" ? mysql.createPool({
=======
// جديد — يقرأ إعدادات الاتصال من backend/.env مع إبقاء القيم الافتراضية للتطوير المحلي.
const db = mysql.createConnection({
>>>>>>> 04addd5bc08fcfa8a4258aaa6cd9e803f2eebc68
=======
// جديد — يقرأ إعدادات الاتصال من backend/.env مع إبقاء القيم الافتراضية للتطوير المحلي.
const db = mysql.createConnection({
>>>>>>> 04addd5bc08fcfa8a4258aaa6cd9e803f2eebc68
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
<<<<<<< HEAD
    database: process.env.DB_NAME || "explore_hail",
<<<<<<< HEAD
    connectTimeout: 5000,
}) : null;
if (!db) console.log("Local preview: using seed attractions (DATABASE_MODE=demo).");

=======
<<<<<<< HEAD
    database: process.env.DB_NAME || "explore_hail",
=======
>>>>>>> 04addd5bc08fcfa8a4258aaa6cd9e803f2eebc68
    dateStrings: true,
    charset: "utf8mb4"
=======
    database: process.env.DB_NAME || "explore_hail"
>>>>>>> 3e052b06462f2a5bf22424b7287bdd966c3cf29d
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Database connected successfully");
});

<<<<<<< HEAD
>>>>>>> 04addd5bc08fcfa8a4258aaa6cd9e803f2eebc68
=======
>>>>>>> 04addd5bc08fcfa8a4258aaa6cd9e803f2eebc68
module.exports = db;
