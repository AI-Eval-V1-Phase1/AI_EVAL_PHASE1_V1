import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "../database/db.js";
import orgrouter from "../routes/organization.js";
import userRoutes from "../routes/userRoutes.js";
import authenticateToken from "../middlewares/routesProtection.js";
import vendorRoutes from "../routes/vendorOnboarding.routes.js";
import buyerRoutes from "../routes/buyerOnboarding.routes.js";
dotenv.config({ path: ".env.local" });
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const allowedOrigins = [
    process.env.BASE_URL,
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
].filter(Boolean);
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        }
        else {
            cb(null, true);
        }
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use("/api/v1", userRoutes);
app.use("/api/v1", orgrouter);
app.use("/api/v1", vendorRoutes);
app.use("/api/v1", buyerRoutes);
console.log("Starting server...");
// Health check route
app.get("/api/v1/health", authenticateToken, (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
async function startServer() {
    try {
        await initDB();
        // ✅ Add leading slash here
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Server failed:", err.message);
    }
}
startServer();
