const asyncHandler = require("express-async-handler");
const Subscription = require("../models/subscriptionModel");
const User = require("../models/userModel");
const Salon = require("../models/salonModel");
const Appointment = require("../models/appointmentModel");
const Payment = require("../models/paymentModel");
const SubscriptionType = require("../models/subscriptionTypeModel");
const Transaction = require("../models/transactionModel");
const sendEmail = require('../utils/emailService');
const bcrypt = require("bcryptjs");
/**
 * @desc    Get Real System Stats for Overview Page
 */
const getSystemStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalSalons, totalAppointments] = await Promise.all([
    User.countDocuments(),
    Salon.countDocuments(),
    Appointment.countDocuments(),
  ]);

  const payments = await Payment.find({ status: { $in: ["PAID", "Completed"] } });
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  const recentUsers = await User.find().sort("-createdAt").limit(3);
  const recentSubs = await Subscription.find().populate('user', 'name').sort("-createdAt").limit(2);

  const activity = [
    ...recentUsers.map(u => ({ message: `New Registration: ${u.name}`, time: u.createdAt })),
    ...recentSubs.map(s => ({ message: `Subscribed: ${s.user?.name}`, time: s.createdAt }))
  ].sort((a,b) => b.time - a.time);

  res.json({
    totalUsers,
    totalSalons,
    totalAppointments,
    totalRevenue,
    growth: 0,
    recentActivity: activity
  });
});

/**
 * @desc    Get All Users for Management Page
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // 1. Get all users
  const users = await User.find({}).sort("-createdAt").select("-password").lean();

  // 2. For each user, check if they have an 'Active' subscription
  const usersWithAccessStatus = await Promise.all(
    users.map(async (user) => {
      const activeSub = await Subscription.findOne({ 
        user: user._id, 
        status: "Active" 
      });
      
      return {
        ...user,
        // We add this field so the frontend knows exactly what to show
        accessStatus: activeSub ? "LIVE" : "PENDING"
      };
    })
  );

  res.json(usersWithAccessStatus);
});

/**
 * @desc    Get All Salons (NEW - Was missing)
 */
const getAllSalons = asyncHandler(async (req, res) => {
  const salons = await Salon.find({}).populate("owner", "name email").sort("-createdAt");
  res.json(salons);
});

/**
 * @desc    Get All Appointments (NEW - Was missing)
 */
const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("customer", "name email")
    .populate("salon", "name")
    .sort("-createdAt");
  res.json(appointments);
});

/**
 * @desc    Manual Bypass Activation
 */
const manualActivateSubscription = asyncHandler(async (req, res) => {
  const { userId, planId, durationMonths, note } = req.body;

  const plan = await SubscriptionType.findById(planId);
  if (!plan) { res.status(400); throw new Error("Invalid Plan ID"); }

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + (Number(durationMonths) || 1));

  const subscription = await Subscription.findOneAndUpdate(
    { user: userId },
    {
      plan: planId,
      status: "Active",
      startDate: new Date(),
      endDate,
      isManualOverride: true,
      activatedBy: req.user._id,
      overrideNote: note || "Admin Override"
    },
    { upsert: true, new: true }
  );

  // 🚀 RESTORE VISIBILITY: Re-verify the user and the salon
  await User.findByIdAndUpdate(userId, { isVerified: true });
  await Salon.findOneAndUpdate({ owner: userId }, { isVerified: true });

  res.status(200).json({ success: true, message: "Manual access granted and Salon listed", data: subscription });
});

/**
 * @desc    Get Subscription Overview for the Control Panel
 */
const getSystemOverview = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find({})
        .populate("user", "name email phone")
        .populate("plan", "planName amount")
        .sort("-createdAt");
    res.json(subscriptions);
});

// @desc    Restrict or Suspend user access immediately
const restrictUserAccess = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // 1. Suspend the subscription
  const subscription = await Subscription.findOneAndUpdate(
    { user: userId },
    { status: "Suspended" },
    { new: true }
  );

  // 2. Un-verify the user
  await User.findByIdAndUpdate(userId, { isVerified: false });

  // 3. 🚀 CRITICAL: Un-verify the salon so it disappears from the directory
  await Salon.findOneAndUpdate({ owner: userId }, { isVerified: false });

  res.json({
    success: true,
    message: "User access restricted and salon unlisted",
    data: subscription,
  });
});
// @desc    Admin manually sets a new password for a user
// @route   PUT /api/admin/reset-password
const resetUserPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Set the password as plain text
  // The 'pre-save' hook in your User model will automatically hash this 
  user.password = newPassword; 
  
  await user.save();

  res.status(200).json({ 
    success: true, 
    message: `Password updated for ${user.name}` 
  });
});
// @desc    Get All Financial Transactions for Admin
// @route   GET /api/admin/transactions
// @access  Private (Admin Only)
const getAllSystemTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const count = await Transaction.countDocuments({});
  // We find all transactions, newest first, and populate the owner's name/email
  const transactions = await Transaction.find({})
    .populate("user", "name email phone")
    .sort({ createdAt: -1 })
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

module.exports = {
  getSystemStats,
  getAllUsers,
  getAllSalons,      // Added
  getAllAppointments, // Added
  getSystemOverview,
  manualActivateSubscription,
  restrictUserAccess,
  resetUserPassword,
  getAllSystemTransactions
};
