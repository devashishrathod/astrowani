const express = require("express");

const { createChatMessage, updateChatDetails, getChatHistory, getAllChatHistory, getChatHistoryUser } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const { validatePlanAndWallet } = require("../helpers/validatePlanAndWallet");
const router = express.Router();


// Routes
router.get("/get-chats", protect, getChatHistory); // Get chat history for astrologer or client
router.get("/get-chats-user", protect, getChatHistoryUser); // Get chat history for astrologer or client
router.post("/", protect, validatePlanAndWallet, createChatMessage); // Create a new chat message
router.put("/:chatId", updateChatDetails); // Update earnings, payment, and status

router.get('/get-history', protect, getAllChatHistory); // Get

module.exports = router;