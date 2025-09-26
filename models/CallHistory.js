const mongoose = require("mongoose");

const CallHistorySchema = new mongoose.Schema(
  {
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming User schema has astrologers
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming User schema has clients
      required: true,
    },
    callStartTime: {
      type: Date,
      required: true,
    },
    callEndTime: {
      type: Date,
      required: true,
    },
    callDuration: {
      type: Number, // Duration in minutes
      required: true,
    },
    callStatus: {
      type: String,
      enum: ["completed", "missed", "canceled"],
      default: "completed",
    },
    rating: {
      type: Number, // Rating out of 5
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CallHistory", CallHistorySchema);
