const Task = require("../models/Task");
const Project = require("../models/Project");

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, projectId, dueDate, status } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      status: status || "todo",
      createdBy: req.user._id,
    });

    const populated = await task
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: cannot update this task" });
    }

    const updated = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description")
      .populate("createdBy", "name email role");

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "admin" && String(task.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: cannot update this task" });
    }

    task.status = status;
    await task.save();

    const populated = await task
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description")
      .populate("createdBy", "name email role");
    res.status(200).json(populated);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
