

// middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const interactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "Too many actions, slow down",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many auth attempts, please try again later.",
});

module.exports = {
  interactionLimiter,
  authLimiter,
};
