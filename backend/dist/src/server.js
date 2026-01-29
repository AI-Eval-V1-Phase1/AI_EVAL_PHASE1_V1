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
const userRoutes_1 = __importDefault(require("../routes/user_management/userRoutes"));
dotenv_1.default.config({ path: ".env.local" });
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
}));
console.log("Starting server...");
// Health check route
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});
async function startServer() {
    try {
        await (0, db_1.initDB)();
        // ✅ Add leading slash here
        app.use('/api/v1', userRoutes_1.default);
        app.use("/api/v1", organization_1.default);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Server failed:", err.message);
    }
}
startServer();
