import auth from "../middleware/auth.js";

router.get("/", auth, getTodos);
router.post("/", auth, addTodo);
router.delete("/:id", auth, deleteTodo);
