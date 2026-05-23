// server/models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAuthResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [customer, salon_owner]
 *         token:
 *           type: string
 *           description: JWT Bearer token
 *       example:
 *         _id: "66789abc123def456789abcd"
 *         name: "Sarah Johnson"
 *         email: "sarah@example.com"
 *         role: "customer"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x..."
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [customer, salon_owner]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: String,
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["customer", "salon_owner", "admin"], // The role must be one of these values
      default: "customer",
    },
    walletBalance: {
      type: Number,
      default: 0,
      set: (v) => Number(v),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// This Mongoose middleware runs BEFORE a user is saved to the database
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// A method to compare entered password with the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
