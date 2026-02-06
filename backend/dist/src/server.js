import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "../database/db.js";
import orgrouter from "../routes/organization.js";
import userRoutes from "../routes/userRoutes.js";
import authenticateToken from "../middlewares/routesProtection.js";
import vendorRoutes from "../routes/vendorOnboarding.routes.js";
import vendorSelfAttestationRoutes from "../routes/vendorSelfAttestation.routes.js";
import buyerRoutes from "../routes/buyerOnboarding.routes.js";
import assessmentRoutes from "../routes/assessment.routes.js";
dotenv.config({ path: ".env.local" });
const PORT = process.env.PORT || 5003;
const app = express();
const allowedOrigins = [
    process.env.BASE_URL,
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
].filter(Boolean);
// CORS first so preflight (OPTIONS) always gets correct headers
app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        }
        else {
            cb(null, true);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
}));
// Allow larger request bodies (default is ~100kb; Buyer COTS and other forms can exceed this)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Explicit preflight handler for vendorSelfAttestation so OPTIONS returns 204 with CORS headers
app.options("/api/v1/vendorSelfAttestation", (_, res) => {
    res.status(204).end();
});
app.use("/api/v1", userRoutes);
app.use("/api/v1", orgrouter);
app.use("/api/v1", vendorRoutes);
app.use("/api/v1", vendorSelfAttestationRoutes);
app.use("/api/v1", buyerRoutes);
app.use("/api/v1", assessmentRoutes);
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
