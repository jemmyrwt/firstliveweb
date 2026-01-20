import express from "express";
import auth from "../middleware/auth.js";
import {
  getTodos,
  addTodo,
  deleteTodo
} from "../controllers/todoController.js";

const router = express.Router();

// ✅ GET all todos (only logged-in user)
router.get("/", auth, getTodos);

// ✅ ADD new todo
router.post("/", auth, addTodo);

// ✅ DELETE todo (only own todo)
router.delete("/:id", auth, deleteTodo);

export default router;
