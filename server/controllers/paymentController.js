// controllers/paymentController.js
const asyncHandler = require("express-async-handler");
const Payment = require("../models/paymentModel");
const mongoose = require("mongoose");
const { login, getPaymentStatus } = require("../services/swychrService");
const Subscription = require("../models/subscriptionModel");

const STATUS_PENDING = 0;
const STATUS_SUCCESS = 1;
const STATUS_FAILED = 2;
/**
 * @swagger
 * /api/payments/initiate-swychr:
 *   post:
 *     summary: Initiate Swychr payment with full salon customization
 *     description: |
 *       Creates a Swychr payment link and saves user's salon details for auto-creation on success.
 *       Users provide their salon name, address, etc. before paying.
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionTypeId
 *               - salonName
 *               - address
 *               - city
 *               - phone
 *             properties:
 *               subscriptionTypeId:
 *                 type: string
 *                 example: 671f3a2b9e4d8c1f5a6b7c8d
 *               salonName:
 *                 type: string
 *                 example: "Luxe Beauty Palace"
 *               salonDescription:
 *                 type: string
 *                 example: "Premium hair & nail services in Yaoundé"
 *               address:
 *                 type: string
 *                 example: "Rue des Pavillons, Bastos"
 *               city:
 *                 type: string
 *                 example: "Yaoundé"
 *               phone:
 *                 type: string
 *                 example: "+237699999999"
 *               openingHours:
 *                 type: object
 *                 example: { "monday": "09:00 - 19:00", "sunday": "Closed" }
 *     responses:
 *       200:
 *         description: Payment link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentReference: { type: string }
 *                     paymentUrl: { type: string }
 *                     amount: { type: number }
 *                     planName: { type: string }
 */
// const initiateSwychrPayment = asyncHandler(async (req, res) => {
//   const {
//   entity,
//   entityId,
//   amount,
//   currency,
//   } = req.body;

//   const user = req.user;

//   // Validate required fields
//   if (!entity || !entityId || !amount || !currency) {
//     return res.status(400).json({ message: "All salon details are required" });
//   }

//   const plan = await SubscriptionType.findById(subscriptionTypeId);
//   if (!plan)
//     return res.status(400).json({ message: "Invalid subscription plan" });

//   const transactionId = `BEAUTY-${Date.now()}-${uuidv4().slice(0, 8)}`;

//   try {
//     const token = await login();

//     const payload = {
//       country_code: "CM",
//       name: user.name || "Customer",
//       email: user.email,
//       mobile: phone,
//       amount: plan.amount,
//       transaction_id: transactionId,
//       description: `BeautyHub - ${plan.planName} Plan`,
//       pass_digital_charge: false,
//     };

//     const swychrResponse = await createPaymentLink(token, payload);

//     // Save full transaction with user-controlled salon details
//     await Transaction.create({
//       transactionId,
//       user: user._id,
//       plan: plan._id,
//       amount: plan.amount,
//       customerName: user.name,
//       customerEmail: user.email,
//       customerPhone: phone,
//       countryCode: "CM",
//       description: payload.description,
//       status: "LINK_CREATED",
//       paymentUrl:
//         swychrResponse.data?.payment_url ||
//         `https://pay.accountpe.com/link/${transactionId}`,

//       // ← USER-CONTROLLED SALON DETAILS
//       salonDetails: {
//         name: salonName,
//         description: salonDescription || "",
//         address,
//         city,
//         phone,
//         openingHours: openingHours || {},
//       },
//     });

//     res.json({
//       success: true,
//       data: {
//         paymentReference: transactionId,
//         paymentUrl:
//           swychrResponse.data?.payment_url ||
//           `https://pay.accountpe.com/link/${transactionId}`,
//         amount: plan.amount,
//         planName: plan.planName,
//         planSpecs: plan.planSpecs,
//       },
//     });
//   } catch (err) {
//     console.error("Swychr Error:", err.response?.data || err.message);
//     await Transaction.create({
//       transactionId,
//       user: user._id,
//       amount: plan.amount,
//       status: "FAILED",
//     });
//     res
//       .status(500)
//       .json({ success: false, message: "Payment creation failed" });
//   }
// });

/**
 * @swagger
 * /api/payments/swychr/webhook:
 *   post:
 *     summary: Swychr Webhook – Auto-create user-defined salon on payment success
 *     description: |
 *       Called by Swychr on payment status change.
 *       When status = "paid" → creates salon using user's pre-filled details.
 *       Fully idempotent and resilient.
 *     tags: [Payments]
 */
const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { id: transactionId } = req.params;

  const payment = await Payment.findById(transactionId);
  if (!payment) {
    return res.status(200).json({ message: "Transaction not found - ignored" });
  }

  if (payment.status === "Completed") {
    return res.status(200).json({ data: { status: "Completed" } });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const token = await login();
    const paymentData = await getPaymentStatus(token, transactionId);
    const paymentStatus = paymentData.data?.data?.attributes?.status;

    let statusResponse = "Created";

    if (paymentStatus === STATUS_SUCCESS) {
      const user = await User.findById(payment.userId).session(session);
      if (!user) throw new Error("User not found");

      // 🚀 Add real USD money received on Swychr straight into the virtual wallet
      const topUpAmount = Number(payment.amountUsd) || 5;
      user.walletBalance = (user.walletBalance || 0) + topUpAmount;
      await user.save({ session });

      // 🚀 Record the deposit in the transactions list
      await Transaction.create(
        [{
          user: user._id,
          type: "DEPOSIT",
          amount: topUpAmount,
          balanceAfter: user.walletBalance,
          description: `Wallet Top-up via Swychr`,
          paymentId: payment._id
        }],
        { session }
      );

      payment.status = "Completed";
      await payment.save({ session });
      statusResponse = "Completed";
    } else if (paymentStatus === STATUS_FAILED) {
      payment.status = "Failed";
      await payment.save({ session });
      statusResponse = "Failed";
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ data: { status: statusResponse } });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("WEBHOOK ERROR:", error.message);
    return res.status(400).json({ message: `Error validating webhook: ${error.message}` });
  }
});

module.exports = { checkPaymentStatus };
