const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const { protect } = require("../middleware/authMiddleware");

// Get the current active banner
router.get("/current", bannerController.getCurrentBanner);

// Set a new banner (create or update)
router.put("/set", bannerController.setBanner);

router.post('/add', /* protect, */ bannerController.addBanner)

router.put('/update/:id', /* protect, */ bannerController.updateBanner)

// Get all banners
router.get("/all", bannerController.getAllBanners);

// Delete a banner by ID
router.delete("/:id", bannerController.deleteBanner);

module.exports = router;
