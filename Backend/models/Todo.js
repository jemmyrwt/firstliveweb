import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: String,
    prio: String,
    cat: String,
    date: String,
    done: Boolean,

    // 🔑 kis user ka todo
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
