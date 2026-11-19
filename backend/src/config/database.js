const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require("mysql2");

// جديد — يقرأ إعدادات الاتصال من backend/.env مع إبقاء القيم الافتراضية للتطوير المحلي.
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
<<<<<<< HEAD
    database: process.env.DB_NAME || "explore_hail",
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

module.exports = db;
