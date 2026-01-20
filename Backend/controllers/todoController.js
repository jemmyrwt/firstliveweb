import Todo from "../models/Todo.js";

/* GET ALL TODOS (user-wise) */
export const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
};

/* ADD TODO */
export const addTodo = async (req, res) => {
  const { title, prio, cat, date } = req.body;

  const todo = await Todo.create({
    title,
    prio,
    cat,
    date,
    done: false,
    user: req.user.id
  });

  res.json(todo);
};

/* TOGGLE DONE */
export const toggleTodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
  todo.done = !todo.done;
  await todo.save();
  res.json(todo);
};

/* DELETE */
export const deleteTodo = async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id, user: req.user.id });
  res.json({ success: true });
};
