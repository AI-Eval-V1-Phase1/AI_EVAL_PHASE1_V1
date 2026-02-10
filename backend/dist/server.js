import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./database/db.js";
import orgrouter from "./routes/organization.routes.js";
import userRoutes from "./routes/userRoutes.routes.js";
import vendorRoutes from "./routes/vendorOnboarding.routes.js";
import vendorSelfAttestationRoutes from "./routes/vendorSelfAttestation.routes.js";
import attestationRoutes from "./routes/attestation.routes.js";
import buyerRoutes from "./routes/buyerOnboarding.routes.js";
import assessmentRoutes from "./routes/assessment.routes.js";
import lookupRoutes from "./routes/lookup.routes.js";
import healthRoute from "./routes/health.routes.js";
dotenv.config({ path: ".env.local" });
const PORT = process.env.PORT || 5003;
const app = express();
const allowedOrigins = [process.env.BASE_URL].filter(Boolean);
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
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
}));
// Allow larger request bodies (default is ~100kb; Buyer COTS and other forms can exceed this)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Preflight: respond to OPTIONS for any /api/v1 path with 204 (CORS headers set by cors() above)
app.use("/api/v1", (req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }
    next();
});
app.use("/api/v1", [
    userRoutes,
    orgrouter,
    vendorRoutes,
    vendorSelfAttestationRoutes,
    attestationRoutes,
    buyerRoutes,
    assessmentRoutes,
    lookupRoutes,
    healthRoute
]);
console.log("Starting server...");
try {
    //** Calling database function
    await initDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
catch (err) {
    console.error("Server failed:", err.message);
}
