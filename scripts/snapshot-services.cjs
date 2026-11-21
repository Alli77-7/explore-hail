// Rebuild the local service snapshot from the existing database migration.
const fs = require('node:fs');
const path = require('node:path');

const sql = fs.readFileSync(path.join(__dirname, '../database/migrate_frontend_services.sql'), 'utf8');
const columns = ['id', 'name', 'nameAr', 'type', 'typeLabel', 'typeLabelAr', 'description',
    'contact', 'rating', 'price', 'priceAr', 'location', 'locationAr', 'image'];
const rows = [...sql.matchAll(/\(LAST_INSERT_ID\(\),([^\n]+)\)/g)];
const services = rows.map(match => {
    const values = match[1].match(/'(?:[^']|'')*'|\b\d+(?:\.\d+)?\b/g);
    if (values.length !== columns.length) throw new Error('Invalid service seed row');
    return Object.fromEntries(columns.map((column, index) => {
        const value = values[index];
        return [column, value.startsWith("'") ? value.slice(1, -1).replaceAll("''", "'") : Number(value)];
    }));
});
if (services.length !== 11) throw new Error('Incomplete service seed');
fs.writeFileSync(path.join(__dirname, '../backend/src/data/services.json'), JSON.stringify(services, null, 2) + '\n');
console.log(`Saved ${services.length} seed services.`);
