"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("../database/db");
const organization_1 = __importDefault(require("../routes/organization"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const routesProtection_1 = __importDefault(require("../middlewares/routesProtection"));
const vendorOnboarding_routes_1 = __importDefault(require("../routes/vendorOnboarding.routes"));
const buyerOnboarding_routes_1 = __importDefault(require("../routes/buyerOnboarding.routes"));
dotenv_1.default.config({ path: ".env.local" });
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [process.env.BASE_URL],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use("/api/v1", userRoutes_1.default);
app.use("/api/v1", organization_1.default);
app.use("/api/v1", vendorOnboarding_routes_1.default);
app.use("/api/v1", buyerOnboarding_routes_1.default);
console.log("Starting server...");
// Health check route
app.get("/api/v1/health", routesProtection_1.default, (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
async function startServer() {
    try {
        await (0, db_1.initDB)();
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
