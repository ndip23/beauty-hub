// server/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  updateUserProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

// When a POST request comes to '/', use the registerUser controller
router.route("/").post(authLimiter, registerUser);

// When a POST request comes to '/login', use the authUser controller
router.post("/login", authLimiter, authUser);
router.route("/profile")
  .get(protect, getUserProfile) // GET profile details
  .put(protect, updateUserProfile);
router.get("/verify/:token", verifyEmail);
router.post("/verify/resend", authLimiter, resendVerification);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", authLimiter, resetPassword);
module.exports = router;
