const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointmentModel");
const Salon = require("../models/salonModel");
const User = require("../models/userModel");
const Transaction = require("../models/transactionModel");

/**
 * @desc    Create a new appointment (Guest or Registered)
 * @route   POST /api/appointments
 * @access  Public (Optional Auth)
 */
const createAppointment = asyncHandler(async (req, res) => {
  const {
    salonId,
    serviceId,
    appointmentDateTime,
    clientName,
    clientNumber,
    homeService,
  } = req.body;

  // Basic Validation
  if (!salonId || !serviceId || !appointmentDateTime || !clientName || !clientNumber) {
    res.status(400);
    throw new Error("Please provide all required appointment details");
  }

  // Verify Salon and Owner
  const salon = await Salon.findById(salonId).populate("owner");
  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  const owner = await User.findById(salon.owner._id);
  if (!owner) {
    res.status(404);
    throw new Error("Salon owner not found");
  }

  // 🚀 WALLET GATEKEEPER CHECK (Pay-as-you-go)
  const BOOKING_FEE = 0.50; // The commission fee per booking ($0.50)
  
  if (owner.walletBalance < BOOKING_FEE && !owner.isVerified) {
    res.status(403);
    throw new Error("This salon is temporarily unable to accept bookings due to low balance.");
  }

  const service = salon.services.id(serviceId);
  if (!service) {
    res.status(404);
    throw new Error("Service not found");
  }

  // --- GHOST ACCOUNT LOGIC (Kept exactly as you had it) ---
  let customerId;
  if (req.user) {
    customerId = req.user._id;
  } else {
    let user = await User.findOne({ phone: clientNumber });

    if (!user) {
      const tempEmail = `${clientNumber}@guest.Beautyhub.site`;
      const tempPassword = Math.random().toString(36).slice(-10);

      user = await User.create({
        name: clientName,
        phone: clientNumber,
        email: tempEmail,
        password: tempPassword,
        role: "customer",
        isVerified: true, 
      });
    }
    customerId = user._id;
  }

  // Calculate Amount
  const amount = homeService 
    ? service.price + (service.homeServiceFee || 0) 
    : service.price;

  // Create Appointment
  const appointment = await Appointment.create({
    clientName,
    clientNumber,
    customer: customerId,
    salon: salonId,
    serviceId: serviceId,
    serviceName: service.name,
    appointmentDateTime,
    amount,
    currency: service.currency || salon.currency || "XAF",
    homeService: homeService || false,
    status: "Pending",
  });

  // 🚀 ✂️ DEDUCT THE COMMISSION FROM THE OWNER'S VIRTUAL WALLET
  if (!owner.isVerified) {
    owner.walletBalance -= BOOKING_FEE;
    await owner.save();

    // 🚀 GENERATE A UNIQUE TRANSACTION ID (Required by your Transaction schema)
    const customTransactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Record the commission deduction in the ledger
    await Transaction.create({
      transactionId: customTransactionId, // 🚀 FIXED: Added the required transactionId field
      user: owner._id,
      type: "BOOKING_FEE",
      amount: BOOKING_FEE,
      balanceAfter: owner.walletBalance,
      description: `Commission fee for booking: ${service.name}`,
      appointmentId: appointment._id
    });
  }

  res.status(201).json({
    success: true,
    message: "Booking requested successfully",
    data: appointment,
  });
});

/**
 * @desc    Get all appointments for a specific salon (Owner only)
 */
const getSalonAppointments = asyncHandler(async (req, res) => {
  const salon = await Salon.findById(req.params.salonId);

  if (!salon || salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to view these appointments");
  }

  const appointments = await Appointment.find({ salon: req.params.salonId })
    .populate("customer", "name phone email")
    .sort("-appointmentDateTime");

  res.json(appointments);
});

/**
 * @desc    Get current customer's appointments
 */
const getMyApointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ customer: req.user._id })
    .populate("salon", "name address phone")
    .sort("-appointmentDateTime");
  res.json(appointments);
});

/**
 * @desc    Update status (Owner only)
 */
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const appointment = await Appointment.findById(req.params.id).populate("salon");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  if (appointment.salon.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  appointment.status = status;
  const updatedAppointment = await appointment.save();
  res.json(updatedAppointment);
});

module.exports = {
  createAppointment,
  getSalonAppointments,
  getMyApointments,
  updateAppointmentStatus,
};