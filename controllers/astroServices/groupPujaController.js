const GroupPuja = require("../../models/astroServices/groupPujaSchema");

// Get all group pujas with optional pagination
exports.getAllGroupPujas = async (req, res) => {
  try {
    // Set default values for page and limit if not provided
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 pujas per page

    // Calculate the number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Fetch the group pujas with pagination
    const pujas = await GroupPuja.find().skip(skip).limit(limit);

    // Get the total count of group pujas
    const totalPujas = await GroupPuja.countDocuments();

    // Send response with pagination info
    res.status(200).json({
      totalPujas,
      totalPages: Math.ceil(totalPujas / limit),
      currentPage: page,
      pujas,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new group puja
exports.createGroupPuja = async (req, res) => {
  try {
    const {
      pujaName,
      description,
      date,
      duration,
      location,
      price,
      maxParticipants,
      astrologer,
      Benefits,
    } = req.body;

    // Basic validation
    if (
      !pujaName ||
      !description ||
      !date ||
      !duration ||
      !location ||
      !price ||
      !maxParticipants ||
      !astrologer
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    // Create a new puja document
    const puja = new GroupPuja({
      pujaName,
      description,
      date,
      duration,
      location,
      price,
      maxParticipants,
      astrologer,
      Benefits: Benefits || [], // Initialize with an empty array if no benefits provided
    });

    // Save the new puja
    await puja.save();

    res.status(201).json(puja);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating puja", error });
  }
};

// Update a group puja with the ability to add or remove benefits
exports.updateGroupPuja = async (req, res) => {
  try {
    const { addBenefits, removeBenefits } = req.body;

    // Find the puja by ID
    const puja = await GroupPuja.findById(req.params.id);

    if (!puja) {
      return res.status(404).json({ message: "Puja not found" });
    }

    // Add new benefits if provided
    if (addBenefits && Array.isArray(addBenefits)) {
      puja.Benefits.push(...addBenefits);
    }

    // Remove specific benefits if provided
    if (removeBenefits && Array.isArray(removeBenefits)) {
      puja.Benefits = puja.Benefits.filter(
        (benefit) => !removeBenefits.includes(benefit)
      );
    }

    // Update other fields (if needed)
    Object.assign(puja, req.body);

    // Save the updated puja
    await puja.save();

    res.status(200).json(puja);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error updating puja", error });
  }
};

// Delete a group puja
exports.deleteGroupPuja = async (req, res) => {
  try {
    const puja = await GroupPuja.findByIdAndDelete(req.params.id);
    if (!puja) {
      return res.status(404).json({ message: "Puja not found" });
    }
    res.status(200).json({ message: "Puja deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
