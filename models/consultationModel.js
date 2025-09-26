const mongoose = require("mongoose");

const ConsultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
    },
    type: {
      type: String,
      enum: ["chat", "call", "video"],
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
    questions: [{
      type: String,
      trim: true,
    }],
    preferences: {
      language: {
        type: String,
        required: true,
      },
      // Additional consultation preferences
    },
    notes: {
      type: String,
      trim: true,
    },
    payment: {
      status: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      paidAmount: Number,
    },
  }, { timestamps: true }
);
module.exports = mongoose.model("Consultation", ConsultationSchema);