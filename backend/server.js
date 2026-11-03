
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

// Home API
app.get("/", (req, res) => {
    res.send("CoFounder Connect Backend is Running!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working successfully!"
    });
});

// Test MySQL connection
app.get("/api/test-db", async (req, res) => {
    try {
        const [result] = await db.query("SELECT 1 AS connected");

        res.json({
            message: "MySQL connected successfully!",
            result
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Founder profile routes
app.use("/api/profile", profileRoutes);

// Protected test API
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({
        message: "You accessed a protected API!",
        user: req.user
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
