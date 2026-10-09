// قائمة الأماكن اللي يسمح للموديل يختار منها فقط
// الـ id لازم يطابق الـ id في الفرونت (attractions.data.ts و booking.data.ts)
// الأسماء والصور تنعرض من بيانات الفرونت، هنا بس اللي يحتاجه الموديل عشان يرتب

const attractions = [
    { id: "jubbah", name: "Jubbah Rock Art", category: "historical", about: "Ancient rock art and inscriptions, thousands of years old." },
    { id: "arif", name: "A'arif Fort", category: "historical", about: "Hilltop mud-brick fort with panoramic city views." },
    { id: "aja", name: "Aja Mountains", category: "natural", about: "Dramatic rock formations and scenic valleys." },
    { id: "museum", name: "Hail Museum", category: "cultural", about: "Indoor museum on the region's history and traditional life." },
    { id: "qishlah", name: "Qishlah Palace", category: "historical", about: "Well-known historic building in central Hail." },
    { id: "salma", name: "Salma Mountains", category: "adventure", about: "Hiking, desert landscapes and photography." },
    { id: "shuwaymis", name: "Shuwaymis Rock Art", category: "historical", about: "UNESCO-listed open-air petroglyphs among desert cliffs, far from the city." },
    { id: "samra", name: "Al Samra Mountain", category: "natural", about: "City viewpoint, best at sunset and in the evening." },
    { id: "fayd", name: "Fayd Archaeological City", category: "historical", about: "Station on the Zubaydah pilgrimage route: walls, wells, waterworks." },
    { id: "barzan", name: "Barzan Palace Towers", category: "historical", about: "Surviving mud-brick towers in the heart of Hail." },
    { id: "hatim-palace", name: "Hatim Al Tai Palace", category: "cultural", about: "Mud-brick ruins in Tuwaren linked to the poet Hatim Al Tai." },
    { id: "taba", name: "Taba Archaeological Village", category: "historical", about: "Historic village around a volcanic crater near Salma Mountains." },
    { id: "mashar", name: "Wadi Mashar", category: "natural", about: "Valley in the Aja Mountains: pink granite, acacia trees, hiking." },
    { id: "great-nafud", name: "Great Nafud Desert", category: "adventure", about: "Red dunes for desert drives, stargazing and camping." },
    { id: "ramlah-tourist-reserve", name: "Ramlah Tourist Reserve", category: "adventure", about: "Desert adventure destination in Tuwarin." },
    { id: "tuwarin-reserve", name: "Tuwarin Reserve", category: "adventure", about: "Natural reserve in the Aja landscape with seasonal vegetation." },
    { id: "imam-turki-royal-reserve", name: "Imam Turki bin Abdullah Royal Reserve", category: "adventure", about: "Vast royal reserve of dunes, plains and valleys." },
    { id: "king-salman-royal-reserve", name: "King Salman bin Abdulaziz Royal Reserve", category: "adventure", about: "Vast protected landscape with archaeological sites." },
];

const restaurants = [
    { id: "roga-roko", name: "Roga Roko Italian Restaurant", about: "Italian restaurant." },
    { id: "flox", name: "Flox Restaurant", about: "Fine dining." },
];

const cafes = [
    { id: "geisha", name: "Geisha Cafe", about: "Cafe." },
    { id: "sakura", name: "Sakura Cafe", about: "Cafe." },
    { id: "peacock", name: "Peacock Cafe", about: "Cafe." },
    { id: "eveness", name: "Eveness Cafe", about: "Modern cafe." },
    { id: "al-tone", name: "Al Tone Cafe", about: "Cafe." },
];

const hotels = [
    { id: "golden-tulip", name: "Golden Tulip Hail", about: "Hotel on King Abdulaziz Road, 500-800 SAR/night." },
    { id: "millennium", name: "Millennium Hotel Hail", about: "Luxury hotel, 650-1200 SAR/night." },
];

// كل اهتمام وش يقابله من تصنيفات المعالم (نفس planner.data.ts)
const interestCategories = {
    nature: ["natural"],
    history: ["historical", "cultural"],
    adventure: ["adventure"],
    food: [],
};

const allPlaceIds = [...attractions, ...restaurants, ...cafes].map(place => place.id);

const hotelIds = hotels.map(hotel => hotel.id);

module.exports = { attractions, restaurants, cafes, hotels, interestCategories, allPlaceIds, hotelIds };
