const mongoose = require('mongoose');

const singleMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,           
    },
    isGuest: { 
      type: Boolean, 
      default: false 
    },
    guestInfo: {
      name: String,
      phone: String,
      guestId: String,           // Temporary unique ID for guest
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    salon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Salon',
      required: true,
    },
    
    // Support for guest conversations
    isGuestConversation: {
      type: Boolean,
      default: false,
    },
    guestInfo: {
      name: String,
      phone: String,
      guestId: String,
    },

    messages: [singleMessageSchema],
    lastMessage: {
      text: String,
      sender: mongoose.Schema.Types.ObjectId,
      createdAt: Date,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;