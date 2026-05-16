// server/controllers/salonController.js
const asyncHandler = require("express-async-handler");
const Salon = require("../models/salonModel");

/**
 * @swagger
 * /api/salons:
 *   get:
 *     summary: Get all salons (Public)
 *     description: Returns a list of all registered salons with their basic info and services.
 *     tags: [Salons]
 *     responses:
 *       200:
 *         description: List of salons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Salon'
 */
// @desc    Get all salons (Paginated, Optimized, and Searchable)
// @route   GET /api/salons
// @access  Public
// @desc    Get all salons (Paginated, Optimized, and Searchable)
// const getSalons = asyncHandler(async (req, res) => {
//   const pageSize = 12; 
//   const page = Number(req.query.pageNumber) || 1;

//   const keyword = req.query.keyword
//     ? { name: { $regex: req.query.keyword, $options: "i" } }
//     : {};

//   const count = await Salon.countDocuments({ ...keyword });

//   // 1. Fetch data including services for price calculation
//   const salonsFromDb = await Salon.find({ ...keyword })
//     .select("name slug city address photos averageRating isVerified currency services") 
//     .limit(pageSize)
//     .skip(pageSize * (page - 1))
//     .sort({ isVerified: -1, createdAt: -1 });

//   // 2. Map and calculate minPrice on server (Requirement: Fix constant price)
//   const salons = salonsFromDb.map(salon => {
//     const salonObj = salon.toObject();
//     const prices = salonObj.services?.map(s => s.price) || [];
//     // Calculate min price or use fallback
//     salonObj.minPrice = prices.length > 0 ? Math.min(...prices) : 2500; 
//     // Delete huge services array to keep payload small (Boss Requirement: API Optimization)
//     delete salonObj.services; 
//     return salonObj;
//   });

//   res.json({
//     salons,
//     page,
//     pages: Math.ceil(count / pageSize),
//     totalSalons: count,
//   });
// });


const getSalonss = asyncHandler(async (req, res) => {
 
  const page = Number(req.query.page) || Number(req.query.pageNumber) || 1;
  let pageSize = Number(req.query.limit) || Number(req.query.pageSize) || 12;

  const MAX_PAGE_SIZE = 50;
  if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;
  if (pageSize < 1) pageSize = 12;

  const keyword = req.query.keyword?.trim();

  // ====================== Main Query ======================
  const matchStage = keyword 
    ? {
        $match: {
          $or: [
            { name:  { $regex: keyword, $options: "i" } },
            { city:  { $regex: keyword, $options: "i" } },
            // Uncomment the line below if you also want to search in address
            // { address: { $regex: keyword, $options: "i" } }
          ]
        }
      }
    : { $match: {} };   // No filter if no keyword

  const salons = await Salon.aggregate([
    matchStage,

    {
      $project: {
        name: 1,
        slug: 1,
        city: 1,
        address: 1,
        photos: 1,           
        averageRating: 1,
        isVerified: 1,
        currency: 1,
        createdAt: 1,
        minPrice: {
          $cond: {
            if: { $gt: [{ $size: "$services" }, 0] },
            then: { $min: "$services.price" },
            else: 2500
          }
        }
      }
    },

    // Sort: Verified salons first, then newest
    { $sort: { isVerified: -1, createdAt: -1 } },

    // Pagination
    { $skip: pageSize * (page - 1) },
    { $limit: pageSize }
  ]);

  // Get total count for pagination metadata (use same match condition)
  const count = keyword 
    ? await Salon.countDocuments({
        $or: [
          { name:  { $regex: keyword, $options: "i" } },
          { city:  { $regex: keyword, $options: "i" } },
          // { address: { $regex: keyword, $options: "i" } }
        ]
      })
    : await Salon.countDocuments({});

  res.json({
    success: true,
    salons,
    page,
    pages: Math.ceil(count / pageSize),
    totalSalons: count,
    pageSize,
    hasMore: page * pageSize < count
  });
});

