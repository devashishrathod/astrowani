const Gemstone = require("../../models/astroServices/gemstoneSchema");

// Get all gemstones with optional pagination
exports.getAllGemstones = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 gemstones per page
    const skip = (page - 1) * limit;

    const gemstones = await Gemstone.find().skip(skip).limit(limit);
    const totalGemstones = await Gemstone.countDocuments();

    res.status(200).json({
      totalGemstones,
      totalPages: Math.ceil(totalGemstones / limit),
      currentPage: page,
      gemstones,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching gemstones", error });
  }
};

// Get gemstone by ID
exports.getGemstoneById = async (req, res) => {
  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) {
      return res.status(404).json({ message: "Gemstone not found" });
    }
    res.status(200).json(gemstone);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new gemstone
exports.createGemstone = async (req, res) => {
  try {
    const { name, description, price, additionalInfo } = req.body;

    // Basic validation
    if (!name || !description || !price || !additionalInfo.carat) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const gemstone = new Gemstone(req.body);
    await gemstone.save();
    res.status(201).json(gemstone);
  } catch (error) {
    res.status(400).json({ message: "Error creating gemstone", error });
  }
};

// Update a gemstone
exports.updateGemstone = async (req, res) => {
  try {
    const gemstone = await Gemstone.findById(req.params.id);
    if (!gemstone) {
      return res.status(404).json({ message: "Gemstone not found" });
    }

    // Merge existing data with the new data
    Object.assign(gemstone, req.body);

    // Save updated gemstone
    await gemstone.save();
    res.status(200).json(gemstone);
  } catch (error) {
    res.status(400).json({ message: "Error updating gemstone", error });
  }
};

// Delete a gemstone
exports.deleteGemstone = async (req, res) => {
  try {
    const gemstone = await Gemstone.findByIdAndDelete(req.params.id);
    if (!gemstone) {
      return res.status(404).json({ message: "Gemstone not found" });
    }
    res.status(200).json({ message: "Gemstone deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
