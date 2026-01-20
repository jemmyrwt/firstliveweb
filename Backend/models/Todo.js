import mongoose from "mongoose";

export default mongoose.model(
  "Todo",
  new mongoose.Schema({
    text: String
  })
);
