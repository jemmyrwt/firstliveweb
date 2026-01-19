import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import User from "./models/User.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // 👈 HTML serve karega

// FORM SUBMIT
app.post("/add-user", async (req, res) => {
  const { name, email } = req.body;
  await User.create({ name, email });
  res.redirect("/"); // wapas page par
});

// DATA FETCH
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Server running 🚀")
);
