const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    maxMessages: { type: Number },
    maxMessageSize: { type: Number },
    duration: { type: Number, required: true, default: 28 },
    questions: { type: Number, required: true },
    includesRemedies: { type: Boolean, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
