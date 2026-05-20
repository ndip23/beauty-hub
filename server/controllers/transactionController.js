const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");

// @desc    Get logged-in owner's transaction history
// @route   GET /api/transactions/my-transactions
// @access  Private (Owner only)
const getMyTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Find transactions belonging to the logged-in user
  const count = await Transaction.countDocuments({ user: req.user._id });
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Newest first
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: transactions,
    page,
    pages: Math.ceil(count / limit),
    total: count
  });
});

module.exports = { getMyTransactions };