const getSalons = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  let pageSize = Number(req.query.pageSize) || 12;
  const keyword = req.query.keyword?.trim();
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);
  const country = req.query.country;

  let salons = [];
  let totalCount = 0;

  // 1. GLOBAL FILTER
  const baseQuery = { isVerified: true };

  // 🌍 LOCALIZATION (international prefix + common local formats)
  if (country) {
    const countryToPrefix = {
      Uganda: "256",
      Cameroon: "237",
      Nigeria: "234",
      Kenya: "254",
      Tanzania: "255",
      Zambia: "260",
    };
    const localPhonePatterns = {
      Cameroon: "^[\\s+()\\-]*6[0-9]",
      Nigeria: "^[\\s+()\\-]*0?[789][0-9]",
      Kenya: "^[\\s+()\\-]*0?7[0-9]",
      Uganda: "^[\\s+()\\-]*0?7[0-9]",
      Tanzania: "^[\\s+()\\-]*0?7[0-9]",
      Zambia: "^[\\s+()\\-]*0?9[0-9]",
    };
    const prefix = countryToPrefix[country];
    const phoneMatchers = [];
    if (prefix) {
      phoneMatchers.push({ phone: { $regex: `^(\\+)?${prefix}` } });
    }
    if (localPhonePatterns[country]) {
      phoneMatchers.push({ phone: { $regex: localPhonePatterns[country] } });
    }
    if (phoneMatchers.length === 1) {
      baseQuery.phone = phoneMatchers[0].phone;
    } else if (phoneMatchers.length > 1) {
      baseQuery.$or = phoneMatchers;
    }
  }

  // 🎲 SHUFFLE LOGIC: Create a seed based on the current date (e.g., "2024-04-13")
  // This ensures the random order stays stable for the user for the whole day
  // so Page 2 doesn't show Page 1 salons.
  const shuffleSeed = new Date().toISOString().split('T')[0];

  // ==================== NEAR ME ====================
  if (!isNaN(lat) && !isNaN(lng)) {
    const MAX_DISTANCE_METERS = 500 * 1000;
    const matchQuery = { ...baseQuery }; 
    if (keyword) {
      matchQuery.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } }
      ];
    }

    salons = await Salon.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distance",
          maxDistance: MAX_DISTANCE_METERS,
          spherical: true,
          query: matchQuery 
        }
      },
      {
        $project: {
          name: 1, slug: 1, city: 1, address: 1, photos: 1, phone: 1,
          averageRating: 1, isVerified: 1, currency: 1,
          distance: { $round: [{ $divide: ["$distance", 1000] }, 1] },
          minPrice: { $cond: { if: { $gt: [{ $size: "$services" }, 0] }, then: { $min: "$services.price" }, else: 2500 } }
        }
      },
      { $sort: { distance: 1 } }, // Distance is naturally a good "shuffle" for location
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize }
    ]);
    totalCount = await Salon.countDocuments(matchQuery);
  } 
  // ==================== NORMAL SEARCH & SHOW ALL (With Shuffle) ====================
  else {
    const matchQuery = { ...baseQuery };
    if (keyword) {
      matchQuery.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } }
      ];
    }

    salons = await Salon.aggregate([
      { $match: matchQuery },
      // 🚀 THE SHUFFLE STEP:
      // We add a field that combines the unique ID with our daily seed, then sort by it.
      { $addFields: { "shuffleOrder": { $concat: ["$name", shuffleSeed] } } },
      { $sort: { "shuffleOrder": 1 } }, 
      {
        $project: {
          name: 1, slug: 1, city: 1, address: 1, photos: 1, phone: 1,
          averageRating: 1, isVerified: 1, currency: 1,
          minPrice: { $cond: { if: { $gt: [{ $size: "$services" }, 0] }, then: { $min: "$services.price" }, else: 2500 } }
        }
      },
      { $skip: pageSize * (page - 1) },
      { $limit: pageSize }
    ]);
    totalCount = await Salon.countDocuments(matchQuery);
  }

  res.json({
    success: true,
    salons,
    page,
    pages: Math.ceil(totalCount / pageSize),
    totalSalons: totalCount,
  });
});
// const getSalons = asyncHandler(async (req, res) => {
 
//   const page = Number(req.query.page) || Number(req.query.pageNumber) || 1;
  
//   let pageSize = Number(req.query.limit) || Number(req.query.pageSize) || 12;


