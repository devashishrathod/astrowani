const mongoose = require("mongoose");
const WalletTransactionSchema = new mongoose.Schema(
    {
      walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
      },
      type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      referenceId: {
        type: String,
        // For payment gateway reference
      },
      metadata: {
        // Additional information about the transaction
        sessionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Session",
        },
        appointmentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Appointment",
        },
      },
    },
    { timestamps: true }
  );
  module.exports =mongoose.model("WalletTransaction", WalletTransactionSchema);