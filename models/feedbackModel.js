const mongoose = require("mongoose");
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating from 1 to 5
  }, { timestamps: true }
);

const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;