//   const MAX_PAGE_SIZE = 50;
//   if (pageSize > MAX_PAGE_SIZE) pageSize = MAX_PAGE_SIZE;
//   if (pageSize < 1) pageSize = 12;

 
//   const keyword = req.query.keyword
//     ? { 
//         name: { 
//           $regex: req.query.keyword, 
//           $options: "i" 
//         } 
//       }
//     : {};

//   // ====================== Main Query ======================
//   const salons = await Salon.aggregate([
//     { $match: keyword },

   
//     {
//       $project: {
//         name: 1,
//         slug: 1,
//         city: 1,
//         address: 1,
//         photos: 1,           
//         averageRating: 1,
//         isVerified: 1,
//         currency: 1,
//         createdAt: 1,
//         minPrice: {
//           $cond: {
//             if: { $gt: [{ $size: "$services" }, 0] },
//             then: { $min: "$services.price" },
//             else: 2500
//           }
//         }
//       }
//     },

//     // Sort: Verified salons first, then newest
//     { $sort: { isVerified: -1, createdAt: -1 } },

//     // Pagination
//     { $skip: pageSize * (page - 1) },
//     { $limit: pageSize }
//   ]);

//   // Get total count for pagination metadata
//   const count = await Salon.countDocuments(keyword);

//   res.json({
//     success: true,
//     salons,
//     page,
//     pages: Math.ceil(count / pageSize),
//     totalSalons: count,
//     pageSize,
//     hasMore: page * pageSize < count
//   });
// });

/**
 * @swagger
 * /api/salons/{id}:
 *   get:
 *     summary: Get a single salon by ID (Public)
 *     tags: [Salons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: Salon not found
 */
// const getSalonById = asyncHandler(async (req, res) => {
//   const salon = await Salon.findById(req.params.id)
//     .populate({
//       path: "reviews",
//       populate: { path: "user", select: "name" } // Populates the user name inside the review
//     });

//   if (salon) {
//     res.json(salon);
//   } else {
//     res.status(404);
//     throw new Error("Salon not found");
//   }
// });

// /**
//  * @swagger
//  * /api/salons:
//  *   post:
//  *     summary: Create salon profile after successful Swychr payment
//  *     description: |
//  *       Salon creation is paywalled behind Swychr payment gateway.
//  *
//  *       The user must complete payment via Swychr and provide the resulting
//  *       **Swychr transaction reference** (e.g., `SWY-XXXXXXX`) in the `paymentReference` field.
//  *
//  *       The backend will:
//  *       • Verify the transaction directly with Swychr (using merchant credentials)
//  *       • Confirm the exact amount matches the selected plan
//  *       • Ensure the transaction status is `successful`
//  *       • Prevent reuse of the same reference
//  *
//  *       On successful verification → creates the salon profile and activates the subscription instantly.
//  *     tags: [Salons]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - subscriptionTypeId
//  *               - paymentReference
//  *               - name
//  *               - description
//  *               - address
//  *               - city
//  *               - phone
//  *             properties:
//  *               subscriptionTypeId:
//  *                 type: string
//  *                 description: MongoDB ObjectId of the chosen subscription plan (from SubscriptionType collection)
//  *                 example: 671f3a2b9e4d8c1f5a6b7c8d
//  *               paymentReference:
//  *                 type: string
//  *                 description: Swychr transaction reference returned after successful payment (e.g., SWY-20251120XXXXXX)
//  *                 example: SWY-20251120123456789
//  *               name:
//  *                 type: string
//  *                 description: Name of the salon
//  *                 example: Glamour Beauty Hub
//  *               description:
//  *                 type: string
//  *                 description: Short description about the salon
//  *                 example: Premium hair & beauty services in Lagos
//  *               address:
//  *                 type: string
//  *                 description: Full physical address of the salon
//  *                 example: 123 Adeola Odeku Street, Victoria Island
//  *               city:
//  *                 type: string
//  *                 description: City where the salon is located
//  *                 example: Lagos
//  *               phone:
//  *                 type: string
//  *                 description: Contact phone number (preferably WhatsApp-enabled)
//  *                 example: +2348012345678
//  *               openingHours:
//  *                 type: object
//  *                 description: Optional opening hours (any format, stored as-is)
//  *                 example:
//  *                   monday: "09:00 - 18:00"
//  *                   tuesday: "09:00 - 18:00"
//  *                   sunday: "Closed"
//  *     responses:
//  *       201:
//  *         description: Salon created successfully and subscription activated
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Salon created successfully! Your subscription is active.
//  *                 salon:
//  *                   $ref: '#/components/schemas/Salon'
//  *       400:
//  *         description: Bad request – invalid plan, payment verification failed, duplicate salon, etc.
//  *       401:
//  *         description: Unauthorized – missing or invalid JWT token
//  */
/**
 * @desc    Create salon profile 
 * @route   POST /api/salons
 * @access  Private (Owner or Admin)
 */
