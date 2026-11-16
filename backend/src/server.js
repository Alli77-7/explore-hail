const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const { parsePreferences, generatePlan } = require("./planner/aiPlanner");
const { getCatalog } = require("./planner/catalog");
const { startGoogleRatingScheduler, syncGoogleRatings } = require("./services/googleRatings");
// جديد — أدوات إنشاء الحسابات والتحقق من تسجيل الدخول وصلاحيات الأدوار.
const { createToken, checkPassword, hashPassword, requireAuth, requireRole } = require("./auth");
// جديد — خدمة إرسال إشعار البريد بعد قبول أو رفض الحجز.
const { sendBookingStatusEmail } = require("./email");

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

// جديد — يسجل سائحًا أو مقدم خدمة، ويعيد رمزًا لاستخدامه في المسارات المحمية.
app.post("/api/auth/register", async (req, res) => {
    const { fullName, email, password, userType = "tourist", businessName, category } = req.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (typeof fullName !== "string" || fullName.trim().length < 2 || fullName.trim().length > 100 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
        typeof password !== "string" || password.length < 8 || password.length > 128 ||
        !["tourist", "provider"].includes(userType)) {
        return res.status(400).json({ error: "Invalid registration details" });
    }
    if (userType === "provider" && (typeof businessName !== "string" || !businessName.trim() || !category)) {
        return res.status(400).json({ error: "Business name and category are required" });
    }
    const connection = db.promise();
    let transactionStarted = false;
    try {
        await connection.beginTransaction();
        transactionStarted = true;
        const [result] = await connection.execute(
            "INSERT INTO users (full_name, email, password, user_type) VALUES (?, ?, ?, ?)",
            [fullName.trim(), normalizedEmail, hashPassword(password), userType]
        );
        if (userType === "provider") {
            const slug = `${businessName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 65)}-${result.insertId}`;
            await connection.execute(
                "INSERT INTO service_providers (user_id, slug, business_name, category) VALUES (?, ?, ?, ?)",
                [result.insertId, slug, businessName.trim(), String(category).trim()]
            );
        }
        await connection.commit();
        const user = { id: result.insertId, full_name: fullName.trim(), email: normalizedEmail, user_type: userType };
        res.status(201).json({ user, token: createToken(user) });
    } catch (err) {
        if (transactionStarted) await connection.rollback();
        if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Email is already registered" });
        console.error("Registration failed:", err.message);
        res.status(500).json({ error: "Registration failed" });
    }
});

// جديد — يسجل دخول المستخدم بعد مطابقة كلمة المرور مع التجزئة المحفوظة.
app.post("/api/auth/login", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const password = req.body?.password;
    if (!email || typeof password !== "string") return res.status(400).json({ error: "Email and password are required" });
    try {
        const [users] = await db.promise().execute(
            "SELECT id, full_name, email, password, user_type FROM users WHERE email = ? LIMIT 1",
            [email]
        );
        const account = users[0];
        if (!account || !checkPassword(password, account.password)) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const user = { id: account.id, full_name: account.full_name, email: account.email, user_type: account.user_type };
        res.json({ user, token: createToken(user) });
    } catch (err) {
        console.error("Login failed:", err.message);
        res.status(500).json({ error: "Login failed" });
    }
});

// جديد — يعيد بيانات الحساب المرتبط برمز الدخول.
app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
        const [users] = await db.promise().execute(
            "SELECT id, full_name, email, user_type FROM users WHERE id = ? LIMIT 1",
            [req.user.id]
        );
        if (!users[0]) return res.status(401).json({ error: "Account no longer exists" });
        res.json({ user: users[0] });
    } catch (err) {
        console.error("Failed to fetch account:", err.message);
        res.status(500).json({ error: "Failed to fetch account" });
    }
});

