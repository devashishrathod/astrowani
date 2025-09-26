const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
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
      date: {
        type: Date,
        required: true,
      },
      timeSlot: {
        start: {
          type: Date,
          required: true,
        },
        end: {
          type: Date,
          required: true,
        },
      },
      status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed", "rescheduled"],
        default: "pending",
      },
      type: {
        type: String,
        enum: ["personal", "career", "relationship", "health", "other"],
        required: true,
      },
      concernDetails: {
        type: String,
        required: true,
      },
      birthDetails: {
        date: Date,
        time: String,
        place: String,
      },
      payment: {
        amount: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "completed", "failed", "refunded"],
          default: "pending",
        },
        transactionId: String,
      },
      reminderSent: {
        type: Boolean,
        default: false,
      },
  
    },
    { timestamps: true }
  );
  module.exports = mongoose.model("Appointment", AppointmentSchema);