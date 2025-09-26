const mongoose = require("mongoose");

const gemstoneQuerySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    gemstoneId: { type: mongoose.Schema.Types.ObjectId, ref: "Gemstone" },
    queryType: { type: String, enum: ["purchase", "inquiry"], default: "inquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved", "cancelled"], default: "pending" },
    response: { type: String },
    respondedAt: { type: Date },
    mobile: {
      type: Number
    },
    email: {
      type: String
    }
  }, { timestamps: true }
);

module.exports = mongoose.model("GemstoneQuery", gemstoneQuerySchema);
