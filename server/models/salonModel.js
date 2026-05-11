// const mongoose = require("mongoose");

// const serviceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number, required: true },
//   currency: { type: String, default: "XAF" },
//   duration: { type: String }, 
//   photos: { type: [String], default: [] },
//   homeService: { type: Boolean, default: false },
//   homeServiceFee: { type: Number, default: 0 },
// });

// const salonSchema = new mongoose.Schema(
//   {
//     owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
//     name: { type: String, required: true },
//     slug: { type: String, unique: true }, 
//     description: { type: String, required: true },
//     currency: {
//       type: String,
//       default: "XAF",
//       enum: ["XAF", "XOF", "NGN", "GHS", "USD", "KES", "TZS", "UGX", "ZMW", "INR"],
//     },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     phone: { type: String, required: true },
//     photos: [{ type: String }],
//     openingHours: {
//       monday: String, tuesday: String, wednesday: String, thursday: String, 
//       friday: String, saturday: String, sunday: String,
//     },
//     services: [serviceSchema], 
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//     averageRating: { type: Number, default: 0 },
//     isVerified: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// // --- 🚀 PRODUCTION DATABASE INDEXES (Boss's Requirement #3) ---
// // This prevents MongoDB from scanning every file; it creates a "Map" for the data.
// salonSchema.index({ slug: 1 });
// salonSchema.index({ city: 1 });
// salonSchema.index({ isVerified: 1 });
// salonSchema.index({ averageRating: -1 }); // For sorting by top-rated
// salonSchema.index({ createdAt: -1 });    // For sorting by newest

// // --- AUTO-GENERATE SLUG BEFORE SAVING ---
// salonSchema.pre("save", function (next) {
//   if (this.isModified("name")) {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^\w ]+/g, "") 
//       .replace(/ +/g, "-");    
//   }
//   next();
// });

// module.exports = mongoose.model("Salon", salonSchema);


















const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: "XAF" },
  duration: { type: String },
  photos: { type: [String], default: [] },
  homeService: { type: Boolean, default: false },
  homeServiceFee: { type: Number, default: 0 },
});

// ==================== NEW: PRODUCT SCHEMA ====================
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: "XAF" },
  stock: { type: Number, default: 0, min: 0 },          
  sku: { type: String, unique: false, sparse: true },   
  category: { 
    type: String,
    enum: ["haircare", "skincare", "tools", "makeup", "accessories", "other"],
    default: "other"
  },
  photos: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },          
}, { timestamps: true });

// ==================== SALON SCHEMA ====================
const salonSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    currency: {
      type: String,
      default: "XAF",
      enum: ["XAF", "XOF", "NGN", "GHS", "USD", "KES", "TZS", "UGX", "ZMW", "INR"],
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    photos: [{ type: String }],

    openingHours: {
      monday: String, tuesday: String, wednesday: String, thursday: String,
      friday: String, saturday: String, sunday: String,
    },

    services: [serviceSchema],
    products: [productSchema],        // ← New field

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    averageRating: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- PRODUCTION INDEXES ---
salonSchema.index({ slug: 1 });
salonSchema.index({ city: 1 });
salonSchema.index({ isVerified: 1 });
salonSchema.index({ averageRating: -1 });
salonSchema.index({ createdAt: -1 });

// Optional: Index for product searches
salonSchema.index({ "products.name": "text", "products.description": "text" });

// --- AUTO-GENERATE SLUG ---
salonSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

module.exports = mongoose.model("Salon", salonSchema);

