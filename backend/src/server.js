const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const { parsePreferences, generatePlan } = require("./planner/aiPlanner");

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

// Smart trip plan (LLM)
app.post("/api/plan", async (req, res) => {
    const preferences = parsePreferences(req.body);

    if (!preferences) {
        return res.status(400).json({
            error: "Invalid trip preferences"
        });
    }

    try {
        const plan = await generatePlan(preferences);
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
});