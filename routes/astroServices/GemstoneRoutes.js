const express = require("express");
const router = express.Router();
const gemstoneController = require("../../controllers/astroServices/gemstoneController");

router.get("/gemstones", gemstoneController.getAllGemstones);
router.get("/gemstones/:id", gemstoneController.getGemstoneById);
router.post("/gemstones", gemstoneController.createGemstone);
router.put("/gemstones/:id", gemstoneController.updateGemstone);
router.delete("/gemstones/:id", gemstoneController.deleteGemstone);

module.exports = router;
