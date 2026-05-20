const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyTransactions } = require("../controllers/transactionController");

// Protected route (Only logged-in salon owners can call this)
router.get("/my-transactions", protect, getMyTransactions);

module.exports = router;