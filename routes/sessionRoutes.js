// sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Session management routes
// Get connected customers for an astrologer
router.get('/connected-customers', protect, authorize('astrologer'), sessionController.getConnectedClients);

// Get connected astrologers for a customer
router.get('/connected-astrologers', protect, authorize('customer'), sessionController.getConnectedAstrologers);
// router.post('/start', sessionController.startSession);
// router.put('/end/:sessionId',  sessionController.endSession);
// router.post('/chat/:sessionId',  sessionController.addChatMessage);
// router.get('/history',  sessionController.getSessionHistory);
// router.get('/chat/:sessionId',  sessionController.getChatHistory);
// router.post('/feedback/:sessionId',  sessionController.addFeedback);
// Routes
router.post("/", protect, sessionController.createSession); // Create a new session
router.get("/", sessionController.getSessions); // Get session history for astrologer or client
router.put("/:id", sessionController.updateSession); // Update a session
router.delete("/:id", sessionController.deleteSession); // Delete a session

// Route to get all sessions by clientId with optional pagination
router.get("/client/:clientId", sessionController.getSessionsByClientId);

module.exports = router;