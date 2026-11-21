const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places";

async function discoverGooglePlace(provider, apiKey) {
    const response = await fetch(`${GOOGLE_PLACES_URL}:searchText`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.googleMapsUri",
        },
        body: JSON.stringify({
            textQuery: `${provider.business_name}, ${provider.location || "Hail, Saudi Arabia"}`,
            languageCode: "en",
            maxResultCount: 1,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Google Text Search returned ${response.status}: ${message.slice(0, 300)}`);
    }

    const data = await response.json();
    if (!data.places?.[0]?.id) throw new Error("Google place was not found");
    return data.places[0];
}

async function fetchGoogleRating(placeId, apiKey) {
    const response = await fetch(`${GOOGLE_PLACES_URL}/${encodeURIComponent(placeId)}`, {
        headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "id,rating,userRatingCount,googleMapsUri",
        },
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(`Google Places returned ${response.status}: ${message.slice(0, 300)}`);
    }

    return response.json();
}

async function syncGoogleRatings(connection) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return { synced: 0, skipped: true, reason: "GOOGLE_MAPS_API_KEY is not configured" };
    }

    const executor = connection.promise ? connection.promise() : connection;
    const [providers] = await executor.query(
        `SELECT id, business_name, location, google_place_id
         FROM service_providers
         WHERE google_place_id IS NULL OR google_place_id = ''`
    );

    const [linkedProviders] = await executor.query(
        `SELECT id, business_name, location, google_place_id
         FROM service_providers
         WHERE google_place_id IS NOT NULL AND google_place_id <> ''`
    );

    let synced = 0;
    const errors = [];

    for (const provider of providers) {
        try {
            const place = await discoverGooglePlace(provider, apiKey);
            const rating = Number(place.rating);
            const count = Number(place.userRatingCount);

            if (!Number.isFinite(rating)) {
                throw new Error("Google place has no rating");
            }

            await executor.execute(
                `UPDATE service_providers
                 SET google_place_id = ?, rating = ?, google_rating_count = ?, google_maps_url = COALESCE(?, google_maps_url),
                     google_rating_updated_at = NOW()
                 WHERE id = ?`,
                [place.id, rating, Number.isFinite(count) ? count : null, place.googleMapsUri || null, provider.id]
            );
            synced += 1;
        } catch (error) {
            errors.push({ provider: provider.business_name, error: error.message });
        }
    }

    for (const provider of linkedProviders) {
        try {
            const place = await fetchGoogleRating(provider.google_place_id, apiKey);
            const rating = Number(place.rating);
            const count = Number(place.userRatingCount);

            if (!Number.isFinite(rating)) throw new Error("Google place has no rating");

            await executor.execute(
                `UPDATE service_providers
                 SET rating = ?, google_rating_count = ?, google_maps_url = COALESCE(?, google_maps_url),
                     google_rating_updated_at = NOW()
                 WHERE id = ?`,
                [rating, Number.isFinite(count) ? count : null, place.googleMapsUri || null, provider.id]
            );
            synced += 1;
        } catch (error) {
            errors.push({ provider: provider.business_name, error: error.message });
        }
    }

    return { synced, skipped: false, discovered: providers.length, refreshed: linkedProviders.length, errors };
}

function getRiyadhTime() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Riyadh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date());

    return Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));
}

function startGoogleRatingScheduler(connection) {
    let lastRunMonth = null;

    const checkSchedule = async () => {
        const now = getRiyadhTime();
        const month = `${now.year}-${now.month}`;
        const isFirstDayOfMonth = now.day === "01";
        const isScheduledWindow = now.hour === "03" && Number(now.minute) <= 5;

        if (!isFirstDayOfMonth || !isScheduledWindow || lastRunMonth === month) return;
        lastRunMonth = month;

        try {
            const result = await syncGoogleRatings(connection);
            console.log("Scheduled Google ratings sync completed:", result);
        } catch (error) {
            console.error("Scheduled Google ratings sync failed:", error.message);
        }
    };

    const timer = setInterval(checkSchedule, 60 * 1000);
    checkSchedule();
    console.log("Google ratings scheduler enabled monthly on day 1 at 03:00 Asia/Riyadh");
    return timer;
}

module.exports = { syncGoogleRatings, startGoogleRatingScheduler };
