const Project = require("../models/Project");

const createProject = async (req, res, next) => {
  try {
    const { name, description, members = [] } = req.body;
    const project = await Project.create({
      name,
      description,
      members,
      createdBy: req.user._id,
    });
    const populated = await project.populate("members", "name email role");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const filter =
      req.user.role === "admin"
        ? {}
        : { $or: [{ members: req.user._id }, { createdBy: req.user._id }] };

    const projects = await Project.find(filter)
      .populate("members", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("members", "name email role")
      .populate("createdBy", "name email role");

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
