const express = require("express");
const { body, param } = require("express-validator");
const {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTasks)
  .post(
    [
      body("title").notEmpty().withMessage("Task title is required"),
      body("assignedTo").isMongoId().withMessage("Valid assignee is required"),
      body("projectId").isMongoId().withMessage("Valid project is required"),
      body("dueDate").isISO8601().withMessage("Valid due date is required"),
      body("status").optional().isIn(["todo", "in-progress", "done"]),
    ],
    validateRequest,
    createTask
  );

router
  .route("/:id")
  .put(
    [
      param("id").isMongoId().withMessage("Invalid task ID"),
      body("status").optional().isIn(["todo", "in-progress", "done"]),
    ],
    validateRequest,
    updateTask
  )
  .delete(
    authorize("admin"),
    [param("id").isMongoId().withMessage("Invalid task ID")],
    validateRequest,
    deleteTask
  );

router.patch(
  "/:id/status",
  [
    param("id").isMongoId().withMessage("Invalid task ID"),
    body("status")
      .isIn(["todo", "in-progress", "done"])
      .withMessage("Status must be todo, in-progress, or done"),
  ],
  validateRequest,
  updateTaskStatus
);

module.exports = router;
