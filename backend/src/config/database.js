const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mysql = require('mysql2');

// Local previews use the checked-in snapshot unless MySQL is configured.
const mode = process.env.DATABASE_MODE ||
    (process.env.NODE_ENV === 'production' || process.env.DB_HOST ? 'mysql' : 'demo');
if (!['mysql', 'demo'].includes(mode)) throw new Error('DATABASE_MODE must be mysql or demo');

const db = mode === 'mysql' ? mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'explore_hail',
    connectTimeout: 5000,
    dateStrings: true,
    charset: 'utf8mb4',
}) : null;

if (!db) console.log('Local preview: using seed data (DATABASE_MODE=demo).');

module.exports = db;
