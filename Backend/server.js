import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

// routes
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();

// DB connect
connectDB();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// frontend (HTML / React build / public)
app.use(express.static("public"));

// APIs
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// fallback (important for refresh)
app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
