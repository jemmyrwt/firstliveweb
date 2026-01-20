import express from "express";
import auth from "../middleware/auth.js";
import Todo from "../models/Todo.js";

const router = express.Router();

// GET todos
router.get("/", auth, async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
});

// ADD todo
router.post("/", auth, async (req, res) => {
  const todo = await Todo.create({
    ...req.body,
    done: false,
    user: req.user.id
  });
  res.json(todo);
});

// TOGGLE done
router.patch("/:id", auth, async (req, res) => {
  const todo = await Todo.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
});

// DELETE
router.delete("/:id", auth, async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ success: true });
});

export default router;
