const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

(async () => {
  try {
    console.log("Starting subscription plan seeding...");

    // 1️⃣ CONNECT TO MONGODB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // 2️⃣ REQUIRE MODELS
    const User = require("../models/userModel");
    const SubscriptionType = require("../models/subscriptionTypeModel");

    // 3️⃣ FIND ADMIN USER
    let admin = await User.findOne({ role: "admin" });

    // If no admin exists, create one
    if (!admin) {
      console.log("No admin found. Creating admin user...");

      const bcrypt = require("bcryptjs");
      const password = await bcrypt.hash("123456", 10);

      admin = await User.create({
        name: "Beautyhub Admin",
        email: "admin@Beautyhub.com",
        phone: "000",
        password,
        role: "admin",
        isVerified: true,
      });

      console.log("Admin user created");
    }

    // 4️⃣ CLEAR ONLY SUBSCRIPTION PLANS
    console.log("Clearing old subscription plans...");
    await SubscriptionType.deleteMany();

    // 5️⃣ INSERT NEW PLANS
    console.log("Creating subscription plans...");

    await SubscriptionType.insertMany([
      {
        planName: "Basic",
        slug: "basic-plan",
        amount: 5,
        currency: "USD",
        durationMonths: 1,
        createdBy: admin._id,
        planSpecs: [
          "List up to 5 services",
          "WhatsApp Integration",
          "Basic Business Profile",
          "Appear in search results",
        ],
      },
      {
        planName: "Pro",
        slug: "pro-plan",
        amount: 30,
        currency: "USD",
        durationMonths: 1,
        createdBy: admin._id,
        planSpecs: [
          "Unlimited service listings",
          "Priority Featured placement",
          "Advanced Analytics dashboard",
          "WhatsApp & Direct Booking",
          "Verified Business Badge",
        ],
      },
    ]);

    console.log("Subscription plans seeded successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
})();