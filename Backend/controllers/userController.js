import User from "../models/User.js";

export const getUsers = async (req, res) => {
  res.json(await User.find());
};

export const addUser = async (req, res) => {
  res.json(await User.create(req.body));
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
