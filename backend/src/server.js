const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/database");

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

// Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});