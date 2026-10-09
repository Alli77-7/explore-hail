const express = require("express");
const cors = require("cors");
const db = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "running",
        service: "Explore Hail Backend"
    });
});

app.get("/api/attractions", (req, res) => {
    db.query("SELECT * FROM attractions", (err, results) => {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});