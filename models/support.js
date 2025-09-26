const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String
    },
    role: {
      type: String,
    },
    issueType: {
      type: String,
      required: true,
      enum: [
        "Technical Issue",
        "Account Related Issue",
        "Refund Request",
        "Feedback",
        "Other",
        "General Inquiry"
      ],
      default: "General Inquiry",
    },
    supportType: {
      type: String,
      required: true,
      enum: [
        "Contact Support",
        "Feedback",
      ],
      default: "Contact Support",
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