// @desc    Create Salon Profile



const getSalonById = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id)
    .select(
      "name slug city address photos averageRating isVerified currency services description workingHours contactNumber email socialLinks createdAt"
    )
    .populate({
      path: "reviews",
      select: "rating comment createdAt",
      populate: {
        path: "user",
        select: "name avatar",
      },
      options: { 
        sort: { createdAt: -1 },
        limit: 10
      }
    })
    .lean();

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  salon.minPrice = salon.services?.length > 0 
    ? Math.min(...salon.services.map(s => s.price || 0)) 
    : 2500;

  res.json(salon);
});
const createSalon = asyncHandler(async (req, res) => {
  const { name, description, address, city, phone, openingHours, photos, currency, ownerId } = req.body;

  const isAdmin = req.user.role === "admin";
  const targetOwnerId = isAdmin && ownerId ? ownerId : req.user._id;

  const existingSalon = await Salon.findOne({ owner: targetOwnerId });
  if (existingSalon) {
    res.status(400);
    throw new Error("This user already has a salon profile");
  }
  console.log(existingSalon)

  const salon = await Salon.create({
    owner: targetOwnerId,
    name,
    description,
    address,
    city,
    phone,
    openingHours,
    currency: currency || "XAF", 
    photos: photos || [], // SAVES CLOUDINARY LINKS
    isVerified: true,           
  });

  res.status(201).json(salon);
});
/**
 * @swagger
 * /api/salons/{id}:
 *   put:
 *     summary: Update salon profile (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               address: { type: string }
 *               city: { type: string }
 *               phone: { type: string }
 *               openingHours: { type: object }
 *               photos: { type: array, items: { type: string } }
 *     responses:
 *       200:
 *         description: Updated salon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Salon not found
 */

const updateSalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401);
    throw new Error("Not authorized");
  }

  // Update text fields
  salon.name = req.body.name || salon.name;
  salon.description = req.body.description || salon.description;
  salon.address = req.body.address || salon.address;
  salon.city = req.body.city || salon.city;
  salon.phone = req.body.phone || salon.phone;
  salon.currency = req.body.currency || salon.currency;
  
  // Update Photos (Overwrite old array with new one from frontend)
  if (req.body.photos) {
    salon.photos = req.body.photos;
  }

  const updatedSalon = await salon.save();
  res.json(updatedSalon);
});
/**
 * @swagger
 * /api/salons/{id}/services:
 *   post:
 *     summary: Add a new service to salon (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Box Braids"
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 35000
 *               duration:
 *                 type: string
 *                 example: "3-4 hours"
 *     responses:
 *       201:
 *         description: Service added successfully
 */

// just adding this log to force deployment
const addSalonService = asyncHandler(async (req, res) => {
  const { name, description, price, currency, homeService, duration, homeServiceFee, photos } =
    req.body;

  if (!name || !description || !price || !currency || !photos) {
    return res.status(400).json({
      message:
        "missing required field, check that name, description, price, photos and currency have been provided",
    });
  }
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    return res.status(404).json({
      message: `salon with id ${req.params.id} not found`,
    });
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const service = {
    name,
    description,
    price,
    currency,
    duration,
    homeService,
    homeServiceFee,
    photos: photos || []
  };

  await Salon.findByIdAndUpdate(req.params.id, {
    $addToSet: { services: service },
  });

  return res.status(200).json({
    message: "service added successfully",
  });
});

