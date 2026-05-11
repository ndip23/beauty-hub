const express = require('express');
const router = express.Router();
const {  startGuestConversation, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { getMyConversations } = require('../controllers/messageController');



// ====================== MESSAGING ROUTES ======================

// Guest starts conversation
router.post("/:id/inquiries", startGuestConversation);

// Send message (works for both guest & logged-in)
router.post("/conversations/:conversationId/messages", sendMessage);

// Get owner's conversations
router.get("/mysalon/conversations", protect, getMyConversations);
module.exports = router;