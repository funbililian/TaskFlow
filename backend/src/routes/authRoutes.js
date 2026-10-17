
const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getMe", protect, getMe);
router.patch("/profile", protect, updateProfile);
// Optional conventional alias for the same profile endpoint
router.get("/me", protect, getMe);

module.exports = router;
