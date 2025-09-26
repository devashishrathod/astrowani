const Review = require("../models/reviewSchema");
const Astrologer = require("../models/astrologerModel");
const { default: mongoose } = require("mongoose");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { astrologerId, rating, comment } = req.body;
    const userId = req.user._id;
    // const userId = "67a356cb27c3c1d1c666d439"

    // Check if the astrologer exists
    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return res.status(404).json({ message: "Astrologer not found" });
    }

    // Check if the user has already reviewed this astrologer
    // const existingReview = await Review.findOne({
    //   user: userId,
    //   astrologer: astrologerId,
    // });
    // if (existingReview) {
    //   return res
    //     .status(400)
    //     .json({ message: "You have already reviewed this astrologer" });
    // }

    const newReview = new Review({ user: userId, astrologer: astrologerId, rating, comment, });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error: error.message });
  }
};

// Get all reviews for an astrologer
exports.getAllReviews = async (req, res) => {
  try {
    // const { astrologerId } = req.params;
    const astrologerId = req.user?._id
    const reviews = await Review.find().populate({ path: "user", select: "firstName lastName email profilePic mobile", }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// Get all reviews for an astrologer
exports.getAstrologerReviews = async (req, res) => {
  try {
    const { astrologerId } = req.params;
    const reviews = await Review.find({ astrologer: astrologerId }).populate({ path: "user", select: "firstName lastName email profilePic", }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
   /*  if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this review" });
    } */

    review.rating = rating;
    review.comment = comment;

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id; // Assuming you have user authentication middleware

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this review" });
    }

    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: error.message });
  }
};

// Get average rating for an astrologer
exports.getAstrologerAverageRating = async (req, res) => {
  try {
    const { astrologerId } = req.params;
    const result = await Review.aggregate([
      { $match: { astrologer: new mongoose.Types.ObjectId(astrologerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length > 0) {
      res.status(200).json({
        averageRating: result[0].averageRating,
        totalReviews: result[0].totalReviews,
      });
    } else {
      res.status(200).json({ averageRating: 0, totalReviews: 0 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching average rating", error: error.message });
  }
};


// exports.getTopRatedAstrologers = async (req, res) => {
//   try {
//     const topRatedAstrologers = await Review.aggregate([
//       {
//         $group: {
//           _id: "$astrologer",
//           averageRating: { $avg: "$rating" },
//           totalReviews: { $sum: 1 },
//         },
//       },
//       {
//         $sort: { averageRating: -1, totalReviews: -1 },
//       },
//       {
//         $limit: 1, // Change this number to fetch more than one astrologer
//       },
//     ]);

//     if (!topRatedAstrologers.length) {
//       return res.status(404).json({ message: "No astrologers found" });
//     }

//     // Populate astrologer details for the top-rated astrologer(s)
//     const populatedAstrologers = await Astrologer.find({
//       _id: { $in: topRatedAstrologers.map((item) => item._id) },
//     }).select("name profilePic bio"); // Adjust fields as per your schema

//     res.status(200).json(populatedAstrologers);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching top-rated astrologers", error: error.message });
//   }
// };


exports.getTopRatedAstrologers = async (req, res) => {
  try {
    const topRatedAstrologers = await Review.aggregate([
      {
        $group: {
          _id: "$astrologer",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
      {
        $sort: { averageRating: -1, totalReviews: -1 },
      },
      {
        $limit: 5, // Adjust the number to fetch multiple top astrologers
      },
    ]);

    if (!topRatedAstrologers.length) {
      return res.status(404).json({ message: "No astrologers found" });
    }

    // Fetch detailed astrologer information and merge with aggregation results
    const astrologerIds = topRatedAstrologers.map((item) => item._id);
    const astrologers = await Astrologer.find({ _id: { $in: astrologerIds } })
      .select("name profilePic bio profileImage")
      .lean();

    // Merge astrologer details with aggregation data
    const result = topRatedAstrologers.map((item) => {
      const astrologer = astrologers.find(
        (astro) => astro._id.toString() === item._id.toString()
      );
      return {
        astrologer: astrologer || {},
        averageRating: item.averageRating,
        totalReviews: item.totalReviews,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching top-rated astrologers",
      error: error.message,
    });
  }
};
