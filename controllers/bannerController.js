const Banner = require("../models/BannerModel");

// Get the current banner
exports.getCurrentBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ isActive: true });
    if (!banner) {
      return res.status(404).json({ message: "No active banner found" });
    }
    res.status(200).json(banner);
  } catch (error) {
    console.error("Error fetching the current banner:", error);
    res.status(500).json({ message: "Failed to fetch banner" });
  }
};

// Create or update a banner
// exports.setBanner = async (req, res) => {
//   const { title, description, imageUrl } = req.body;

//   if (!imageUrl) {
//     return res.status(400).json({ message: "Image URL is required" });
//   }

//   try {
//     // Deactivate existing banners
//     await Banner.updateMany({ isActive: true }, { isActive: false });

//     // Create a new banner
//     const newBanner = new Banner({ title, description, imageUrl, isActive: true });
//     await newBanner.save();

//     res.status(201).json({
//       message: "Banner set successfully",
//       banner: newBanner,
//     });
//   } catch (error) {
//     console.error("Error setting banner:", error);
//     res.status(500).json({ message: "Failed to set banner" });
//   }
// };

// Create or update a banner
exports.setBanner = async (req, res) => {
  const { title, description, imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    // Check if an active banner already exists
    const existingBanner = await Banner.findOne({ isActive: true });

    if (existingBanner) {
      // Update the existing active banner
      existingBanner.title = title || existingBanner.title;
      existingBanner.description = description || existingBanner.description;
      existingBanner.imageUrl = imageUrl || existingBanner.imageUrl;
      await existingBanner.save();

      return res.status(200).json({ message: "Banner updated successfully", banner: existingBanner, });
    } else {
      // Create a new banner if no active banner exists
      const newBanner = new Banner({ title, description, imageUrl, isActive: true });
      await newBanner.save();

      return res.status(201).json({ message: "Banner created successfully", banner: newBanner, });
    }
  } catch (error) {
    console.error("Error setting banner:", error);
    res.status(500).json({ message: "Failed to set banner" });
  }
};

exports.addBanner = async (req, res) => {

  // console.log("req.body: ", req.body);
  const title = req.body?.title
  const description = req.body?.description
  const imageUrl = req.body?.imageUrl
  try {
    const checkBanner = await Banner.findOne({ title, });
    if (checkBanner) {
      return res.status(400).json({ message: "Banner already exists" });
    }
    const newBanner = new Banner({ title, description, imageUrl, isActive: true });
    await newBanner.save();
    res.status(201).json({ message: "Banner created successfully", banner: newBanner, });
  } catch (error) {
    console.error("Error setting addBanner:", error);
    res.status(500).json({ message: "Failed to set add banner" });
  }
}

exports.updateBanner = async (req, res) => {
  const id = req.params?.id
  const title = req.body?.title
  const description = req.body?.description
  const imageUrl = req.body?.imageUrl
  try {
    const checkBanner = await Banner.findById(id)
    if (!checkBanner) {
      return res.status(400).json({ message: "Banner not found" });
    }
    checkBanner.title = title || checkBanner.title
    checkBanner.description = description || checkBanner.description
    checkBanner.imageUrl = imageUrl || checkBanner.imageUrl
    await checkBanner.save();
    res.status(201).json({ message: "Banner updated successfully", banner: checkBanner, });
  } catch (error) {
    console.error("Error setting updateBanner:", error);
    res.status(500).json({ message: "Failed to set update banner" });
  }
}


// Delete a banner by ID
exports.deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.status(200).json({ message: "Banner deleted successfully", banner, });
  } catch (error) {
    console.error("Error deleting banner:", error);
    res.status(500).json({ message: "Failed to delete banner" });
  }
};

// Get all banners (for management) with optional pagination
exports.getAllBanners = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    // Convert to integers for pagination calculations
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch banners with pagination
    const banners = await Banner.find().sort({ createdAt: -1 }).skip(skip).limit(limitNumber);

    // Total count for banners
    const totalBanners = await Banner.countDocuments();

    // Response with pagination details
    res.status(200).json({ data: banners, totalBanners, totalPages: Math.ceil(totalBanners / limitNumber), currentPage: pageNumber, hasNextPage: pageNumber * limitNumber < totalBanners, hasPrevPage: pageNumber > 1, });
  } catch (error) {
    console.error("Error fetching all banners:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
};
