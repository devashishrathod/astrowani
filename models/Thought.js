const mongoose = require("mongoose");

const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: false,
            trim: true,
            default: "Anonymous",
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
    },
    { timestamps: true, strict: false }
);

module.exports = mongoose.model("Thought", thoughtSchema);
