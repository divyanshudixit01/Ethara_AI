const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Allow any authenticated user to get the users list for task assignment
router.get("/", protect, getUsers);

module.exports = router;
