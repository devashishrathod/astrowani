const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/connected-customers",
  protect,
  authorize("astrologer"),
  sessionController.getConnectedClients
);
router.get(
  "/connected-astrologers",
  protect,
  authorize("customer"),
  sessionController.getConnectedAstrologers
);
// router.post('/start', sessionController.startSession);
// router.put('/end/:sessionId',  sessionController.endSession);
// router.post('/chat/:sessionId',  sessionController.addChatMessage);
// router.get('/history',  sessionController.getSessionHistory);
// router.get('/chat/:sessionId',  sessionController.getChatHistory);
// router.post('/feedback/:sessionId',  sessionController.addFeedback);
router.post("/", protect, sessionController.createSession);
router.get("/", sessionController.getSessions);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);
router.get("/client/:clientId", sessionController.getSessionsByClientId);

module.exports = router;
