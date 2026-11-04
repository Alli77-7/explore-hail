const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const { parsePreferences, generatePlan } = require("./planner/aiPlanner");
const { getCatalog } = require("./planner/catalog");
const { startGoogleRatingScheduler, syncGoogleRatings } = require("./services/googleRatings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images/files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

// Health check
app.get("/", (req, res) => {
    res.json({
        status: "running",
        service: "Explore Hail Backend"
    });
});

// Get all attractions
app.get("/api/attractions", (req, res) => {
    db.query("SELECT * FROM attractions", (err, results) => {
        if (err) {
            console.error("Failed to fetch attractions:", err.message);

            return res.status(500).json({
                error: "Failed to fetch attractions"
            });
        }

        res.json(results);
    });
});

// Booking and planner services are managed in the database.
app.get("/api/services", async (req, res) => {
    try {
        const catalog = await getCatalog(db);
        res.json(catalog.services);
    } catch (err) {
        console.error("Failed to fetch services:", err.message);
        res.status(500).json({ error: "Failed to fetch services" });
    }
});

// Booking API: returns the providers shown on the booking page.
app.get("/api/booking", async (req, res) => {
    try {
        const catalog = await getCatalog(db);
        res.json(catalog.services);
    } catch (err) {
        console.error("Failed to fetch booking providers:", err.message);
        res.status(500).json({ error: "Failed to fetch booking providers" });
    }
});

// Refresh stored provider ratings from Google Places (New).
// This is intentionally manual so normal page visits never create Google API charges.
app.post("/api/booking/ratings/sync", async (req, res) => {
    try {
        const result = await syncGoogleRatings(db);
        res.json(result);
    } catch (err) {
        console.error("Failed to sync Google ratings:", err.message);
        res.status(500).json({ error: "Failed to sync Google ratings" });
    }
});

// Create a booking request and persist it in the database.
app.post(["/api/bookings", "/api/booking"], async (req, res) => {
    const { serviceId, fullName, email, phone, date, guests, notes } = req.body || {};
    const adults = guests === "4+" ? 4 : Number(guests);
    const validDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);

    if (!serviceId || !fullName?.trim() || !email?.trim() || !phone?.trim() || !validDate || !Number.isInteger(adults) || adults < 1 || adults > 4) {
        return res.status(400).json({ error: "Invalid booking details" });
    }

    try {
        const connection = db.promise();
        const [providers] = await connection.execute(
            "SELECT id FROM service_providers WHERE slug = ? LIMIT 1",
            [serviceId]
        );
        if (!providers.length) return res.status(404).json({ error: "Service not found" });

        const [userResult] = await connection.execute(
            `INSERT INTO users (full_name, email, password, user_type)
             VALUES (?, ?, 'booking-request', 'tourist')
             ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id), full_name = VALUES(full_name)`,
            [fullName.trim(), email.trim()]
        );
        const touristId = userResult.insertId;

        const [bookingResult] = await connection.execute(
            `INSERT INTO bookings
             (tourist_id, provider_id, booking_date, status, total_price, phone, num_adults, num_children, notes)
             VALUES (?, ?, ?, 'pending', 0, ?, ?, 0, ?)`,
            [touristId, providers[0].id, `${date} 00:00:00`, phone.trim(), adults, String(notes || "").trim()]
        );

        res.status(201).json({ bookingId: bookingResult.insertId, status: "pending" });
    } catch (err) {
        console.error("Failed to create booking:", err.message);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

// Smart trip plan (LLM)
app.post("/api/plan", async (req, res) => {
    const preferences = parsePreferences(req.body);

    if (!preferences) {
        return res.status(400).json({
            error: "Invalid trip preferences"
        });
    }

    try {
        const plan = await generatePlan(preferences, db);
        res.json(plan);
    } catch (err) {
        console.error("Failed to generate plan:", err.message);

        res.status(502).json({
            error: "Failed to generate plan"
        });
    }
});

// Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    startGoogleRatingScheduler(db);
});
