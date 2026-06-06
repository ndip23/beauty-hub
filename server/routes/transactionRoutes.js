const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMyTransactions } = require("../controllers/transactionController");
const {
  generateReceiptPdf,
  generateInvoicePdf,
  verifyTransactionRecord,
} = require("../controllers/receiptController");

// Protected route (Only logged-in salon owners can call this)
router.get("/my-transactions", protect, getMyTransactions);
router.get("/:id/verify", verifyTransactionRecord);
router.get("/:id/receipt", protect, generateReceiptPdf);
router.get("/:id/invoice", protect, generateInvoicePdf);

module.exports = router;
