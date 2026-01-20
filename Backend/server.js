import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// ✅ STATIC FILES FIRST (VERY IMPORTANT)
app.use(express.static(path.join(__dirname, "public")));

// ✅ API ROUTES
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// ✅ ONLY ROOT SERVES HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
