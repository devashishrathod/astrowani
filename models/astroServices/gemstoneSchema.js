const mongoose = require("mongoose");

const gemstoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    availability: { type: Boolean, default: true },
    additionalInfo: {
      carat: { type: Number, required: true },
      zodiacSign: { type: String },
      weightInRatti: Number,
      weightInGrams: Number,
      colour: String,
      origin: String,
      quality: String,
      shape: String,
      mantra: String,
      size: String,
      certification: String,
      treatment: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gemstone", gemstoneSchema);
