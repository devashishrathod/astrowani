const Feedback = require("../models/feedbackModel");

// Create Feedback
const createFeedback = async (req, res) => {
  try {
    // const { comment, rating, userId } = req.body;
    const { comment, rating } = req.body;

    const newFeedback = new Feedback({ userId: req.user._id, comment, rating, });
    // const newFeedback = new Feedback({ userId: userId, comment, rating, });

    await newFeedback.save();
    res.status(201).json({ success: true, data: newFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const page = parseInt(req.query.page) || 1;   // Default page is 1

    // Fetch feedback with pagination
    const feedbacks = await Feedback.find().populate("userId", "firstName lastName profilePic email") // Populate user details
      .limit(limit)                    // Limit results
      .skip((page - 1) * limit)        // Skip documents for pagination
      .exec();

    // Count total feedback for pagination info
    const totalFeedbacks = await Feedback.countDocuments();

    res.status(200).json({ success: true, data: feedbacks, pagination: { currentPage: page, totalPages: Math.ceil(totalFeedbacks / limit), totalFeedbacks, }, });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get Feedback by ID
const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id).populate("userId", "name email").exec();

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }

    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Feedback
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { comment, rating },
      { new: true } // Return the updated document
    ).populate("userId", "name email");

    if (!updatedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }

    res.status(200).json({ success: true, data: updatedFeedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Feedback
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFeedback = await Feedback.findByIdAndDelete(id);

    if (!deletedFeedback) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }

    res.status(200).json({ success: true, message: "Feedback deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTopRatedFeedback = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default limit is 5

    // Fetch feedbacks sorted by rating in descending order
    const feedbacks = await Feedback.find()
      .sort({ rating: -1 }) // Sort by highest rating
      .limit(limit) // Limit the number of results
      .populate("userId", "firstName lastName profilePic email") // Populate user details
      .exec();

    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  getTopRatedFeedback
};
