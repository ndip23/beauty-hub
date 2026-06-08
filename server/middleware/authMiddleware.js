// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 🌟 FIX: Stop the crash if token is actually the string "undefined" or "null"
      if (!token || token === "undefined" || token === "null") {
        res.status(401);
        throw new Error('Not authorized, token is missing or invalid');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

const optionalProtect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // 🌟 FIX: Check for "undefined" here too
      if (token && token !== "undefined" && token !== "null") {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
      }
    } catch (error) {
      console.error("Invalid token in optional auth");
    }
  }
  next();
});

module.exports = { protect, admin, optionalProtect };