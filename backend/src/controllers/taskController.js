
const TaskList = require("../models/TaskList");

const getTasks = async (req, res) => {
  try {
    const taskList = await TaskList.findOne({ user: req.user._id });

    return res.status(200).json({
      success: true,
      tasks: taskList ? taskList.tasks : [],
    });
  } catch (error) {
    console.error("Get tasks error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve tasks.",
    });
  }
};

const saveTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "Tasks must be provided as an array.",
      });
    }

    if (tasks.length > 500) {
      return res.status(400).json({
        success: false,
        message: "You cannot save more than 500 tasks.",
      });
    }

    const seenIds = new Set();
    const cleanTasks = [];

    for (const task of tasks) {
      if (
        !task ||
        !Number.isSafeInteger(task.id) ||
        task.id < 0 ||
        typeof task.title !== "string" ||
        !task.title.trim() ||
        task.title.trim().length > 120 ||
        typeof task.completed !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          message: "One or more tasks contain invalid fields.",
        });
      }

      if (seenIds.has(task.id)) {
        return res.status(400).json({
          success: false,
          message: "Task IDs must be unique.",
        });
      }

      seenIds.add(task.id);

      const priority = task.priority ?? "Medium";

      if (!["Low", "Medium", "High"].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Task priority must be Low, Medium, or High.",
        });
      }

      const dueDate = task.dueDate ?? "";

      if (
        typeof dueDate !== "string" ||
        (dueDate !== "" &&
          !/^\d{4}-\d{2}-\d{2}$/.test(dueDate))
      ) {
        return res.status(400).json({
          success: false,
          message: "Task due date must use YYYY-MM-DD format.",
        });
      }

      cleanTasks.push({
        id: task.id,
        title: task.title.trim(),
        completed: task.completed,
        priority,
        dueDate,
      });
    }

    const taskList = await TaskList.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          user: req.user._id,
          tasks: cleanTasks,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Tasks saved successfully.",
      tasks: taskList.tasks,
    });
  } catch (error) {
    console.error("Save tasks error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to save tasks.",
    });
  }
};

module.exports = { getTasks, saveTasks };
