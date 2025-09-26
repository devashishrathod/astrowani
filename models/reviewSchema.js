const mongoose = require("mongoose");
const { Schema } = mongoose;

// Review Schema
const ReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    astrologer: {
      type: Schema.Types.ObjectId,
      ref: "Astrologer",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide a rating between 1 and 5"],
    },
    comment: {
      type: String,
      required: [true, "Please provide a comment for your review"],
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
