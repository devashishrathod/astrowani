const VipPuja = require("../../models/astroServices/vipPujaSchema");

// Get all VIP Pujas
const getAllVipPujas = async (req, res) => {
  try {
    // Set default values for page and limit if not provided
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 pujas per page

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch the group pujas with pagination
    const vipPujas = await VipPuja.find().skip(skip).limit(limit);

    // Get the total count of group pujas
    const totalVipPujas = await VipPuja.countDocuments();

    // Send response with pagination info
    res.status(200).json({
      totalVipPujas,
      totalPages: Math.ceil(totalVipPujas / limit),
      currentPage: page,
      vipPujas,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Get a single VIP Puja by ID
const getVipPujaById = async (req, res) => {
  try {
    const vipPuja = await VipPuja.findById(req.params.id);
    if (!vipPuja) {
      return res.status(404).json({ message: "VIP Puja not found" });
    }
    res.status(200).json(vipPuja);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new VIP Puja
const createVipPuja = async (req, res) => {
  const {
    name,
    description,
    pujaSold,
    typesOfPuja,
    daysOfPuja,
    pujaGodGoddess,
    typeOfMantra,
    gender,
    price,
    image,
    benefits,
  } = req.body;

  try {
    const newVipPuja = new VipPuja({
      name,
      description,
      pujaSold,
      typesOfPuja,
      daysOfPuja,
      pujaGodGoddess,
      typeOfMantra,
      gender,
      price,
      image,
      benefits,
    });

    const savedVipPuja = await newVipPuja.save();
    res.status(201).json(savedVipPuja);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing VIP Puja by ID
const updateVipPuja = async (req, res) => {
  try {
    const updatedVipPuja = await VipPuja.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Returns the updated document
        runValidators: true, // Validates the updates against the schema
      }
    );

    if (!updatedVipPuja) {
      return res.status(404).json({ message: "VIP Puja not found" });
    }

    res.status(200).json(updatedVipPuja);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a VIP Puja by ID
const deleteVipPuja = async (req, res) => {
  try {
    const deletedVipPuja = await VipPuja.findByIdAndDelete(req.params.id);
    if (!deletedVipPuja) {
      return res.status(404).json({ message: "VIP Puja not found" });
    }
    res.status(200).json({ message: "VIP Puja deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllVipPujas,
  getVipPujaById,
  createVipPuja,
  updateVipPuja,
  deleteVipPuja,
};
