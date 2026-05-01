const express = require("express");
const { getUsers } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers);

module.exports = router;
