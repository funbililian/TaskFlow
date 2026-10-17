
const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getTasks,
  saveTasks,
} = require("../controllers/taskController");

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.put("/", saveTasks);

module.exports = router;
