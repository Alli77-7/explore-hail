const interestCategories = {
    nature: ["natural"],
    history: ["historical", "cultural"],
    adventure: ["adventure"],
    food: [],
};

function query(connection, sql, params = []) {
    const executor = connection.promise ? connection.promise() : connection;
    return executor.query(sql, params).then(([rows]) => rows);
}

async function getCatalog(connection) {
    const [attractionRows, serviceRows] = await Promise.all([
        query(connection, `
            SELECT id, name, description, category, google_map_url AS mapsUrl, image_url AS image,
                   rating, price, name_ar AS nameAr, description_ar AS descriptionAr
            FROM attractions
            ORDER BY id
        `),
        query(connection, `
            SELECT slug AS id, business_name AS name, name_ar AS nameAr, category, category AS type,
                   type_label AS typeLabel, type_label_ar AS typeLabelAr, description,
                   contact_info AS contact, rating, price_range AS price, price_range_ar AS priceAr,
                   location, location_ar AS locationAr, image_url AS image,
                   google_place_id AS googlePlaceId, google_maps_url AS googleMapsUrl,
                   google_rating_count AS googleRatingCount,
                   google_rating_updated_at AS ratingUpdatedAt
            FROM service_providers
            WHERE slug IS NOT NULL
            ORDER BY id
        `),
    ]);

    const attractions = attractionRows.map(place => ({ ...place, about: place.description }));
    const services = serviceRows.map(service => ({ ...service, about: service.description }));

    return {
        attractions,
        restaurants: services.filter(service => service.category === "restaurant"),
        cafes: services.filter(service => service.category === "cafe"),
        hotels: services.filter(service => service.category === "hotel"),
        services,
        interestCategories,
        allPlaceIds: [...attractions, ...services].map(place => String(place.id)),
        hotelIds: services.filter(service => service.category === "hotel").map(service => String(service.id)),
    };
}

module.exports = { getCatalog, interestCategories };
