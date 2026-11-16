const mysql = require("mysql2");

// جديد — يقرأ إعدادات الاتصال من backend/.env مع إبقاء القيم الافتراضية للتطوير المحلي.
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "explore_hail"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }

    console.log("Database connected successfully");
});

module.exports = db;
