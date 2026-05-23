// server/controllers/userController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const sendVerificationEmail = require("../utils/emailService");

const getFrontendBaseUrl = () =>
  (process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000").trim();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new account and sends a verification email.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sarah Johnson
 *               email:
 *                 type: string
 *                 example: sarah@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               phone:
 *                 type: string
 *                 example: +2348100000000
 *               role:
 *                 type: string
 *                 enum: [customer, salon_owner]
 *                 example: customer
 *     responses:
 *       201:
 *         description: Registration successful, email sent for verification
 *       400:
 *         description: Missing fields or user already exists
 */

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password)
    return res
      .status(400)
      .json({ message: "Name, email & password are required" });

  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiry = Date.now() + 1000 * 60 * 60;

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || "customer",
    verificationToken,
    verificationTokenExpires: tokenExpiry,
  });

  const link = `${getFrontendBaseUrl()}/verify-email/${verificationToken}`;
  await sendVerificationEmail(user.email, link);

  res.status(201).json({
    message: "Registration successful. Check email to verify.",
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });
});

/**
 * @swagger
 * /api/verify/{token}:
 *   get:
 *     summary: Verify email address
 *     description: Confirms user email using token sent to their inbox.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully" });
});

/**
 * @swagger
 * /api/verify/resend:
 *   post:
 *     summary: Resend email verification link
 *     description: Generates a fresh token and emails it to the user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: sarah@example.com
 *     responses:
 *       200:
 *         description: Verification email resent
 *       400:
 *         description: Email already verified
 *       404:
 *         description: User not found
 */

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Email already verified" });

  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpires = Date.now() + 1000 * 60 * 60;
  await user.save();

  const link = `${getFrontendBaseUrl()}/verify-email/${token}`;
  await sendVerificationEmail(user.email, link);

  res.json({ message: "Verification email resent" });
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate user (Login)
 *     description: Logs in a user and returns JWT token for subsequent authenticated requests.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAuthResponse'
 *       401:
 *         description: Invalid email or password
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     description: Update name and/or password. Requires valid JWT.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sarah J."
 *               password:
 *                 type: string
 *                 format: password
 *                 description: New password (will be hashed automatically)
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAuthResponse'
 *       404:
 *         description: User not found
 *       401:
 *         description: Not authorized
 */
// @desc    Update / Get logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    let tokenUpdated = false;
    if (req.body.password) {
      user.password = req.body.password; // pre-save hook hashes it
      tokenUpdated = true;
    }

    const updatedUser = await user.save();

    // Prepare response payload
    const responsePayload = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      walletBalance: updatedUser.walletBalance || 0, // 🚀 Syncs the wallet
      isVerified: updatedUser.isVerified || false,
    };

    // Only generate a new token if the password was changed
    if (tokenUpdated) {
      responsePayload.token = generateToken(updatedUser._id);
    } else {
      // Keep using their existing token passed in the request header
      responsePayload.token = req.headers.authorization.split(" ")[1];
    }

    res.json(responsePayload);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      walletBalance: user.walletBalance || 0, // 🚀 Syncs the wallet
      isVerified: user.isVerified || false,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
// @desc    Request password reset link
// @route   POST /api/users/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json({ message: "If that email exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
  await user.save();

  const resetLink = `${getFrontendBaseUrl()}/reset-password/${token}`;
  await sendVerificationEmail(user.email, resetLink, {
    subject: "Reset your password",
    title: "Password Reset",
    message: "Click below to reset your password:",
    buttonText: "Reset Password",
  });

  res.json({ message: "If that email exists, a reset link has been sent." });
});

// @desc    Reset password using token
// @route   PUT /api/users/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("New password is required");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password has been reset successfully." });
});

module.exports = {
  registerUser,
  authUser,
  updateUserProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getUserProfile,
};
