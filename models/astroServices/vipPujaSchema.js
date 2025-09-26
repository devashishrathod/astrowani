const mongoose = require("mongoose");

const vipPujaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: { type: String },
    description: {
      type: String,
      required: true,
    },
    pujaSold: {
      type: Number,
      default: 0, // Assuming this tracks the number of times the puja has been sold
    },
    typesOfPuja: {
      type: String,
      enum: ["laghu", "maha", "beej mantra", "puranic", "vedic"],
      required: true,
    },
    daysOfPuja: {
      type: Number,
      required: true, // Number of days the puja takes
    },
    pujaGodGoddess: {
      type: String,
      required: true, // Name of the God or Goddess the puja is for
    },
    typeOfMantra: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["both", "male", "female"],
      default: "both",
    },
    benefits: {
      type: [String], // Array of strings for the benefits of the puja
      required: true,
    },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VipPuja", vipPujaSchema);
