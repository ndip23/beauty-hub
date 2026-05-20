const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("../models/userModel");
const Salon = require("../models/salonModel");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const salons = [
  {
    user: {
      name: "Bernard Phiri",
      email: "bernard@gmail.com",
      password: "Bernard123!",
    },
    salon: {
      name: "MR BENAZ BARBERSHOP",
      slug: "mr-benaz-barbershop",
      phone: "260960408342", // 🚀 Updated: Fixed prefix for Zambia (260)
      businessType: "Barbershop",
      description: "Professional neighborhood barbershop offering clean haircuts, shaving, forehead cuts, and premium grooming services in Kitwe.",
      city: "Kitwe",
      country: "Zambia", // 🚀 Updated: Added country for location filtering
      address: "Junction Road, Ndeke Clinic, Kitwe",
      logo: "",
      coverImage: "",
      isVerified: true,
      socials: {
        instagram: "",
        facebook: "",
        whatsapp: "260960408342",
      },
    },
    services: [
      { name: "Full Haircut", category: "Haircut", description: "Clean professional adult haircut service.", price: 20, currency: "ZMW", duration: "45" },
      { name: "Shaving", category: "Grooming", description: "Professional shaving and beard grooming service.", price: 10, currency: "ZMW", duration: "20" },
      { name: "Forehead Cut", category: "Hairline", description: "Sharp forehead line cleanup and finishing.", price: 5, currency: "ZMW", duration: "10" },
      { name: "Super Black Application", category: "Hair Enhancement", description: "Professional super black hair enhancement application.", price: 40, currency: "ZMW", duration: "30" },
    ],
  },
  {
    user: {
      name: "Augustine Kalumba",
      email: "ogaba@gmail.com",
      password: "Ogaba123!",
    },
    salon: {
      name: "OGABA INVESTMENTS",
      slug: "ogaba-investments",
      phone: "260960279814", // 🚀 Updated: Fixed prefix for Zambia (260)
      businessType: "Barbershop",
      description: "Modern grooming and barber services offering quality haircuts, beard trimming, and forehead cutting services in Kitwe.",
      city: "Kitwe",
      country: "Zambia", // 🚀 Updated: Added country for location filtering
      address: "Behind MTN Kitwe, Off 11th Street, Nkana West",
      logo: "",
      coverImage: "",
      isVerified: true,
      socials: {
        instagram: "",
        facebook: "",
        whatsapp: "260960279814",
      },
    },
    services: [
      { name: "Barbing Only", category: "Haircut", description: "Professional barbing and haircut service.", price: 30, currency: "ZMW", duration: "45" },
      { name: "Beard Cutting", category: "Grooming", description: "Professional beard trimming and shaping.", price: 10, currency: "ZMW", duration: "20" },
      { name: "Forehead Cutting", category: "Hairline", description: "Clean forehead line cutting and finishing.", price: 10, currency: "ZMW", duration: "10" },
    ],
  },
  {
    user: {
      name: "Naomi Banda",
      email: "naomi@gmail.com",
      password: "Naomi123!",
    },
    salon: {
      name: "NANA'S BEAUTY",
      slug: "nanas-beauty",
      phone: "260974124959", // 🚀 Updated: Fixed prefix for Zambia (260)
      businessType: "Beauty Salon",
      description: "Professional beauty salon offering quality nail services and stylish hair plaiting in Lusaka.",
      city: "Lusaka",
      country: "Zambia", // 🚀 Updated: Added country for location filtering
      address: "Along Market Road, Mtendere, Lusaka",
      logo: "",
      coverImage: "",
      isVerified: true,
      socials: {
        instagram: "",
        facebook: "",
        whatsapp: "260974124959",
      },
    },
    services: [
      { name: "Nails", category: "Nails", description: "Professional nail care and beauty treatment services.", price: 50, currency: "ZMW", duration: "60" },
      { name: "Hair Plaiting - Small", category: "Hair", description: "Small-sized professional hair plaiting style.", price: 70, currency: "ZMW", duration: "120" },
      { name: "Hair Plaiting - Medium", category: "Hair", description: "Medium-sized professional hair plaiting style.", price: 100, currency: "ZMW", duration: "180" },
      { name: "Hair Plaiting - Large", category: "Hair", description: "Large-sized professional hair plaiting style.", price: 150, currency: "ZMW", duration: "240" },
    ],
  },
  {
    user: {
      name: "NKaine Petra Kehla",
      email: "nkainep@gmail.com",
      password: "Petra123!",
    },
    salon: {
      name: "Petra's Nailed It Boutique",
      slug: "petras-nailed-it-boutique",
      phone: "237653527017", // 🚀 Updated: Fixed prefix for Cameroon (237)
      businessType: "Beauty Salon",
      description: "Modern beauty boutique specializing in nails, lashes, pedicures, makeup, and premium beauty treatments in Bamenda.",
      city: "Bamenda",
      country: "Cameroon", // 🚀 Updated: Added country for location filtering
      address: "Mile 3, beside Elecam Building, Bamenda",
      logo: "",
      coverImage: "",
      isVerified: true,
      socials: {
        instagram: "",
        facebook: "",
        whatsapp: "237653527017",
      },
    },
    services: [
      { name: "Classic Gel Nails", category: "Nails", description: "Professional classic gel nail installation and styling.", price: 5000, currency: "XAF", duration: "90" },
      { name: "Acrylic Nails", category: "Nails", description: "Premium acrylic nail extension and beauty service.", price: 12000, currency: "XAF", duration: "120" },
      { name: "Pedicure", category: "Foot Care", description: "Relaxing professional pedicure and foot treatment.", price: 6000, currency: "XAF", duration: "60" },
      { name: "Manicure", category: "Hand Care", description: "Professional manicure and nail care treatment.", price: 4000, currency: "XAF", duration: "45" },
      { name: "Eyelash Installation", category: "Lashes", description: "Beautiful eyelash extension and enhancement service.", price: 8000, currency: "XAF", duration: "90" },
      { name: "Makeup Session", category: "Makeup", description: "Professional beauty makeup for events and occasions.", price: 10000, currency: "XAF", duration: "90" },
      { name: "Hair Retouch", category: "Hair", description: "Hair touch-up and simple beauty styling service.", price: 3500, currency: "XAF", duration: "45" },
    ],
  },
];

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found in server/.env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully...");

    for (const item of salons) {
      // 1. Check if user already exists
      let user = await User.findOne({
        email: item.user.email.toLowerCase(),
      });

      if (!user) {
        // Hash password securely (so they can actually log in)
        const passwordHash = await bcrypt.hash(item.user.password, 10);
        
        user = await User.create({
          name: item.user.name,
          email: item.user.email.toLowerCase(),
          password: passwordHash,
          role: "salon_owner", // Match your standard role name
          isVerified: true,
        });

        console.log(`User created: ${item.user.email}`);
      } else {
        console.log(`User already exists: ${item.user.email}`);
      }

      // 2. Check if salon already exists
      let salon = await Salon.findOne({
        slug: item.salon.slug,
      });

      // Map the services array directly into the Salon document
      const salonPayload = {
        ...item.salon,
        owner: user._id,
        services: item.services, // Embed services directly as subdocuments
      };

      if (!salon) {
        salon = await Salon.create(salonPayload);
        console.log(`Salon created: ${item.salon.name}`);
      } else {
        await Salon.findByIdAndUpdate(salon._id, { $set: salonPayload });
        console.log(`Salon updated: ${item.salon.name}`);
      }
    }

    console.log("🚀 Safe Salon Seeding completed successfully.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed salons:", err.message);
    process.exit(1);
  }
})();