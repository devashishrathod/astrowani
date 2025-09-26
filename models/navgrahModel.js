const mongoose = require('mongoose');

const navgrahSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  remedies: {
    type: String, // Remedies associated with the graha
    required: false,
  },
  mantra: {
    type: String, // Mantra for the graha
    required: false,
  },
  effects: {
    type: String, // Effects of the graha in a chart
    required: false,
  },
  deity: {
    type: String, // Deity associated with the graha
    required: false,
  },
  color: {
    type: String, // Color associated with the graha
    required: false,
  },
  gemstone: {
    type: String, // Gemstone associated with the graha
    required: false,
  },
  metal: {
    type: String, // Metal associated with the graha
    required: false,
  },
  status: {
    type: Boolean, // Enable or disable the graha display
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Navgrah', navgrahSchema);
