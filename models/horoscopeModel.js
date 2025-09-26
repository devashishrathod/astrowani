const mongoose = require('mongoose');

const horoscopeSchema = new mongoose.Schema({
  zodiacSign: {
    type: String,
    required: true,
    enum: [
      "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
      "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ["Daily", "Weekly", "Monthly", "Yearly"], // The type of horoscope
  },
  dateRange: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Horoscope content
  },
  luckyNumber: {
    type: Number,
    required: false,
  },
  luckyColor: {
    type: String,
    required: false,
  },
  Image: {
    type: String,
  },

}, { timestamps: true });

module.exports = mongoose.model('Horoscope', horoscopeSchema);
