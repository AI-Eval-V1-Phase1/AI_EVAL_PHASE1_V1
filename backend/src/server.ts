import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "../database/db";
import orgrouter from "../routes/organization";
import userRoutes from "../routes/userRoutes";
import authenticateToken from "../middlewares/routesProtection";
import vendorRoutes from "../routes/vendorOnboarding.routes";
import buyerRoutes from "../routes/buyerOnboarding.routes";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [process.env.BASE_URL],
    methods: "GET,POST,PUT,DELETE",
     allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

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
  } catch (err: any) {
    console.error("Server failed:", err.message);
  }
}

startServer();
