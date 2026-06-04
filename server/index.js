// server/index.js
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const compression = require("compression");   // ← Added for faster responses
const connectDB = require("./config/db");
const morgan = require("morgan")
const subscriptionTypeRoutes = require("./routes/subscriptionTypeRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes.js");
const userRoutes = require("./routes/userRoutes");
const salonRoutes = require("./routes/salonRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes.js");
const adminRoutes = require("./routes/adminRoutes");
const videoRoutes = require("./routes/videoRoute.js");
const transactionRoutes = require("./routes/transactionRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Swagger
const swaggerSpec = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");

dotenv.config({ path: path.resolve(__dirname, ".env"), quiet: true });
dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const app = express();

// ====================== MIDDLEWARE ======================

// 1. Compression - Reduces response size (very important for images & JSON)
app.use(compression());

// 2. CORS - Updated to include bookerbeauty.com
app.use(cors({
  origin: [
    "https://bookerbeauty.com",
    "https://www.bookerbeauty.com",
    "https://www.mybeautyheaven.site",
    "https://mybeautyheaven.site",
    "https://beauty-hub-coral.vercel.app",
    "http://localhost:3000",
  ],
  credentials: true
}));

app.use(express.json());

// 3. Static Files + Strong Image Caching (This is the biggest image fix)
const staticOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
  etag: true,
  lastModified: true,
  immutable: true,                    // Best for images and static assets
  
  setHeaders: (res, filePath) => {
    // Stronger caching specifically for images
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
};

// Serve uploaded images (Most important for your salons)
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), staticOptions));

// Serve any static images in public folder (if you have default images)
app.use('/images', express.static(path.join(__dirname, '../public/images'), staticOptions));



// ====================== ROUTES ======================

// Swagger Documentation
app.use(morgan("dev"))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Root route
app.get("/", (req, res) => {
  res.send(`
    <h1>BeautyHeaven API is running!</h1>
    <p><a href="/api-docs" target="_blank">📚 Open API Documentation (Swagger UI)</a></p>
  `);
});

// API Routes
app.use("/api/subscription-types", subscriptionTypeRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/salons", salonRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/transactions", transactionRoutes);
// Error Handling (must be last)
app.use(notFound);
app.use(errorHandler);

// ====================== SERVER START ======================

let dbInitPromise = null;

const ensureDbReady = async () => {
  if (!dbInitPromise) {
    dbInitPromise = connectDB().catch((error) => {
      dbInitPromise = null;
      throw error;
    });
  }
  return dbInitPromise;
};

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  ensureDbReady()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📚 Swagger UI → http://localhost:${PORT}/api-docs`);
        console.log(`🖼️  Images served from /uploads with caching enabled`);
      });
    })
    .catch((error) => {
      console.error(`Startup error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = async (req, res) => {
  await ensureDbReady();
  return app(req, res);
};// redeploy backend with CORS
