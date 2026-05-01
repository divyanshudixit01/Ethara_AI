const express = require("express");
const { body, param } = require("express-validator");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(
    authorize("admin"),
    [
      body("name").notEmpty().withMessage("Project name is required"),
      body("description").optional().isString(),
      body("members").optional().isArray(),
    ],
    validateRequest,
    createProject
  );

router
  .route("/:id")
  .put(
    authorize("admin"),
    [param("id").isMongoId().withMessage("Invalid project ID")],
    validateRequest,
    updateProject
  )
  .delete(
    authorize("admin"),
    [param("id").isMongoId().withMessage("Invalid project ID")],
    validateRequest,
    deleteProject
  );

module.exports = router;
