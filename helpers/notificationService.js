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

// Send Push Message on call
exports.sendCallMessage = async (title, message, fcmToken, metadata) => {
  console.log("FCM TOKEN:>>>>>>>>>>>", fcmToken);
  const messageData = {
    notification: {
      title: title,
      body: message,
    },
    android: {
      notification: {
        sound: "ringtone",
        channelId: "calls",
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "ringtone",
        },
      },
    },
    data: {
      ...metadata,
      type: "call",
    },
    token: fcmToken,
  };
  try {
    const response = await admin.messaging().send(messageData);
    console.log("Notification sent successfully: ", response);
  } catch (error) {
    console.error("Error sending notification: ", error);
  }
};
