// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Send Notification Route
router.post('/send',protect, notificationController.sendNotification);
router.get('/get-all-notifications', protect,notificationController.getUserNotifications);

// router.post('/notifications', protect, notificationController.sendNotification);
// router.post('/notifications/bulk', protect, notificationController.sendBulkNotifications);
// router.put('/notifications/:id/read', protect, notificationController.markAsRead);
// router.get('/notifications', protect, notificationController.getUserNotifications);
module.exports = router;
//==========================================================
