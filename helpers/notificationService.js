const admin = require("../firebase/firebaseAdmin");
const Notification = require("../models/notificationModel");

// Send FCM Message
exports.sendMessage = async (title, message, fcmToken) => {
  console.log("FCM TOKEN:>>>>>>>>>>>", fcmToken);
  console.log("FCM TOKEN:>>>>>>>>>>>", fcmToken);

  const messageData = {
    notification: {
      title: title,
      body: message,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(messageData);
    console.log("Notification sent successfully: ", response);
  } catch (error) {
    console.error("Error sending notification: ", error);
    throw new Error("FCM Notification failed");
  }
};
exports.sendCallMessage = async (title, message, fcmToken, metadata) => {
  console.log("FCM TOKEN:>>>>>>>>>>>", fcmToken);
  console.log("FCM TOKEN:>>>>>>>>>>>", fcmToken);

  const messageData = {
    notification: {
      title: title,
      body: message,
    },
    data: {
      ...metadata,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(messageData);
    console.log("Notification sent successfully: ", response);
  } catch (error) {
    console.error("Error sending notification: ", error);
    throw new Error("FCM Notification failed");
  }
};

// // exports.sendMessage = async (title, message, fcmToken, firebaseAdmin) => {
// //   console.log("TOKEN_FROM sendMessage",fcmToken);
// //   console.log("ROLE FROM sendMessage",firebaseAdmin);

// //   const messagePayload = {
// //     notification: {
// //       title,
// //       body: message,
// //     },
// //     token: fcmToken,
// //   };

// //   try {
// //     const response = await firebaseAdmin.messaging().send(messagePayload);
// //     console.log("Notification sent successfully:", response);
// //   } catch (error) {
// //     console.error("Error sending notification:", error);
// //     throw error;
// //   }
// // };

// // Mark Notification as Read

// exports.markAsRead = async (notificationId) => {
//   try {
//     await Notification.findByIdAndUpdate(notificationId, { isRead: true });
//   } catch (error) {
//     console.error("Error marking notification as read: ", error);
//     throw new Error("Failed to update notification status");
//   }
// };
//================================================================
// const { getFirebaseAdmin } = require('../firebase/firebaseAdmin');

// const createMessageData = (title, message, metadata = {}) => ({
//   notification: {
//     title,
//     body: message,
//   },
//   data: {
//     ...metadata,
//     click_action: 'FLUTTER_NOTIFICATION_CLICK',
//   }
// });

// const sendMessage = async (role, title, message, fcmToken, metadata = {}) => {
//   const admin = getFirebaseAdmin(role);
//   const messageData = {
//     ...createMessageData(title, message, metadata),
//     token: fcmToken
//   };

//   try {
//     const response = await admin.messaging().send(messageData);
//     console.log("Notification sent successfully:", response);
//     return { success: true, messageId: response };
//   } catch (error) {
//     console.error("Error sending notification:", error);
//     throw new Error('FCM Notification failed');
//   }
// };

// const sendMulticast = async (role, title, message, fcmTokens, metadata = {}) => {
//   const admin = getFirebaseAdmin(role);
//   const messageData = {
//     ...createMessageData(title, message, metadata),
//     tokens: Array.isArray(fcmTokens) ? fcmTokens : [fcmTokens]
//   };

//   try {
//     const response = await admin.messaging().sendMulticast(messageData);
//     return {
//       success: true,
//       successCount: response.successCount,
//       failureCount: response.failureCount,
//       responses: response.responses
//     };
//   } catch (error) {
//     console.error("Error sending multicast notification:", error);
//     throw new Error('FCM Multicast Notification failed');
//   }
// };

// module.exports = {
//   sendMessage,
//   sendMulticast,
//   createMessageData
// };
//===================================================================================
// const {
//   firebaseUserApp,
//   firebaseVendorApp,
// } = require("../firebase/firebaseAdmin");
// // const admin = require("../firebase/firebaseAdmin");
// const Notification = require("../models/notificationModel");
// const User = require("../models/userModel");

// // Send FCM Message
// // const sendMessage = async (title, message, fcmToken, role) => {
// //   const messageData = {
// //     notification: {
// //       title: title,
// //       body: message,
// //     },
// //     token: fcmToken,
// //   };

// //   console.log(messageData);
// //   let response;
// //   try {
// //     if (role === "astrologer") {
// //       response = await firebaseVendorApp.messaging().send(messageData);
// //     } else {
// //       response = await firebaseUserApp.messaging().send(messageData);
// //     }

// //     console.log("Notification sent successfully: ", response);
// //   } catch (error) {
// //     console.error("Error sending notification: ", error);
// //     // throw new Error("FCM Notification failed");
// //   }
// // };

// // Improved send message function with better error handling
// const sendMessage = async (title, message, fcmToken, role) => {
//   if (!fcmToken) {
//     throw new Error('FCM Token is required');
//   }

//   const messageData = {
//     notification: {
//       title: title,
//       body: message,
//     },
//     token: fcmToken,
//   };

//   try {
//     const app = role === "customer" ?  firebaseUserApp:firebaseVendorApp ;
//     const response = await app.messaging().send(messageData);
//     console.log("Notification sent successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending notification:", error);

//     // More specific error handling
//     if (error.code === 'app/invalid-credential') {
//       console.error('Invalid credentials. Please check your service account key file.');
//     } else if (error.code === 'messaging/invalid-registration-token') {
//       console.error('Invalid FCM token.');
//     } else if (error.code === 'messaging/registration-token-not-registered') {
//       console.error('FCM token is no longer valid.');
//     }

//     throw error; // Re-throw to handle it in the calling function
//   }
// };

// const sendAnnouncement = async (topic, title, message) => {
//   const payload = {
//     notification: {
//       title: title,
//       body: message,
//     },
//     topic: topic,
//   };

//   try {
//     await admin.messaging().send(payload);
//     console.log("Announcement sent successfully");
//   } catch (error) {
//     console.error("Error sending announcement:", error);
//     throw new Error("FCM Notification failed", error);
//   }
// };

// const subscribeToTopic = async (deviceToken, topic) => {
//   try {
//     await admin.messaging().subscribeToTopic(deviceToken, topic);
//     console.log("Successfully subscribed to topic:", topic);
//   } catch (error) {
//     console.error("Error subscribing to topic:", error);
//   }
// };

// const sendNotification = async (deviceToken, title, message) => {
//   const payload = {
//     notification: {
//       title: title,
//       body: message,
//     },
//   };

//   try {
//     await admin.messaging().sendToDevice(deviceToken, payload);
//     console.log("Notification sent successfully");
//   } catch (error) {
//     console.error("Error sending notification:", error);
//   }
// };

// const getFcmTokens = async (role) => {
//   try {
//     let query = { FCM: { $exists: true, $ne: null } };

//     // Define query based on audience type
//     if (role === "all") {
//       // No filter; fetch tokens for all users
//       query = query;
//     } else if (role === "astrologers") {
//       query = { role: "astrologer" };
//     } else if (role === "customer") {
//       query = { role: "customer" };
//     } else {
//       throw new Error("Invalid audience type");
//     }

//     // Assuming you have a User model with an fcmToken field
//     const users = await User.find(query);

//     // Extract and return the tokens as an array
//     const fcmData = users
//       .filter((user) => user.FCM) // Ensure FCM token exists
//       .map((user) => ({
//         fcmToken: user.FCM,
//         role: user.role,
//       }));

//     return fcmData;
//   } catch (error) {
//     console.error("Error fetching FCM tokens: ", error);
//     throw new Error("Failed to fetch FCM tokens");
//   }
// };

// const sendAnnouncementNotification = async (title, body, role) => {
//   try {
//     let targetUsers = [];

//     console.log(role);
//     // Fetch users based on the audience type
//     if (role === "customer") {
//       targetUsers = await User.find({ role: "customer" });
//     } else if (role === "astrologers") {
//       targetUsers = await User.find({ role: "astrologer" });
//     } else if (role === "all") {
//       targetUsers = await User.find({});
//     } else {
//       throw new Error(
//         "Invalid audience type. Must be 'users', 'astrologers', or 'all'."
//       );
//     }

//     const notificationMessage = {
//       title,
//       body,
//     };

//     for (const user of targetUsers) {
//       const notificationRecord = await Notification.findOne({
//         vendorId: user._id,
//       });

//       if (notificationRecord) {
//         // Add notification to the user's notifications array
//         notificationRecord.notifications.push({
//           ...notificationMessage,
//           createdAt: new Date(),
//           isRead: false,
//         });
//         await notificationRecord.save();
//       } else {
//         // Create a new notification record if it doesn't exist
//         const newNotification = new Notification({
//           vendorId: user._id,
//           notifications: [
//             {
//               ...notificationMessage,
//               createdAt: new Date(),
//               isRead: false,
//             },
//           ],
//         });
//         await newNotification.save();
//       }
//     }

//     console.log("Announcement sent successfully!");
//   } catch (error) {
//     console.error("Error sending announcement notification: ", error);
//     // throw new Error("Failed to send announcement notification.");
//   }
// };

// module.exports = {
//   sendMessage,
//   sendAnnouncement,
//   getFcmTokens,
//   sendAnnouncementNotification,
// };
