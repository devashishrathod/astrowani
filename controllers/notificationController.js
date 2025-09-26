const Notification  = require('../models/notificationModel');
const notificationService = require('../helpers/notificationService');
// const { initializeFirebaseAdmin } = require('../firebase/firebaseAdmin');

// // Create and Send Notification
exports.sendNotification = async (req, res) => {
  const {title, message,priority, metadata } = req.body;
  const userId = req.user._id;
  const fcmToken = req.user.fcm;
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      priority,
      metadata,
    });

    if (notification) {
      // Send FCM Notification
      await notificationService.sendMessage(title, message, fcmToken);
      res.status(201).json({ success: true, data: notification });
    } else {
      res.status(400).json({ success: false, message: 'Failed to create notification' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// // exports.sendNotification = async (req, res) => {
// //   const { title, message, priority, metadata } = req.body;

// //   try {
// //     // Example: Assuming the role is available in the request user object
// //     const role = req.user.role; 
// //     const fcmToken = req.user.fcm;
// //     console.log("FCM_TOKEN",fcmToken);
// //     console.log("ROLE",role);
    
// //     // const firebaseAdmin = initializeFirebaseAdmin(role);

// //     const notification = await Notification.create({
// //       userId: req.user._id,
// //       title,
// //       message,
// //       priority,
// //       metadata,
// //     });

// //     if (notification) {
// //       // Use Firebase Admin for sending notifications
// //       await notificationService.sendMessage(title, message, fcmToken, initializeFirebaseAdmin(role));
// //       res.status(201).json({ success: true, data: notification });
// //     } else {
// //       res.status(400).json({ success: false, message: "Failed to create notification" });
// //     }
// //   } catch (error) {
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

exports.getUserNotifications = async (req, res) => {
    try {
        // Fetch notifications for the user sorted by creation date (most recent first)
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

        // Respond with the fetched notifications
        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        // Log the error and respond with a generic error message
        console.error("Error fetching notifications:", error);

        // Send a 500 error response to the client
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications. Please try again later.",
        });
    }
};

//=========================================================
// controllers/notificationController.js
// const Notification = require('../models/notificationModel');
// const { sendMessage, sendMulticast } = require('../helpers/notificationService');

// const createNotificationRecord = async (userId, notificationData) => {
//   try {
//     return await Notification.create({
//       userId,
//       ...notificationData
//     });
//   } catch (error) {
//     console.error('Error creating notification record:', error);
//     throw error;
//   }
// };

// const updateNotificationStatus = async (notificationId, updates) => {
//   try {
//     return await Notification.findByIdAndUpdate(
//       notificationId,
//       updates,
//       { new: true }
//     );
//   } catch (error) {
//     console.error('Error updating notification:', error);
//     throw error;
//   }
// };

// const sendNotification = async (req, res) => {
//   const { title, message, fcmToken, priority, metadata } = req.body;
//   const { id, role } = req.user;

//   try {
//     // Create notification record
//     const notification = await createNotificationRecord(id, {
//       title,
//       message,
//       priority,
//       metadata
//     });

//     // Send FCM notification
//     await sendMessage(
//       role,
//       title,
//       message,
//       fcmToken,
//       {
//         notificationId: notification._id.toString(),
//         ...metadata
//       }
//     );

//     // Update notification status
//     const updatedNotification = await updateNotificationStatus(notification._id, {
//       isSent: true
//     });

//     res.status(201).json({
//       success: true,
//       data: updatedNotification
//     });
//   } catch (error) {
//     console.error('Notification error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// const sendBulkNotifications = async (req, res) => {
//   const { title, message, fcmTokens, priority, metadata } = req.body;
//   const { _id: userId, role } = req.user;

//   try {
//     // Create notification records
//     const createNotifications = async () => {
//       return Promise.all(
//         fcmTokens.map(() => 
//           createNotificationRecord(userId, {
//             title,
//             message,
//             priority,
//             metadata
//           })
//         )
//       );
//     };

//     const notifications = await createNotifications();

//     // Send bulk FCM notifications
//     const fcmResponse = await sendMulticast(
//       role,
//       title,
//       message,
//       fcmTokens,
//       {
//         notificationIds: notifications.map(n => n._id.toString()),
//         ...metadata
//       }
//     );

//     // Update notification statuses
//     const updateNotifications = async () => {
//       return Promise.all(
//         notifications.map(notification =>
//           updateNotificationStatus(notification._id, { isSent: true })
//         )
//       );
//     };

//     const updatedNotifications = await updateNotifications();

//     res.status(201).json({
//       success: true,
//       data: {
//         notifications: updatedNotifications,
//         fcmResponse
//       }
//     });
//   } catch (error) {
//     console.error('Bulk notification error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // Utility functions for notification management
// const getNotificationsByUser = async (userId, limit = 50) => {
//   try {
//     return await Notification.find({ userId })
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     throw error;
//   }
// };

// const markNotificationAsRead = async (notificationId) => {
//   try {
//     return await updateNotificationStatus(notificationId, { isRead: true });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     throw error;
//   }
// };

// // Controller endpoints using utility functions
// const getUserNotifications = async (req, res) => {
//   try {
//     const notifications = await getNotificationsByUser(
//       req.user._id,
//       req.query.limit
//     );
    
//     res.status(200).json({
//       success: true,
//       data: notifications
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// const markAsRead = async (req, res) => {
//   try {
//     const notification = await markNotificationAsRead(req.params.id);
    
//     res.status(200).json({
//       success: true,
//       data: notification
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// module.exports = {
//   sendNotification,
//   sendBulkNotifications,
//   getUserNotifications,
//   markAsRead
// };

//==========================================================
// const Notification = require("../models/notificationModel");
// const Astrologer = require("../models/astrologerModel");
// const User = require("../models/userModel");
// const {
//   sendMessage,
//   getFcmTokens,
//   sendAnnouncementNotification,
// } = require("../helpers/notificationService");
// // const SettingOfNotification = require("../models/SettingOfNotification");

// const saveToken = async (req, res) => {
//   const { firebaseToken } = req.body;
//   const userId = req.user.id;

//   try {
//     const astrologers = await Astrologer.find({ userId: userId.toString() });

//     await Notification.findOneAndUpdate(
//       { vendorId: astrologers[0].userId },
//       { firebaseToken },
//       { upsert: true } // Insert if not found, update if exists
//     );
//     res.status(200).send("Token saved/updated successfully!");
//   } catch (error) {
//     console.error("Error saving token:", error);
//     res.status(500).send("Error saving token.");
//   }
// };

// const getNotificationListForVendor = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const astrologers = await Astrologer.find({ userId: userId.toString() });
//     const response = await Notification.findOne({
//       vendorId: astrologers[0].userId,
//     })
//       .select("notifications -_id")
//       .lean();

//     if (!response) {
//       return res.status(404).json({
//         success: false,
//         message: "No notifications found for this vendor.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Notifications fetched successfully.",
//       notifications: response.notifications,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving notification list.");
//   }
// };

// // Send real-time notification
// const sendRealTimeNotification = async (req, res) => {
//   const { vendorId, title, body, firebaseToken } = req.body;

//   try {
//     // Add notification to the database
//     const notification = {
//       title,
//       body,
//       type: "real-time",
//       isRead: false,
//       createdAt: new Date(),
//     };

//     const user = User.findOne({ _id: vendorId });

//     const updatedNotification = await Notification.findOneAndUpdate(
//       { vendorId },
//       {
//         $push: { notifications: notification },
//         firebaseToken, // Update firebaseToken if provided
//       },
//       { new: true, upsert: true }
//     );

//     // Use Firebase helper to send notification
//     await sendMessage(title, body, firebaseToken, user.role);

//     console.log(updatedNotification);

//     res.status(200).json({ success: true, updatedNotification });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// // const notifyInactiveUsers = async () => {
// //   try {
// //     // Fetch notification settings
// //     const settings = await SettingOfNotification.findOne();
// //     const inactivityDaysThreshold = settings?.inactivityDaysThreshold || 7;

// //     // Calculate threshold date for inactivity
// //     const thresholdDate = new Date();
// //     thresholdDate.setDate(thresholdDate.getDate() - inactivityDaysThreshold);

// //     // Find inactive users
// //     const inactiveUsers = await User.find({
// //       lastActive: { $lt: thresholdDate },
// //     });

// //     for (const user of inactiveUsers) {
// //       // Prepare notification
// //       const title = "We Miss You!";
// //       const message =
// //         "It's been a while since we last saw you. Come back and explore!";
// //       const notification = {
// //         title,
// //         body: message,
// //         type: "scheduled",
// //         isRead: false,
// //         scheduledTime: new Date(),
// //       };

// //       // Save notification to DB
// //       await Notification.findOneAndUpdate(
// //         { vendorId: user._id },
// //         { $push: { notifications: notification } },
// //         { upsert: true }
// //       );

// //       // Send notification using helper
// //       if (user.firebaseToken) {
// //         await sendMessage(title, message, user.firebaseToken, user.role);
// //       }
// //     }

// //     console.log("Notifications sent to inactive users successfully.");
// //   } catch (error) {
// //     console.error("Error notifying inactive users:", error);
// //   }
// // };

// // // Function to notify newly signed-up users
// // const notifyNewUsers = async () => {
// //   try {
// //     // Fetch notification settings
// //     const settings = await SettingOfNotification.findOne();
// //     const signupDelayMinutes = settings?.newSignupWelcomeDelay || 10;

// //     // Calculate threshold time for new signups
// //     const thresholdTime = new Date();
// //     thresholdTime.setMinutes(thresholdTime.getMinutes() - signupDelayMinutes);

// //     // Find newly signed-up users
// //     const newUsers = await User.find({ createdAt: { $gte: thresholdTime } });

// //     for (const user of newUsers) {
// //       // Prepare notification
// //       const title = "Welcome to Our Platform!";
// //       const message = "Thank you for signing up! We’re thrilled to have you.";
// //       const notification = {
// //         title,
// //         body: message,
// //         type: "real-time",
// //         isRead: false,
// //         scheduledTime: new Date(),
// //       };

// //       // Save notification to DB
// //       await Notification.findOneAndUpdate(
// //         { vendorId: user._id },
// //         { $push: { notifications: notification } },
// //         { upsert: true }
// //       );

// //       // Send notification using helper
// //       if (user.firebaseToken) {
// //         await sendMessage(title, message, user.firebaseToken, user.role);
// //       }
// //     }

// //     console.log("Notifications sent to new users successfully.");
// //   } catch (error) {
// //     console.error("Error notifying new users:", error);
// //   }
// // };

// // setInterval(() => {
// //   notifyInactiveUsers();
// // }, 24 * 60 * 60 * 1000); // Run once a day for inactive users

// // setInterval(() => {
// //   notifyNewUsers();
// // }, 10 * 60 * 1000);

// const sendAnnouncement = async (req, res) => {
//   const { title, body, role } = req.body;

//   try {
//     // Fetch FCM tokens based on role (e.g., all users or specific group)
//     const fcmData = await getFcmTokens(role); // Custom function to fetch tokens

//     // Save the announcement to the database
//     await sendAnnouncementNotification(title, body, role);

//     // Send notifications using the helper
//     for (const { fcmToken, role: userRole } of fcmData) {
//       await sendMessage(title, body, fcmToken, userRole);
//     }

//     res
//       .status(200)
//       .json({ success: true, message: "Announcement sent successfully" });
//   } catch (error) {
//     console.error("Error sending announcement: ", error);
//     res
//       .status(500)
//       .json({ success: false, error: "Failed to send announcement" });
//   }
// };

// module.exports = {
//   saveToken,
//   getNotificationListForVendor,
//   sendRealTimeNotification,
//   sendAnnouncement,
// };
