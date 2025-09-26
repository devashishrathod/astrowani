const User = require("../models/userModel");
const Astrologer = require("../models/astrologerModel");

exports.addFavoriteAstrologer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { astrologerId } = req.body;

    const user = await User.findById(userId);
    const astrologer = await Astrologer.findById(astrologerId);

    if (!user || !astrologer) {
      return res
        .status(404)
        .json({ success: false, message: "User or Astrologer not found" });
    }

    if (user.favoriteAstrologer.includes(astrologerId)) {
      return res.status(400).json({
        success: false,
        message: "Astrologer is already in favorites",
      });
    }

    user.favoriteAstrologer.push(astrologerId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Astrologer added to favorites",
      favoriteAstrologer: user.favoriteAstrologer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFavoriteAstrologer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { astrologerId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.favoriteAstrologer = user.favoriteAstrologer.filter(
      (id) => id.toString() !== astrologerId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Astrologer removed from favorites",
      favoriteAstrologer: user.favoriteAstrologer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFavoriteAstrologers = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: "favoriteAstrologer",
      populate: {
        path: "specialties",
        model: "Category",
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, favoriteAstrologer: user.favoriteAstrologer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
