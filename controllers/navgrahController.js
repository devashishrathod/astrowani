const Navgrah = require('../models/navgrahModel');

// Create a new Navgrah
exports.createNavgrah = async (req, res) => {
  try {
    const navgrah = new Navgrah(req.body);
    const savedNavgrah = await navgrah.save();
    res.status(201).json(savedNavgrah);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Navgrah
exports.getAllNavgrah = async (req, res) => {
  try {
    const navgrahs = await Navgrah.find();
    res.status(200).json(navgrahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Navgrah by ID
exports.getNavgrahById = async (req, res) => {
  try {
    const navgrah = await Navgrah.findById(req.params.id);
    if (!navgrah) {
      return res.status(404).json({ message: 'Navgrah not found' });
    }
    res.status(200).json(navgrah);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Navgrah
exports.updateNavgrah = async (req, res) => {
  try {
    const navgrah = await Navgrah.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!navgrah) {
      return res.status(404).json({ message: 'Navgrah not found' });
    }
    res.status(200).json(navgrah);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Navgrah
exports.deleteNavgrah = async (req, res) => {
  try {
    const navgrah = await Navgrah.findByIdAndDelete(req.params.id);
    if (!navgrah) {
      return res.status(404).json({ message: 'Navgrah not found' });
    }
    res.status(200).json({ message: 'Navgrah deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
