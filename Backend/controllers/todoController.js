import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });
  res.json(todos);
};

export const addTodo = async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    user: req.user.id
  });
  res.json(todo);
};

export const deleteTodo = async (req, res) => {
  await Todo.deleteOne({
    _id: req.params.id,
    user: req.user.id
  });
  res.json({ success: true });
};