/**
 * @swagger
 * /api/salons/{id}/services/{service_id}:
 *   put:
 *     summary: Update a service (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               duration: { type: string }
 *     responses:
 *       200:
 *         description: Service updated
 *       404:
 *         description: Salon or service not found
 */
const updateSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const service = salon.services.id(req.params.service_id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  service.name = req.body.name || service.name;
  service.description = req.body.description || service.description;
  service.price = req.body.price || service.price;
  service.duration = req.body.duration || service.duration;
  service.photos = req.body.photos || service.photos;

  await salon.save();
  res.json({ message: "Service updated" });
});

/**
 * @swagger
 * /api/salons/{id}/services/{service_id}:
 *   delete:
 *     summary: Delete a service (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Service removed successfully
 *       404:
 *         description: Salon or service not found
 */
const deleteSalonService = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  if (salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const service = salon.services.id(req.params.service_id);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  await service.deleteOne();
  await salon.save();
  res.json({ message: "Service removed" });
});

/**
 * @swagger
 * /api/salons/mysalon:
 *   get:
 *     summary: Get logged-in owner's salon profile
 *     description: Returns the full salon profile belonging to the authenticated salon owner.
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner's salon
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Salon'
 *       404:
 *         description: No salon profile found — owner needs to create one
 */
// const getMySalon = asyncHandler(async (req, res) => {
//   const salon = await Salon.findOne({ owner: req.user._id });
//   res.status(200).json(salon || null);
// });
const getMySalon = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id })
    .select(
      "name slug city address photos averageRating isVerified currency services description products openingHours createdAt"  // ← ADD "products"
    )
    .populate({
      path: "reviews",
      select: "rating comment createdAt",
      populate: { path: "user", select: "name avatar" },
      options: { sort: { createdAt: -1 } }
    })
    .lean();

  if (!salon) {
    return res.status(404).json({ message: "Salon not found" });
  }

  // Calculate minPrice for services (if needed)
  salon.minPrice = salon.services?.length > 0 
    ? Math.min(...salon.services.map(s => s.price || 0)) 
    : 2500;

  res.status(200).json(salon);
});

const getSalonBySlug = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ slug: req.params.slug })
    .populate("owner", "name email")
    .populate("reviews");

  if (!salon) {
    return res.status(404).json({ message: "Salon not found" });
  }

  res.json({ success: true, data: salon });
});




const searchSalonsByService = async (req, res) => {
  try {
    const { q } = req.query;
console.log(q)
    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const salons = await Salon.find({
      services: {
        $elemMatch: {
          name: { $regex: q, $options: "i" }, // 🔥 case-insensitive search
        },
      },
    })
      .populate("reviews") // optional
      .sort({ averageRating: -1 });
console.log(salons)
    res.json({
      success: true,
      count: salons.length,
      salons,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};






////////////////-----------------PRODUCTS-----------------//////////////////////////



/**
 * @swagger
 * /api/salons/{id}/products:
 *   post:
 *     summary: Add a new product to salon (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string, example: "Argan Hair Oil 100ml" }
 *               description: { type: string }
 *               price: { type: number, example: 12500 }
 *               currency: { type: string, example: "XAF" }
 *               stock: { type: number, example: 50 }
 *               sku: { type: string, example: "ARGAN-OIL-001" }
 *               category: { type: string, enum: ["haircare", "skincare", "tools", "makeup", "accessories", "other"] }
 *               photos: { type: array, items: { type: string } }
 *               isAvailable: { type: boolean, default: true }
 *               featured: { type: boolean, default: false }
 *     responses:
 *       201: { description: Product added successfully }
 */
const addSalonProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    currency,
    stock,
    sku,
    category,
    photos,
    isAvailable,
    featured
  } = req.body;

  if (!name || !price) {
    return res.status(400).json({
      message: "Name and price are required fields",
    });
  }

  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    return res.status(404).json({ message: "Salon not found" });
  }

  // Authorization check
  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized");
  }

  const product = {
    name,
    description,
    price,
    currency: currency || salon.currency || "XAF",
    stock: stock || 0,
    sku,
    category: category || "other",
    photos: photos || [],
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    featured: featured || false,
  };

  await Salon.findByIdAndUpdate(req.params.id, {
    $push: { products: product },   // Use $push instead of $addToSet for products
  });

  res.status(201).json({
    message: "Product added successfully",
    product
  });
});

