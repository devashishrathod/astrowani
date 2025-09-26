// models/notificationModel.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // type: {
    //   type: String,
    //   enum: [
    //     "appointment", 
    //     "payment", 
    //     "message", 
    //     "reminder", 
    //     "announcement",
    //     "session",
    //     "support",
    //   ],
    //   required: true,
    // },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
   
    isRead: {
      type: Boolean,
      default: false,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "normal", "high"],
      default: "normal",
    },
    metadata: {
      // Additional information
      appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
