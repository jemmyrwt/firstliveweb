import Todo from "../models/Todo.js";

// GET
export const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
};

// POST
export const addTodo = async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id
  });
  res.json(todo);
};

// DELETE
export const deleteTodo = async (req, res) => {
  await Todo.deleteOne({
    _id: req.params.id,
    user: req.user.id
  });
  res.json({ success: true });
};
