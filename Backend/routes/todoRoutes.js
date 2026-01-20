import express from "express";
import auth from "../middleware/auth.js";
import {
  getTodos,
  addTodo,
  deleteTodo
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", auth, getTodos);
router.post("/", auth, addTodo);
router.delete("/:id", auth, deleteTodo);

export default router;
