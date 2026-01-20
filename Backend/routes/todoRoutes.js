import express from "express";
import auth from "../middleware/auth.js";
import Todo from "../models/Todo.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
});

router.post("/", auth, async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id
  });
  res.json(todo);
});

router.delete("/:id", auth, async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ success: true });
});

export default router;
