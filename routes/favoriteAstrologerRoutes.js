const express = require("express");
const {
  addFavoriteAstrologer,
  removeFavoriteAstrologer,
  getFavoriteAstrologers,
} = require("../controllers/favoriteAstrologerController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addFavoriteAstrologer);
router.post("/remove", protect, removeFavoriteAstrologer);
router.get("/", protect, getFavoriteAstrologers);

module.exports = router;
