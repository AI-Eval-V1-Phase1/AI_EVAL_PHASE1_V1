import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "../database/db";
import orgrouter from "../routes/organization";
import userRoutes from "../routes/user_management/userRoutes";

dotenv.config({ path: ".env.local" });

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);

console.log("Starting server...");

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    await initDB();

    // ✅ Add leading slash here
    app.use('/api/v1', userRoutes);
    app.use("/api/v1",orgrouter);


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err: any) {
    console.error("Server failed:", err.message);
  }
}

startServer();