// جديد — ينشئ طلب حجز مرتبطًا بالمستخدم الذي سجل الدخول؛ بيانات الاسم والبريد لا تؤخذ من العميل.
app.post(["/api/bookings", "/api/booking"], requireAuth, requireRole("tourist"), async (req, res) => {
    const { serviceId, phone, date, guests, notes } = req.body || {};
    const adults = guests === "4+" ? 4 : Number(guests);
    const validDate = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);

    if (!serviceId || !phone?.trim() || !validDate || !Number.isInteger(adults) || adults < 1 || adults > 4) {
        return res.status(400).json({ error: "Invalid booking details" });
    }

    try {
        const connection = db.promise();
        const [providers] = await connection.execute(
            "SELECT id FROM service_providers WHERE slug = ? LIMIT 1",
            [serviceId]
        );
        if (!providers.length) return res.status(404).json({ error: "Service not found" });

        const [bookingResult] = await connection.execute(
            `INSERT INTO bookings
             (tourist_id, provider_id, booking_date, status, total_price, phone, num_adults, num_children, notes)
             VALUES (?, ?, ?, 'pending', 0, ?, ?, 0, ?)`,
            [req.user.id, providers[0].id, `${date} 00:00:00`, phone.trim(), adults, String(notes || "").trim()]
        );

        res.status(201).json({ bookingId: bookingResult.insertId, status: "pending" });
    } catch (err) {
        console.error("Failed to create booking:", err.message);
        res.status(500).json({ error: "Failed to create booking" });
    }
});

// جديد — يعرض الحجوزات الخاصة بالسائح المسجل فقط.
app.get("/api/bookings/my", requireAuth, requireRole("tourist"), async (req, res) => {
    try {
        const [bookings] = await db.promise().execute(
            `SELECT b.id, b.booking_date, b.status, b.phone, b.num_adults, b.notes,
                    p.slug AS service_id, p.business_name, p.category
             FROM bookings b JOIN service_providers p ON p.id = b.provider_id
             WHERE b.tourist_id = ? ORDER BY b.created_at DESC`,
            [req.user.id]
        );
        res.json(bookings);
    } catch (err) {
        console.error("Failed to fetch user bookings:", err.message);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// جديد — يعرض لمقدم الخدمة الطلبات الواردة إلى الجهة المرتبطة بحسابه فقط.
app.get("/api/provider/bookings", requireAuth, requireRole("provider"), async (req, res) => {
    try {
        const [bookings] = await db.promise().execute(
            `SELECT b.id, b.booking_date, b.status, b.phone, b.num_adults, b.notes,
                    u.full_name AS customer_name, u.email AS customer_email, p.business_name
             FROM bookings b JOIN users u ON u.id = b.tourist_id
             JOIN service_providers p ON p.id = b.provider_id
             WHERE p.user_id = ? ORDER BY b.created_at DESC`,
            [req.user.id]
        );
        res.json(bookings);
    } catch (err) {
        console.error("Failed to fetch provider bookings:", err.message);
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
});

// جديد — يقبل أو يرفض طلبًا معلقًا ويتأكد من ملكية الجهة قبل تغيير الحالة وإرسال البريد.
app.patch("/api/provider/bookings/:id/status", requireAuth, requireRole("provider"), async (req, res) => {
    const bookingId = Number(req.params.id);
    const status = req.body?.status;
    if (!Number.isInteger(bookingId) || bookingId < 1 || !["confirmed", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Status must be confirmed or rejected" });
    }
    try {
        const connection = db.promise();
        const [rows] = await connection.execute(
            `SELECT b.id, b.status, b.booking_date, u.full_name AS customer_name,
                    u.email AS customer_email, p.business_name
             FROM bookings b JOIN users u ON u.id = b.tourist_id
             JOIN service_providers p ON p.id = b.provider_id
             WHERE b.id = ? AND p.user_id = ? LIMIT 1`,
            [bookingId, req.user.id]
        );
        const booking = rows[0];
        if (!booking) return res.status(404).json({ error: "Booking not found" });
        if (booking.status !== "pending") return res.status(409).json({ error: "Booking is no longer pending" });
        const [update] = await connection.execute(
            "UPDATE bookings SET status = ? WHERE id = ? AND status = 'pending'",
            [status, bookingId]
        );
        if (!update.affectedRows) return res.status(409).json({ error: "Booking was already updated" });
        let emailSent = false;
        try {
            emailSent = await sendBookingStatusEmail({
                to: booking.customer_email,
                customerName: booking.customer_name,
                businessName: booking.business_name,
                status,
                bookingDate: String(booking.booking_date).slice(0, 10),
            });
        } catch (emailError) {
            console.error("Booking updated but email failed:", emailError.message);
        }
        res.json({ id: bookingId, status, emailSent });
    } catch (err) {
        console.error("Failed to update booking:", err.message);
        res.status(500).json({ error: "Failed to update booking" });
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
