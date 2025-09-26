const Horoscope = require('../models/horoscopeModel');

// Create a horoscope
exports.createHoroscope = async (req, res) => {
  try {
    const { zodiacSign, type, dateRange, description, luckyNumber, luckyColor, Image } = req.body;
    const horoscope = new Horoscope({
      zodiacSign, type, dateRange, description, luckyNumber, luckyColor, createdBy: req.astrologerId, Image // Assuming astrologer's ID is retrieved from middleware
    });
    const savedHoroscope = await horoscope.save();
    res.status(201).json(savedHoroscope);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all horoscopes
exports.getAllHoroscopes = async (req, res) => {
  // console.log("Get all horoscopes");

  try {
    const horoscopes = await Horoscope.find().sort({ createdAt: -1 }) //.populate('createdBy', 'name'); // Optionally populate astrologer's info
    res.status(200).json(horoscopes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get horoscopes by zodiac sign and type
exports.getHoroscopeBySignAndType = async (req, res) => {
  try {
    const { zodiacSign, type } = req.params;
    const horoscopes = await Horoscope.find({ zodiacSign, type });
    if (!horoscopes.length) {
      return res.status(404).json({ message: "No horoscopes found for this zodiac sign and type." });
    }
    res.status(200).json(horoscopes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a horoscope
exports.updateHoroscope = async (req, res) => {
  try {
    const horoscope = await Horoscope.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!horoscope) {
      return res.status(404).json({ message: "Horoscope not found" });
    }
    res.status(200).json(horoscope);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a horoscope
exports.deleteHoroscope = async (req, res) => {
  try {
    const horoscope = await Horoscope.findByIdAndDelete(req.params.id);
    if (!horoscope) {
      return res.status(404).json({ message: "Horoscope not found" });
    }
    res.status(200).json({ message: "Horoscope deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
