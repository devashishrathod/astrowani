const GemstoneQuery = require("../../models/astroServices/gemstoneQuery");

// Create a new query
exports.createGemstoneQuery = async (req, res) => {
  try {
    const { userId, gemstoneId, queryType, message, mobile, email } = req.body;

    const newQuery = new GemstoneQuery({ userId: req.user._id, gemstoneId, queryType, message, mobile, email });

    const savedQuery = await newQuery.save();

    res.status(201).json({ success: true, message: "Query submitted successfully.", data: savedQuery, });
  } catch (error) {
    console.error("Error creating gemstone query:", error);
    res.status(500).json({ success: false, message: "Failed to submit query.", });
  }
};

// Get all queries
// Get all queries with optional pagination and limits
exports.getAllQueries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    const queries = await GemstoneQuery.find().populate("userId gemstoneId").skip((page - 1) * limit).limit(parseInt(limit, 10));

    const totalQueries = await GemstoneQuery.countDocuments();

    res.status(200).json({ success: true, data: queries, meta: { totalQueries, totalPages: Math.ceil(totalQueries / limit), currentPage: parseInt(page, 10), limit: parseInt(limit, 10), }, });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({ success: false, message: "Failed to fetch queries.", });
  }
};


// Get queries by user
exports.getQueriesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userQueries = await GemstoneQuery.find({ userId }).populate("gemstoneId");

    res.status(200).json({ success: true, data: userQueries, });
  } catch (error) {
    console.error("Error fetching user's queries:", error);
    res.status(500).json({ success: false, message: "Failed to fetch queries for user.", });
  }
};

// Update query
exports.updateQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;

    const updatedQuery = await GemstoneQuery.findByIdAndUpdate(
      id,
      {
        status,
        response,
        respondedAt: response ? new Date() : undefined,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Query updated successfully.",
      data: updatedQuery,
    });
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update query.",
    });
  }
};

// Delete a query
exports.deleteQuery = async (req, res) => {
  try {
    const { id } = req.params;

    await GemstoneQuery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Query deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete query.",
    });
  }
};
