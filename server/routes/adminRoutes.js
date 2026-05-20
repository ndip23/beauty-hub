const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { 
  getSystemStats, 
  getAllSalons, 
  getAllAppointments, 
  getAllUsers,
  getSystemOverview,
  manualActivateSubscription,
  restrictUserAccess,
  resetUserPassword,
  getAllSystemTransactions

} = require("../controllers/adminController");

router.get("/stats", protect, admin, getSystemStats);
router.get("/salons", protect, admin, getAllSalons);
router.get("/appointments", protect, admin, getAllAppointments);
router.get("/users", protect, admin, getAllUsers);
router.get("/overview", protect, admin, getSystemOverview);
router.post("/manual-activate", protect, admin, manualActivateSubscription);
router.put("/restrict-access/:userId", protect, admin, restrictUserAccess);
router.put("/reset-password", protect, admin, resetUserPassword);
router.get("/transactions", protect, admin, getAllSystemTransactions);

module.exports = router;