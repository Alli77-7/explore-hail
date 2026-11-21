const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require('node:crypto');
const db = require("./config/database");
const { parsePreferences, generatePlan } = require("./planner/aiPlanner");
const seedAttractions = require("./data/attractions.json");
const { getCatalog } = require("./planner/catalog");
const { startGoogleRatingScheduler, syncGoogleRatings } = require("./services/googleRatings");
const { issueToken, requireAuth, requireProvider, requireAdmin, verifyPassword } = require("./auth");

const app = express();

const servicesUploadDir = path.join(__dirname, "../uploads/services");
fs.mkdirSync(servicesUploadDir, { recursive: true });
const serviceImageUpload = multer({
    storage: multer.diskStorage({
        destination: servicesUploadDir,
        filename: (req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
            callback(null, `provider-${req.params.id}-${Date.now()}${extension}`);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        callback(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype));
    },
});

function normalizePhone(value) {
    const digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 9 ? digits.slice(-9) : digits;
}

const bookingAttempts = new Map();
function isBookingRateLimited(key) {
    const now = Date.now();
    const recent = (bookingAttempts.get(key) || []).filter(timestamp => now - timestamp < 10 * 60 * 1000);
    recent.push(now);
    bookingAttempts.set(key, recent);
    return recent.length > 10;
}

// Middleware
app.use(cors());
app.use(express.json());

function requireDatabase(req, res, next) {
    if (!db) return res.status(503).json({ error: 'This feature requires MySQL. Configure DATABASE_MODE=mysql in backend/.env.' });
    next();
}

app.post("/api/auth/login", requireDatabase, async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "Username and password are required" });
    try {
        const [rows] = await db.promise().execute(
            `SELECT u.id, u.full_name, u.username, u.password, u.user_type, sp.id AS provider_id,
                    sp.slug AS provider_slug, sp.business_name, sp.name_ar, sp.category AS provider_category
             FROM users u LEFT JOIN service_providers sp ON sp.user_id = u.id
             WHERE u.username = ? LIMIT 1`, [String(username).trim()],
        );
        const user = rows[0];
        if (!user || !(await verifyPassword(password, user.password))) return res.status(401).json({ error: "Invalid credentials" });
        const role = user.user_type === 'admin' ? 'admin' : user.provider_category === 'restaurant' ? 'restaurant' : user.provider_category === 'hotel' ? 'hotel' : 'provider';
        user.role = role;
        res.json({ token: issueToken(user), user: { id: user.id, fullName: user.full_name, role, providerId: user.provider_slug || null, providerName: user.name_ar || user.business_name || null } });
    } catch (error) { console.error("Login failed:", error.message); res.status(500).json({ error: "Login failed" }); }
});

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
    if (!db) return res.json(seedAttractions);
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
    const { serviceId, fullName, email, phone, date, checkIn, checkOut, roomType, roomPrice, guests, notes } = req.body || {};
    const adults = guests === "4+" ? 4 : Number(guests);
    const validDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);
    const validStay = (!checkIn && !checkOut) || (typeof checkIn === "string" && typeof checkOut === "string" && /^\d{4}-\d{2}-\d{2}$/.test(checkIn) && /^\d{4}-\d{2}-\d{2}$/.test(checkOut) && checkOut > checkIn);

    if (!serviceId || !fullName?.trim() || !email?.trim() || !phone?.trim() || !validStay || !Number.isInteger(adults) || adults < 1 || adults > 4) {
        return res.status(400).json({ error: "Invalid booking details" });
    }
    if (isBookingRateLimited(`${req.ip}:${normalizePhone(phone)}`)) {
        return res.status(429).json({ error: "Too many booking attempts. Please try again later." });
    }
    if (!db) return res.status(503).json({ error: 'Bookings require MySQL. Configure DATABASE_MODE=mysql in backend/.env.' });

    try {
        const connection = db.promise();
        const [providers] = await connection.execute(
            "SELECT id, category FROM service_providers WHERE slug = ? LIMIT 1",
            [serviceId]
        );
        if (!providers.length) return res.status(404).json({ error: "Service not found" });
        if (providers[0].category === "hotel" && (!checkIn || !checkOut || !roomType || !Number(roomPrice))) return res.status(400).json({ error: "Hotel stay details are required" });
        if (!['hotel', 'restaurant'].includes(providers[0].category) && !validDate) return res.status(400).json({ error: "A booking date is required" });

        const normalizedPhone = normalizePhone(phone);
        if (normalizedPhone.length < 9) return res.status(400).json({ error: "A valid phone number is required" });
        const [activeBookings] = await connection.execute(
            `SELECT phone FROM bookings
             WHERE provider_id = ? AND status IN ('pending', 'confirmed')`,
            [providers[0].id],
        );
        if (activeBookings.some((booking) => normalizePhone(booking.phone) === normalizedPhone)) {
            return res.status(409).json({
                code: "ACTIVE_BOOKING_EXISTS",
                error: "An active booking already exists for this phone number",
            });
        }

        let queuePosition = null;
        if (providers[0].category === "restaurant") {
            const [queueRows] = await connection.execute(
                `SELECT COALESCE(MAX(queue_position), 0) + 1 AS next_position
                 FROM bookings
                 WHERE provider_id = ? AND status IN ('pending', 'confirmed')`,
                [providers[0].id],
            );
            queuePosition = Number(queueRows[0]?.next_position || 1);
        }

        const normalizedEmail = email.trim().toLowerCase();
        const [tourists] = await connection.execute(
            'SELECT id, user_type FROM users WHERE email = ? LIMIT 1', [normalizedEmail],
        );
        if (tourists[0] && tourists[0].user_type !== 'tourist') {
            return res.status(400).json({ error: 'Use a tourist email address for bookings' });
        }
        let touristId = tourists[0]?.id;
        if (!touristId) {
            const passwordHash = await bcrypt.hash(randomUUID(), 12);
            const [tourist] = await connection.execute(
                "INSERT INTO users (full_name, email, password, user_type) VALUES (?, ?, ?, 'tourist')",
                [fullName.trim(), normalizedEmail, passwordHash],
            );
            touristId = tourist.insertId;
        }

        const [bookingResult] = await connection.execute(
            `INSERT INTO bookings
             (tourist_id, provider_id, booking_date, check_in_date, check_out_date, room_type, room_price, status, total_price, phone, num_adults, num_children, notes, queue_position)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, 0, ?, ?)` ,
            [touristId, providers[0].id, validDate ? `${date} 00:00:00` : null, checkIn || null, checkOut || null, roomType || null, Number(roomPrice) || 0, 0, phone.trim(), adults, String(notes || "").trim(), queuePosition]
        );

        res.status(201).json({ bookingId: bookingResult.insertId, status: "pending", queuePosition });
    } catch (err) {
        console.error("Failed to create booking:", err.message);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

app.get('/api/bookings/lookup', requireDatabase, async (req, res) => {
    const bookingId = Number(req.query.bookingId);
    const phone = normalizePhone(req.query.phone);
    if (!Number.isInteger(bookingId) || bookingId < 1 || phone.length < 9) {
        return res.status(400).json({ error: 'Booking number and valid phone number are required' });
    }
    try {
        const [rows] = await db.promise().execute(
            `SELECT b.id, b.phone, b.status, b.queue_position, b.booking_date,
                    b.check_in_date, b.check_out_date, b.room_type, b.room_price,
                    b.created_at, sp.business_name, sp.name_ar, sp.category
             FROM bookings b JOIN service_providers sp ON sp.id = b.provider_id
             WHERE b.id = ? LIMIT 1`,
            [bookingId],
        );
        const booking = rows[0];
        if (!booking || normalizePhone(booking.phone) !== phone) return res.status(404).json({ error: 'Booking not found' });
        delete booking.phone;
        res.json(booking);
    } catch (error) {
        console.error('Booking lookup failed:', error.message);
        res.status(500).json({ error: 'Failed to lookup booking' });
    }
});

app.get('/api/admin/providers', requireAuth, requireAdmin, requireDatabase, async (req, res) => {
    try {
        const [rows] = await db.promise().execute(
            `SELECT sp.id, sp.slug, sp.business_name, sp.name_ar, sp.category, sp.type_label,
                    sp.type_label_ar, sp.contact_info, sp.location, sp.location_ar, sp.rating,
                    sp.price_range, sp.price_range_ar, sp.image_url, u.id AS user_id, u.username, u.email,
                    u.full_name, u.user_type
             FROM service_providers sp JOIN users u ON u.id = sp.user_id ORDER BY sp.id DESC`,
        );
        res.json(rows);
    } catch (error) { console.error('Admin providers failed:', error.message); res.status(500).json({ error: 'Failed to load providers' }); }
});

app.post('/api/admin/providers', requireAuth, requireAdmin, requireDatabase, async (req, res) => {
    const { username, password, fullName, businessName, nameAr, category, typeLabel, typeLabelAr, contact, location, locationAr, price, priceAr } = req.body || {};
    if (!username?.trim() || !password || password.length < 8 || !fullName?.trim() || !businessName?.trim() || !['hotel', 'restaurant', 'cafe', 'tour', 'cars'].includes(category)) {
        return res.status(400).json({ error: 'Username, password (8+), names, and valid category are required' });
    }
    const connection = db.promise();
    try {
        const hash = await bcrypt.hash(password, 12);
        const email = `${username.trim().toLowerCase()}@explore-hail.local`;
        const [userResult] = await connection.execute(
            `INSERT INTO users (full_name, email, username, password, user_type) VALUES (?, ?, ?, ?, 'provider')`,
            [fullName.trim(), email, username.trim().toLowerCase(), hash],
        );
        const slug = username.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        await connection.execute(
            `INSERT INTO service_providers
             (user_id, slug, business_name, name_ar, category, type_label, type_label_ar, description,
              contact_info, rating, price_range, price_range_ar, location, location_ar, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, '/uploads/services/default.svg')`,
            [userResult.insertId, slug, businessName.trim(), nameAr || businessName.trim(), category, typeLabel || category, typeLabelAr || typeLabel || category, `${businessName.trim()} service`, contact || '', price || '', priceAr || price || '', location || 'Hail, Saudi Arabia', locationAr || 'حائل، المملكة العربية السعودية'],
        );
        res.status(201).json({ slug });
    } catch (error) {
        const duplicate = error.code === 'ER_DUP_ENTRY';
        res.status(duplicate ? 409 : 500).json({ error: duplicate ? 'Username or provider already exists' : 'Failed to create provider' });
    }
});

app.patch('/api/admin/providers/:id', requireAuth, requireAdmin, requireDatabase, async (req, res) => {
    const { businessName, nameAr, category, typeLabel, typeLabelAr, contact, location, locationAr, price, priceAr, password } = req.body || {};
    try {
        const [result] = await db.promise().execute(
            `UPDATE service_providers SET business_name=?, name_ar=?, category=?, type_label=?, type_label_ar=?, contact_info=?, location=?, location_ar=?, price_range=?, price_range_ar=? WHERE id=?`,
            [businessName, nameAr, category, typeLabel, typeLabelAr, contact || '', location || '', locationAr || '', price || '', priceAr || '', req.params.id],
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Provider not found' });
        if (password) {
            const hash = await bcrypt.hash(password, 12);
            await db.promise().execute('UPDATE users u JOIN service_providers sp ON sp.user_id=u.id SET u.password=? WHERE sp.id=?', [hash, req.params.id]);
        }
        res.json({ updated: true });
    } catch (error) { res.status(500).json({ error: 'Failed to update provider' }); }
});

app.post('/api/admin/providers/:id/image', requireAuth, requireAdmin, requireDatabase, (req, res) => {
    serviceImageUpload.single('image')(req, res, async (uploadError) => {
        if (uploadError) {
            const message = uploadError.code === 'LIMIT_FILE_SIZE'
                ? 'Image must be 5 MB or smaller'
                : 'Only JPG, PNG, and WEBP images are supported';
            return res.status(400).json({ error: message });
        }
        if (!req.file) return res.status(400).json({ error: 'An image is required' });
        try {
            const imageUrl = `/uploads/services/${req.file.filename}`;
            const [result] = await db.promise().execute(
                'UPDATE service_providers SET image_url = ? WHERE id = ?',
                [imageUrl, req.params.id],
            );
            if (!result.affectedRows) {
                fs.unlinkSync(req.file.path);
                return res.status(404).json({ error: 'Provider not found' });
            }
            res.json({ imageUrl });
        } catch (error) {
            if (req.file?.path) fs.unlink(req.file.path, () => {});
            console.error('Provider image upload failed:', error.message);
            res.status(500).json({ error: 'Failed to save provider image' });
        }
    });
});

app.get("/api/provider/bookings", requireAuth, requireProvider, requireDatabase, async (req, res) => {
    try {
        const providerId = req.auth.role === 'admin' ? null : req.auth.providerId;
        const [rows] = await db.promise().execute(
            `SELECT b.id, sp.slug AS provider_slug, sp.business_name, sp.name_ar,
                    u.full_name, u.email, b.phone, b.num_adults, b.booking_date,
                    b.check_in_date, b.check_out_date, b.room_type, b.room_price,
                    b.status, b.notes, b.queue_position, b.created_at
             FROM bookings b JOIN users u ON u.id = b.tourist_id
             JOIN service_providers sp ON sp.id = b.provider_id
             WHERE (? IS NULL OR sp.slug = ?)
             ORDER BY b.created_at DESC`, [providerId, providerId],
        );
        res.json(rows);
    } catch (error) { console.error('Provider bookings failed:', error.message); res.status(500).json({ error: 'Failed to load bookings' }); }
});

app.patch("/api/provider/bookings/:id", requireAuth, requireProvider, requireDatabase, async (req, res) => {
    const requestedStatus = String(req.body?.status || '');
    const status = { served: 'completed', 'checked-in': 'completed' }[requestedStatus] || requestedStatus;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    try {
        const providerId = req.auth.role === 'admin' ? null : req.auth.providerId;
        const [result] = await db.promise().execute(
            `UPDATE bookings b JOIN service_providers sp ON sp.id = b.provider_id
             SET b.status = ? WHERE b.id = ? AND (? IS NULL OR sp.slug = ?)`,
            [status, req.params.id, providerId, providerId],
        );
        if (!result.affectedRows) return res.status(404).json({ error: 'Booking not found' });
        res.json({ status });
    } catch (error) { console.error('Booking status update failed:', error.message); res.status(500).json({ error: 'Failed to update booking' }); }
});

// Smart trip plan (LLM)
app.post("/api/plan", async (req, res) => {
    const preferences = parsePreferences(req.body);

    if (!preferences) {
        return res.status(400).json({
            error: "Invalid trip preferences"
        });
    }

    if (!process.env.AI_API_KEY) {
        return res.status(503).json({ error: "Smart planner is not configured. Use the local itinerary." });
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
const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    if (db) startGoogleRatingScheduler(db);
});