/**
 * @swagger
 * /api/salons/{id}/products/{product_id}:
 *   put:
 *     summary: Update a product (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               stock: { type: number }
 *               sku: { type: string }
 *               category: { type: string }
 *               photos: { type: array, items: { type: string } }
 *               isAvailable: { type: boolean }
 *               featured: { type: boolean }
 *     responses:
 *       200: { description: Product updated successfully }
 */
const updateSalonProduct = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized");
  }

  const product = salon.products.id(req.params.product_id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update fields
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  product.currency = req.body.currency || product.currency;
  product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
  product.sku = req.body.sku || product.sku;
  product.category = req.body.category || product.category;
  product.photos = req.body.photos || product.photos;
  product.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : product.isAvailable;
  product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;

  await salon.save();

  res.json({
    message: "Product updated successfully",
    product
  });
});

/**
 * @swagger
 * /api/salons/{id}/products/{product_id}:
 *   delete:
 *     summary: Delete a product (Owner only)
 *     tags: [Salons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Product deleted successfully }
 */
const deleteSalonProduct = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.id);

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  if (salon.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized");
  }

  const product = salon.products.id(req.params.product_id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  await salon.save();

  res.json({ message: "Product deleted successfully" });
});




/**
 * @swagger
 * /api/salons/{id}/products:
 *   get:
 *     summary: Get all products for a specific salon (Public)
 *     tags: [Salons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *         description: Filter only featured products
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filter by category (haircare, skincare, etc.)
 *       - in: query
 *         name: available
 *         schema: { type: boolean }
 *         description: Filter only available products
 *     responses:
 *       200:
 *         description: List of salon products
 */
const getSalonProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { featured, category, available } = req.query;

  const salon = await Salon.findById(id)
    .select("name slug currency products")
    .lean();

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  let products = salon.products || [];

  // Apply filters
  if (featured === "true") {
    products = products.filter(p => p.featured === true);
  }

  if (category) {
    products = products.filter(p => 
      p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (available === "true") {
    products = products.filter(p => p.isAvailable !== false);
  }

  // Optional: Sort by featured first, then name
  products.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  res.json({
    success: true,
    salon: {
      _id: salon._id,
      name: salon.name,
      slug: salon.slug,
      currency: salon.currency,
    },
    products,
    totalProducts: products.length,
  });
});




const getSalonProductsBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { featured, category, available } = req.query;

  const salon = await Salon.findOne({ slug })
    .select("name slug currency products")
    .lean();

  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  // ... same filtering logic as above
  let products = salon.products || [];

  if (featured === "true") products = products.filter(p => p.featured);
  if (category) products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  if (available === "true") products = products.filter(p => p.isAvailable !== false);

  products.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  res.json({
    success: true,
    salon: {
      _id: salon._id,
      name: salon.name,
      slug: salon.slug,
      currency: salon.currency,
    },
    products,
    totalProducts: products.length,
  });
});



/**
 * @desc    Get all products for the logged-in salon owner
 * @route   GET /api/salons/mysalon/products
 * @access  Private (Owner only)
 */
const getMySalonProducts = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id })
    .select("name slug currency products")   // Only needed fields
    .lean();

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon profile not found. Please create your salon first."
    });
  }

  const products = salon.products || [];

  // Sort: Featured first, then by name
  products.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  res.json({
    success: true,
    salon: {
      _id: salon._id,
      name: salon.name,
      slug: salon.slug,
      currency: salon.currency,
    },
    products,
    totalProducts: products.length,
  });
});



module.exports = {
  getSalons,
  getSalonBySlug,
  getSalonById,
  createSalon,
  updateSalon,
  addSalonService,
  updateSalonService,
  deleteSalonService,
  getMySalon,
  searchSalonsByService,


  // New Product Controllers
  addSalonProduct,
  updateSalonProduct,
  deleteSalonProduct,
  getSalonProducts,           
  getSalonProductsBySlug,
getMySalonProducts,
  getMySalon,
  searchSalonsByService
  
};
