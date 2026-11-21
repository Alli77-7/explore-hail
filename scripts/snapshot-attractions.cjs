// Rebuild the local preview snapshot from the existing SQL seed.
const fs = require('node:fs');
const path = require('node:path');
const sql = fs.readFileSync(path.join(__dirname, '../database/update_seed_data.sql'), 'utf8');
const columns = ['id', 'name', 'description', 'google_map_url', 'category', 'rating', 'price', 'image_url', 'has_inscriptions'];
const rows = [...sql.matchAll(/\(\s*(\d+),\s*('(?:[^']|'')*'),\s*('(?:[^']|'')*'),\s*('(?:[^']|'')*'),\s*('(?:[^']|'')*'),\s*([\d.]+),\s*([\d.]+),\s*('(?:[^']|'')*'),\s*(TRUE|FALSE)\s*\)/g)];
const localized = column => new Map([...sql.split(`${column} = CASE id`)[1].split('END')[0].matchAll(/WHEN (\d+) THEN '((?:[^']|'')*)'/g)].map(match => [Number(match[1]), match[2].replaceAll("''", "'")]));
const names = localized('name_ar');
const descriptions = localized('description_ar');
const attractions = rows.map(match => {
  const place = Object.fromEntries(columns.map((column, index) => {
    const value = match[index + 1];
    return [column, value.startsWith("'") ? value.slice(1, -1).replaceAll("''", "'") : value === 'TRUE' ? true : value === 'FALSE' ? false : Number(value)];
  }));
  return { ...place, name_ar: names.get(place.id), description_ar: descriptions.get(place.id), latitude: null, longitude: null, created_at: null };
});
if (attractions.length !== 18 || attractions.some(place => !place.name_ar || !place.description_ar)) throw new Error('Incomplete attraction seed');
const target = path.join(__dirname, '../backend/src/data/attractions.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(attractions, null, 2) + '\n');
console.log(`Saved ${attractions.length} seed attractions.`);
