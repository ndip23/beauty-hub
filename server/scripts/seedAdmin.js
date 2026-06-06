const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const DEFAULT_ADMIN = {
  name: "Beautyhub Admin",
  email: "admin@Beautyhub.local",
  password: "Admin123!",
};

const shouldResetPassword = () =>
  String(process.env.ADMIN_SEED_RESET_PASSWORD || "").toLowerCase() === "true";

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in server/.env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const name = process.env.ADMIN_SEED_NAME || DEFAULT_ADMIN.name;
    const email = (process.env.ADMIN_SEED_EMAIL || DEFAULT_ADMIN.email)
      .trim()
      .toLowerCase();
    const password = process.env.ADMIN_SEED_PASSWORD || DEFAULT_ADMIN.password;

    const existing = await User.findOne({ email });

    if (existing) {
      let updated = false;
      if (existing.role !== "admin") {
        existing.role = "admin";
        updated = true;
      }
      if (!existing.isVerified) {
        existing.isVerified = true;
        updated = true;
      }
      if (shouldResetPassword()) {
        existing.password = password;
        updated = true;
      }
      if (updated) {
        await existing.save();
      }

      console.log("Admin already exists.");
      console.log(`Email: ${existing.email}`);
      if (shouldResetPassword()) {
        console.log("Password reset via ADMIN_SEED_RESET_PASSWORD=true");
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    await User.create({
      name,
      email,
      password,
      role: "admin",
      isVerified: true,
    });

    console.log("Default admin created.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err.message);
    process.exit(1);
  }
})();
