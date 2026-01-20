import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

// 🔹 fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DB connect
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// APIs
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// ✅ SPA fallback (VERY IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 Server running on port", PORT);
});
