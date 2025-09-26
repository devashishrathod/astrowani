const mongoose = require("mongoose");

const groupPujaSchema = new mongoose.Schema(
  {
    pujaName: { type: String, required: true },
    description: { type: String, required: true },
    bio: { type: String },
    pujaSold: { type: Number },
    pujaGodGoddes: { type: String },
    date: { type: Date, required: true },
    duration: { type: String, required: true }, // e.g., '2 hours'
    location: { type: String, required: true },
    price: { type: Number, required: true },
    maxParticipants: { type: Number, required: true },
    bookedParticipants: { type: Number, default: 0 },
    image: { type: String },
    Benefits: [String],
    astrologer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupPuja", groupPujaSchema);
