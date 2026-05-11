// server/controllers/messageController.js
const asyncHandler = require("express-async-handler");
const Conversation = require("../models/messageModel");
const Salon = require("../models/salonModel");
// ====================== MESSAGING CONTROLLERS ======================

/**
 * @desc    Start a new conversation as Guest
 * @route   POST /api/salons/:id/conversations/guest
 * @access  Public
 */
const startGuestConversation = asyncHandler(async (req, res) => {
  const { id: salonId } = req.params;

  const { guestName, guestPhone, message, serviceId, serviceName } = req.body;
  console.log(req.body)
  if (!guestName || !guestPhone || !message) {
    res.status(400);
    throw new Error("Guest name, phone and message are required");
  }

  const salon = await Salon.findById(salonId);
  if (!salon) {
    res.status(404);
    throw new Error("Salon not found");
  }

  const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const conversation = await Conversation.create({
    salon: salonId,
    isGuestConversation: true,
    guestInfo: {
      name: guestName,
      phone: guestPhone,
      guestId: guestId,
    },
    messages: [{
      sender: null,
      isGuest: true,
      guestInfo: { name: guestName, phone: guestPhone, guestId },
      text: message,
    }],
    lastMessage: {
      text: message,
      sender: null,
      createdAt: new Date(),
    }
  });

  res.status(201).json({
    success: true,
    message: "Conversation started successfully",
    conversationId: conversation._id,
    guestId
  });
});

/**
 * @desc    Send message in a conversation (Guest or Logged-in)
 * @route   POST /api/conversations/:conversationId/messages
 * @access  Public (for guests) / Private (for users)
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const { text, guestId, guestName, guestPhone } = req.body;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  let newMessage;

  if (req.user) {
    // Logged-in user
    newMessage = {
      sender: req.user._id,
      isGuest: false,
      text,
    };
  } else {
    // Guest user
    newMessage = {
      sender: null,
      isGuest: true,
      guestInfo: {
        name: guestName,
        phone: guestPhone,
        guestId: guestId,
      },
      text,
    };
  }

  conversation.messages.push(newMessage);
  conversation.lastMessage = {
    text,
    sender: req.user ? req.user._id : null,
    createdAt: new Date()
  };

  await conversation.save();

  res.status(200).json({
    success: true,
    message: "Message sent",
    newMessage
  });
});

/**
 * @desc    Get all conversations for salon owner
 * @route   GET /api/salons/mysalon/conversations
 * @access  Private
 */


/**
 * @desc    Get all conversations for the logged-in salon owner
 * @route   GET /api/salons/mysalon/conversations
 * @access  Private
 */
const getMyConversations = asyncHandler(async (req, res) => {
  const salon = await Salon.findOne({ owner: req.user._id });

  if (!salon) {
    return res.status(404).json({
      success: false,
      message: "Salon profile not found"
    });
  }

  const conversations = await Conversation.find({ salon: salon._id })
    .populate({
      path: "messages.sender",
      select: "name avatar",
    })
    .sort({ updatedAt: -1 });
console.log(conversations)
  res.json({
    success: true,
    conversations,
  });
});

module.exports = {
  // ... your existing exports
  startGuestConversation,
  sendMessage,
  getMyConversations,
};