import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// ADD user
router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// DELETE user
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

export default router;
