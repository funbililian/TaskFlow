
const mongoose = require("mongoose");

const taskItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const taskListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    tasks: {
      type: [taskItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskList", taskListSchema);
