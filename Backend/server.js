import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// 👇 frontend serve
app.use(express.static("public"));

app.use("/api/users", userRoutes);

// fallback
app.get("*", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
